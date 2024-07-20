import type { Hash } from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import type { Block, EpochTag } from '../../types/block.js'
import type {
  Chain,
  ExtractChainFormatterExclude,
  ExtractChainFormatterReturnType,
} from '../../types/chain.js'
import type { RpcBlock } from '../../types/rpc.js'
import type { ExactPartial, Prettify } from '../../types/utils.js'
import { type FormattedTransaction, formatTransaction } from './transaction.js'

type BlockPendingDependencies = 'gasUsed' | 'posReference' | 'baseFeePerGas'
export type FormattedBlock<
  TChain extends Chain | undefined = undefined,
  TIncludeTransactions extends boolean = boolean,
  TEpochTag extends EpochTag = EpochTag,
  _FormatterReturnType = ExtractChainFormatterReturnType<
    TChain,
    'block',
    Block<bigint, TIncludeTransactions, TEpochTag>
  >,
  _ExcludedPendingDependencies extends string = BlockPendingDependencies &
    ExtractChainFormatterExclude<TChain, 'block'>,
  _Formatted = Omit<_FormatterReturnType, BlockPendingDependencies> & {
    [_key in _ExcludedPendingDependencies]: never
  } & Pick<
      Block<bigint, TIncludeTransactions, TEpochTag>,
      BlockPendingDependencies
    >,
  _Transactions = TIncludeTransactions extends true
    ? Prettify<FormattedTransaction<TChain, TEpochTag>>[]
    : Hash[],
> = Omit<_Formatted, 'transactions'> & {
  transactions: _Transactions
}

export type FormatBlockErrorType = ErrorType

export function formatBlock(block: ExactPartial<RpcBlock>) {
  const transactions = block.transactions?.map((transaction) => {
    if (typeof transaction === 'string') return transaction
    return formatTransaction(transaction)
  })

  const _block = {
    ...block,
    baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
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
  } as Block

  return _block
}
