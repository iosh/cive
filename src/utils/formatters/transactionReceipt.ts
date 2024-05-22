import type { Chain, ExtractChainFormatterReturnType } from "viem";
import type { RpcTransactionReceipt } from "../../types/rpc";
import type { TransactionReceipt } from "../../types/transaction";
import type { ExactPartial } from "../../types/utils";
import { formatLog } from "./log";

export type FormattedTransactionReceipt<
  TChain extends Chain | undefined = undefined
> = ExtractChainFormatterReturnType<
  TChain,
  "transactionReceipt",
  RpcTransactionReceipt
>;

export const receiptOutcomeStatuses = {
  "0x0": "success",
  "0x1": "failed",
  "0x2": "skipped",
} as const;

export function formatTransactionReceipt(
  transactionReceipt: ExactPartial<RpcTransactionReceipt>
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
    log: transactionReceipt.log ? transactionReceipt.log.map(formatLog) : null,
  } as TransactionReceipt;

  return receipt;
}