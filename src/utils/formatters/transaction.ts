import {
  hexToNumber,
  type Chain,
  type ExtractChainFormatterExclude,
  type ExtractChainFormatterReturnType,
} from "viem";
import type { Transaction } from "../../types/transaction";
import type { ExactPartial, UnionLooseOmit } from "../../types/utils";
import type { EpochTag } from "../../types/block";
import type { RpcTransaction } from "../../types/rpc";

type TransactionPendingDependencies = "blockHash";

export type FormattedTransaction<
  TChain extends Chain | undefined = undefined,
  TEpochNumber extends EpochTag = EpochTag,
  _FormatterReturnType = ExtractChainFormatterReturnType<
    TChain,
    "transaction",
    Transaction
  >,
  _ExcludedPendingDependencies extends string = TransactionPendingDependencies &
    ExtractChainFormatterExclude<TChain, "transaction">
> = UnionLooseOmit<_FormatterReturnType, TransactionPendingDependencies> & {
  [_K in _ExcludedPendingDependencies]: never;
} & Pick<
    Transaction<
      bigint,
      number,
      TEpochNumber extends "latest_state" ? false : true
    >,
    TransactionPendingDependencies
  >;

export function formatTransaction(transaction: RpcTransaction) {
  const _transaction: Transaction = {
    ...transaction,
    blockHash: transaction.blockHash || null,
    chainId: transaction.chainId ? hexToNumber(transaction.chainId) : undefined,
    contractCreated: transaction.contractCreated || null,
    epochHeight: transaction.epochHeight
      ? BigInt(transaction.epochHeight)
      : null,
    gas: BigInt(transaction.gas),
    gasPrice: BigInt(transaction.gasPrice),
    nonce: Number(transaction.nonce),
    status: transaction.status ? BigInt(transaction.status) : null,
    storageLimit: BigInt(transaction.storageLimit),
    to: transaction.to || null,
    transactionIndex: transaction.transactionIndex
      ? Number(transaction.transactionIndex)
      : null,
    v: BigInt(transaction.v),
    value: BigInt(transaction.value),
  };

  return _transaction;
}
