import type { Hash } from 'viem'
import { numberToHex } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { BlockNotFoundError } from '../../errors/block.js'
import type { Chain } from '../../types/chain.js'
import type { PoSBlock } from '../../types/pos.js'
import type { RpcPoSBlock } from '../../types/rpc.js'
import { formatPoSBlock } from '../../utils/formatters/pos.js'

export type GetPoSBlockParameters =
  | {
      blockHash?: Hash
      blockTag?: never | undefined
      blockNumber?: never | undefined
    }
  | {
      blockHash?: never | undefined
      blockTag?: 'latest_committed' | 'latest_voted'
      blockNumber?: never | undefined
    }
  | {
      blockHash?: never | undefined
      blockTag?: never | undefined
      blockNumber?: bigint
    }

export type GetPosBlockReturnType = PoSBlock

export async function getPoSBlock<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    blockHash,
    blockNumber,
    blockTag = 'latest_voted',
  }: GetPoSBlockParameters = {},
): Promise<GetPosBlockReturnType> {
  let block: RpcPoSBlock | undefined

  if (blockHash) {
    block = await client.request({
      method: 'pos_getBlockByHash',
      params: [blockHash],
    })
  } else {
    const _blockNumber = blockNumber ? numberToHex(blockNumber) : undefined
    block = await client.request({
      method: 'pos_getBlockByNumber',
      params: [_blockNumber ? _blockNumber : blockTag],
    })
  }
  if (!block) {
    throw new BlockNotFoundError({ blockHash, blockNumber })
  }

  return formatPoSBlock(block)
}
