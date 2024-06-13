import type { Hash } from "viem";
import type { Block, EpochTag } from "../../types/block.js";
import type { ExactPartial, Prettify } from "../../types/utils.js";
import { formatTransaction, type FormattedTransaction } from "./transaction.js";
import type { ErrorType } from "../../errors/utils.js";
import type { RpcBlock } from "../../types/rpc.js";
import {
  Chain,
  ExtractChainFormatterExclude,
  ExtractChainFormatterReturnType,
} from "../../types/chain.js";

type BlockPendingDependencies = "gasUsed" | "hash" | "nonce" | "powQuality";
export type FormattedBlock<
  TChain extends Chain | undefined = undefined,
  TIncludeTransactions extends boolean = boolean,
  TEpochTag extends EpochTag = EpochTag,
  _FormatterReturnType = ExtractChainFormatterReturnType<
    TChain,
    "block",
    Block<bigint, TIncludeTransactions>
  >,
  _ExcludedPendingDependencies extends string = BlockPendingDependencies &
    ExtractChainFormatterExclude<TChain, "block">,
  _Formatted = Omit<_FormatterReturnType, BlockPendingDependencies> & {
    [_key in _ExcludedPendingDependencies]: never;
  } & Pick<
      Block<bigint, TIncludeTransactions, TEpochTag>,
      BlockPendingDependencies
    >,
  _Transactions = TIncludeTransactions extends true
    ? Prettify<FormattedTransaction<TChain, TEpochTag>>[]
    : Hash[]
> = Omit<_Formatted, "transactions"> & {
  transactions: _Transactions;
};

export type FormatBlockErrorType = ErrorType;

export function formatBlock(block: ExactPartial<RpcBlock>) {
  const transactions = block.transactions?.map((transaction) => {
    if (typeof transaction === "string") return transaction;
    return formatTransaction(transaction);
  });

  const _block = {
    ...block,
    blame: block.blame ? BigInt(block.blame) : undefined,
    difficulty: block.difficulty ? BigInt(block.difficulty) : undefined,
    epochNumber: block.epochNumber ? BigInt(block.epochNumber) : undefined,
    gasLimit: block.gasLimit ? BigInt(block.gasLimit) : undefined,
    gasUsed: block.gasUsed ? BigInt(block.gasUsed) : null,
    height: block.height ? BigInt(block.height) : undefined,
    size: block.size ? BigInt(block.size) : undefined,
    timestamp: block.timestamp ? BigInt(block.timestamp) : undefined,
    blockNumber: block.blockNumber ? BigInt(block.blockNumber) : null,
    transactions,
  } as Block;

  return _block;
}
