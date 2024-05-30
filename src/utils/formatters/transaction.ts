import {
  Hex,
  hexToNumber,
  type Chain,
  type ExtractChainFormatterExclude,
  type ExtractChainFormatterReturnType,
} from "viem";
import type { Transaction, TransactionType } from "../../types/transaction.js";
import type { ExactPartial, UnionLooseOmit } from "../../types/utils.js";
import type { EpochTag } from "../../types/block.js";
import type { RpcTransaction } from "../../types/rpc.js";

type TransactionPendingDependencies = "blockHash";

export const transactionType = {
  "0x0": "legacy",
  "0x1": "eip2930",
  "0x2": "eip1559",
} as const satisfies Record<Hex, TransactionType>;

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
  const _transaction = {
    ...transaction,
    blockHash: transaction.blockHash || null,
    chainId: transaction.chainId ? hexToNumber(transaction.chainId) : undefined,
    contractCreated: transaction.contractCreated || null,
    epochHeight: transaction.epochHeight
      ? BigInt(transaction.epochHeight)
      : null,
    gas: BigInt(transaction.gas),
    gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined,
    nonce: transaction.nonce ? Number(transaction.nonce) : undefined,
    status: transaction.status ? BigInt(transaction.status) : null,
    storageLimit: BigInt(transaction.storageLimit),
    to: transaction.to || null,
    transactionIndex: transaction.transactionIndex
      ? Number(transaction.transactionIndex)
      : null,
    v: BigInt(transaction.v),
    value: BigInt(transaction.value),
    maxFeePerGas: transaction.maxFeePerGas
      ? BigInt(transaction.maxFeePerGas)
      : undefined,
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
      ? BigInt(transaction.maxPriorityFeePerGas)
      : undefined,
    type: transaction.type
      ? (transactionType as any)[transaction.type]
      : undefined,
  } as Transaction;

  if (_transaction.type === "legacy") {
    delete _transaction.accessList;
    delete _transaction.maxFeePerGas;
    delete _transaction.maxPriorityFeePerGas;
    delete _transaction.yParity;
  }
  if (_transaction.type === "eip2930") {
    delete _transaction.maxFeePerGas;
    delete _transaction.maxPriorityFeePerGas;
  }

  return _transaction;
}
