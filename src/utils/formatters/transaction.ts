import type {
  Chain,
  ExtractChainFormatterExclude,
  ExtractChainFormatterReturnType,
} from "viem";
import type { Transaction } from "../../types/transaction";
import type { UnionLooseOmit } from "../../types/utils";
import type { EpochNumberParameters } from "../../types/epoch";

type TransactionPendingDependencies = "blockHash";

export type FormattedTransaction<
  TChain extends Chain | undefined = undefined,
  TBlockTag extends EpochNumberParameters = EpochNumberParameters,
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
    Transaction<bigint, number>,
    TransactionPendingDependencies
  >;
