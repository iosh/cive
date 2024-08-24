import type { Hash } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import {
  TransactionReceiptNotFoundError,
  type TransactionReceiptNotFoundErrorType,
} from '../../errors/transaction.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import {
  type FormattedTransactionReceipt,
  formatTransactionReceipt,
} from '../../utils/formatters/transactionReceipt.js'

export type GetTransactionReceiptParameters = {
  hash: Hash
}

export type GetTransactionReceiptReturnType<
  TChain extends Chain | undefined = undefined,
> = FormattedTransactionReceipt<TChain>

export type GetTransactionReceiptErrorType =
  | RequestErrorType
  | TransactionReceiptNotFoundErrorType
  | ErrorType

export async function getTransactionReceipt<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { hash }: GetTransactionReceiptParameters,
) {
  const receipt = await client.request({
    method: 'cfx_getTransactionReceipt',
    params: [hash],
  })

  if (!receipt) throw new TransactionReceiptNotFoundError({ hash })

  const format =
    client.chain?.formatters?.transactionReceipt?.format ||
    formatTransactionReceipt
  return format(receipt) as GetTransactionReceiptReturnType<TChain>
}
