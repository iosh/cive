import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { BlockNotFoundError } from '../../errors/block.js'
import {
  TransactionNotFoundError,
  TransactionReceiptNotFoundError,
  WaitForTransactionReceiptTimeoutError,
} from '../../errors/transaction.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { Hash } from '../../types/misc.js'
import { type ObserveErrorType, observe } from '../../types/observe.js'
import type { Transaction } from '../../types/transaction.js'
import { getAction } from '../../utils/getAction.js'
import {
  type WithRetryParameters,
  withRetry,
} from '../../utils/promise/withRetry.js'
import { stringify } from '../../utils/stringify.js'
import { getBlock } from './getBlock.js'
import type { GetEpochNumberParameters } from './getEpochNumber.js'
import {
  type GetTransactionErrorType,
  type GetTransactionReturnType,
  getTransaction,
} from './getTransaction.js'
import {
  type GetTransactionReceiptErrorType,
  type GetTransactionReceiptReturnType,
  getTransactionReceipt,
} from './getTransactionReceipt.js'
import {
  type WatchEpochNumberErrorType,
  watchEpochNumber,
} from './watchEpochNumber.js'

export type ReplacementReason = 'cancelled' | 'replaced' | 'repriced'

export type ReplacementReturnType<
  chain extends Chain | undefined = Chain | undefined,
> = {
  reason: ReplacementReason
  replacedTransaction: Transaction
  transaction: Transaction
  transactionReceipt: GetTransactionReceiptReturnType<chain>
}

export type WaitForTransactionReceiptReturnType<
  chain extends Chain | undefined = Chain | undefined,
> = GetTransactionReceiptReturnType<chain>

export type WaitForTransactionReceiptParameters<
  chain extends Chain | undefined = Chain | undefined,
> = {
  /**
   * The number of confirmations (epochs that have passed) to wait before resolving.
   * @default 1
   */
  confirmations?: number | undefined
  /** The hash of the transaction. */
  hash: Hash
  /** Optional callback to emit if the transaction has been replaced. */
  onReplaced?: ((response: ReplacementReturnType<chain>) => void) | undefined
  /**
   * Polling frequency (in ms). Defaults to the client's pollingInterval config.
   * @default client.pollingInterval
   */
  pollingInterval?: number | undefined
  /**
   * Number of times to retry if the transaction or block is not found.
   * @default 6 (exponential backoff)
   */
  retryCount?: WithRetryParameters['retryCount'] | undefined
  /**
   * Time to wait (in ms) between retries.
   * @default `({ count }) => ~~(1 << count) * 200` (exponential backoff)
   */
  retryDelay?: WithRetryParameters['delay'] | undefined
  /** Optional timeout (in milliseconds) to wait before stopping polling. */
  timeout?: number | undefined

  epochTag?: GetEpochNumberParameters['epochTag']
}

export type WaitForTransactionReceiptErrorType =
  | ObserveErrorType
  | GetTransactionErrorType
  | GetTransactionReceiptErrorType
  | WatchEpochNumberErrorType
  | ErrorType

export async function waitForTransactionReceipt<
  chain extends Chain | undefined,
>(
  client: Client<Transport, chain>,
  {
    confirmations = 1,
    hash,
    onReplaced,
    pollingInterval = client.pollingInterval,
    retryCount = 6,
    retryDelay = ({ count }) => ~~(1 << count) * 200, // exponential backoff
    timeout,
    epochTag = 'latest_state',
  }: WaitForTransactionReceiptParameters<chain>,
): Promise<WaitForTransactionReceiptReturnType<chain>> {
  const observerId = stringify(['waitForTransactionReceipt', client.uid, hash])

  let count = 0
  let transaction: GetTransactionReturnType<chain> | undefined
  let replacedTransaction: GetTransactionReturnType<chain> | undefined
  let receipt: GetTransactionReceiptReturnType<chain>
  let retrying = false

  return new Promise((resolve, reject) => {
    if (timeout)
      setTimeout(
        () => reject(new WaitForTransactionReceiptTimeoutError({ hash })),
        timeout,
      )

    const _unobserve = observe(
      observerId,
      { onReplaced, resolve, reject },
      (emit) => {
        const _unwatch = getAction(
          client,
          watchEpochNumber,
          'watchEpochNumber',
        )({
          emitMissed: true,
          emitOnBegin: true,
          poll: true,
          pollingInterval,
          epochTag,
          async onEpochNumber(epochNumber) {
            const done = (fn: () => void) => {
              _unwatch()
              fn()
              _unobserve()
            }

            if (retrying) return
            if (count > retryCount) {
              done(() =>
                emit.reject(
                  new WaitForTransactionReceiptTimeoutError({ hash }),
                ),
              )
            }

            try {
              // If we already have a valid receipt, let's check if we have enough
              // confirmations. If we do, then we can resolve.
              if (receipt) {
                if (
                  confirmations > 1 &&
                  (!receipt.epochNumber ||
                    epochNumber - receipt.epochNumber + 1n < confirmations)
                )
                  return

                done(() => emit.resolve(receipt))
                return
              }
              // Get the transaction to check if it's been replaced.
              // We need to retry as some RPC Providers may be slow to sync
              // up mined transactions.
              if (!transaction) {
                retrying = true
                await withRetry(
                  async () => {
                    transaction = (await getAction(
                      client,
                      getTransaction,
                      'getTransaction',
                    )({ hash })) as GetTransactionReturnType<chain>
                    // if (transaction.epochNumber)
                    //   epochNumber = transaction.epochNumber
                  },
                  {
                    delay: retryDelay,
                    retryCount,
                  },
                )
                retrying = false
              }

              // Get the receipt to check if it's been processed.
              receipt = await getAction(
                client,
                getTransactionReceipt,
                'getTransactionReceipt',
              )({ hash })

              // Check if we have enough confirmations. If not, continue polling.

              if (
                confirmations > 1 &&
                (!receipt.epochNumber ||
                  epochNumber - receipt.epochNumber + 1n < confirmations)
              )
                return

              done(() => emit.resolve(receipt))
            } catch (err) {
              // If the receipt is not found, the transaction will be pending.
              // We need to check if it has potentially been replaced.
              if (
                err instanceof TransactionNotFoundError ||
                err instanceof TransactionReceiptNotFoundError
              ) {
                if (!transaction) {
                  retrying = false
                  return
                }
                try {
                  replacedTransaction = transaction

                  // Let's retrieve the transactions from the current block.
                  // We need to retry as some RPC Providers may be slow to sync
                  // up mined blocks.
                  retrying = true
                  const block = await withRetry(
                    () =>
                      getAction(
                        client,
                        getBlock,
                        'getBlock',
                      )({
                        epochNumber: epochNumber,
                        includeTransactions: true,
                      }),
                    {
                      delay: retryDelay,
                      retryCount,
                      shouldRetry: ({ error }) =>
                        error instanceof BlockNotFoundError,
                    },
                  )
                  retrying = false
                  const replacementTransaction = (
                    block.transactions as {} as Transaction[]
                  ).find(
                    ({ from, nonce }) =>
                      from === replacedTransaction!.from &&
                      nonce === replacedTransaction!.nonce,
                  )
                  // If we couldn't find a replacement transaction, continue polling.
                  if (!replacementTransaction) return

                  // If we found a replacement transaction, return it's receipt.
                  receipt = await getAction(
                    client,
                    getTransactionReceipt,
                    'getTransactionReceipt',
                  )({
                    hash: replacementTransaction.hash,
                  })
                  // Check if we have enough confirmations. If not, continue polling.
                  if (
                    confirmations > 1 &&
                    (!receipt.epochNumber ||
                      epochNumber - receipt.epochNumber + 1n < confirmations)
                  )
                    return

                  let reason: ReplacementReason = 'replaced'
                  if (
                    replacementTransaction.to === replacedTransaction.to &&
                    replacementTransaction.value === replacedTransaction.value
                  ) {
                    reason = 'repriced'
                  } else if (
                    replacementTransaction.from === replacementTransaction.to &&
                    replacementTransaction.value === 0n
                  ) {
                    reason = 'cancelled'
                  }
                  done(() => {
                    emit.onReplaced?.({
                      reason,
                      replacedTransaction: replacedTransaction! as any,
                      transaction: replacementTransaction,
                      transactionReceipt: receipt,
                    })
                    emit.resolve(receipt)
                  })
                } catch (err_) {
                  done(() => emit.reject(err_))
                }
              } else {
                done(() => emit.reject(err))
              }
            } finally {
              count++
            }
          },
        })
      },
    )
  })
}
