import type {} from 'viem'
import type {
  Chain,
  ExtractChainFormatterReturnType,
} from '../../types/chain.js'
import type { RpcTransactionReceipt } from '../../types/rpc.js'
import type { TransactionReceipt } from '../../types/transaction.js'
import type { ExactPartial } from '../../types/utils.js'
import { formatLog } from './log.js'
import { transactionType } from './transaction.js'

export type FormattedTransactionReceipt<
  TChain extends Chain | undefined = undefined,
> = ExtractChainFormatterReturnType<
  TChain,
  'transactionReceipt',
  TransactionReceipt
>

export const receiptOutcomeStatuses = {
  '0x0': 'success',
  '0x1': 'failed',
  '0x2': 'skipped',
} as const

export function formatTransactionReceipt(
  transactionReceipt: ExactPartial<RpcTransactionReceipt>,
) {
  const receipt = {
    ...transactionReceipt,
    index: transactionReceipt.index ? BigInt(transactionReceipt.index) : null,
    epochNumber: transactionReceipt.epochNumber
      ? BigInt(transactionReceipt.epochNumber)
      : null,
    gasUsed: transactionReceipt.gasUsed
      ? BigInt(transactionReceipt.gasUsed)
      : null,
    gasFee: transactionReceipt.gasFee
      ? BigInt(transactionReceipt.gasFee)
      : null,
    storageCollateralized: transactionReceipt.storageCollateralized
      ? BigInt(transactionReceipt.storageCollateralized)
      : null,
    storageReleased: transactionReceipt.storageCollateralized
      ? transactionReceipt.storageReleased?.map((item) => ({
          ...item,
          collaterals: item.collaterals ? BigInt(item.collaterals) : null,
        }))
      : null,
    outcomeStatus: transactionReceipt.outcomeStatus
      ? receiptOutcomeStatuses[transactionReceipt.outcomeStatus]
      : null,
    log: transactionReceipt.log
      ? transactionReceipt.log.map((log) => formatLog(log))
      : null,
    burntGasFee: transactionReceipt.burntGasFee
      ? BigInt(transactionReceipt.burntGasFee)
      : null,
    effectiveGasPrice: transactionReceipt.effectiveGasPrice
      ? BigInt(transactionReceipt.effectiveGasPrice)
      : null,
    type: transactionReceipt.type
      ? transactionType[
          transactionReceipt.type as keyof typeof transactionType
        ] || transactionReceipt.type
      : null,
  } as TransactionReceipt

  return receipt
}

export function formatTransactionReceipts(
  transactionReceipts: ExactPartial<RpcTransactionReceipt>[][],
) {
  return transactionReceipts.map((item) => item.map(formatTransactionReceipt))
}
