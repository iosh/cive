import { type Hash, type Transport, numberToHex } from 'viem'
import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import { BlockNotFoundError } from '../../errors/block.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { RpcBlock } from '../../types/rpc.js'
import type { Prettify } from '../../types/utils.js'
import {
  type FormattedBlock,
  formatBlock,
} from '../../utils/formatters/block.js'

export type GetBlockParameters<
  TIncludeTransactions extends boolean = false,
  TEpochTag extends
    | Exclude<EpochTag, 'latest_finalized'>
    | undefined = undefined,
> = {
  includeTransactions?: TIncludeTransactions | undefined
} & (
  | {
      blockHash?: Hash | undefined
      blockNumber?: never | undefined
      epochNumber?: never | undefined
      epochTag?: never | undefined
    }
  | {
      blockHash?: never | undefined
      blockNumber?: bigint
      epochNumber?: never | undefined
      epochTag?: never | undefined
    }
  | {
      blockHash?: never | undefined
      blockNumber?: never | undefined
      epochNumber?: EpochNumber | undefined
      epochTag?: never | undefined
    }
  | {
      blockHash?: never | undefined
      blockNumber?: never | undefined
      epochNumber?: never | undefined
      /**
       * the epoch tag string
       * @default "latest_state"
       */
      epochTag?: TEpochTag | Exclude<EpochTag, 'latest_finalized'> | undefined
    }
)
export type GetBlockReturnType<
  TChain extends Chain | undefined = undefined,
  TIncludeTransactions extends boolean = false,
  TEpochTag extends EpochTag | undefined = undefined,
> = Prettify<FormattedBlock<TChain, TIncludeTransactions, TEpochTag>>

export async function getBlock<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TIncludeTransactions extends boolean = false,
  TEpochTag extends
    | Exclude<EpochTag, 'latest_finalized'>
    | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  {
    blockHash,
    blockNumber,
    epochNumber,
    epochTag,
    includeTransactions,
  }: GetBlockParameters<TIncludeTransactions, TEpochTag> = {},
): Promise<GetBlockReturnType<TChain, TIncludeTransactions, TEpochTag>> {
  const _blockNumber = blockNumber ? numberToHex(blockNumber) : undefined
  const _epochTag = epochTag ?? 'latest_state'
  const _includeTransactions = includeTransactions ?? false

  const epochNumberHex =
    typeof epochNumber !== 'undefined' ? numberToHex(epochNumber) : undefined

  let block: RpcBlock | null = null

  if (blockHash) {
    block = await client.request({
      method: 'cfx_getBlockByHash',
      params: [blockHash, _includeTransactions],
    })
  } else if (_blockNumber) {
    block = await client.request({
      method: 'cfx_getBlockByBlockNumber',
      params: [_blockNumber, _includeTransactions],
    })
  } else {
    block = await client.request({
      method: 'cfx_getBlockByEpochNumber',
      params: [epochNumberHex || _epochTag, _includeTransactions],
    })
  }
  if (!block) throw new BlockNotFoundError({ blockHash, epochNumber })

  const format = client.chain?.formatters?.block?.format || formatBlock
  return format(block)
}
