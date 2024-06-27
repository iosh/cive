import { numberToHex, type Hash, type Transport } from 'viem'
import type { Account } from '../../accounts/types.js'
import type { LocalNodeClient } from '../../clients/createLocalClient.js'
import type { Chain } from '../../types/chain.js'

export type CreateEmptyBlocksParameters = {
  numBlocks: number
}
export type CreateEmptyBlocksReturnType = Hash

export async function createEmptyBlocks<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: LocalNodeClient<Transport, TChain, TAccount, false>,
  { numBlocks }: CreateEmptyBlocksParameters,
): Promise<CreateEmptyBlocksReturnType> {
  const _numBlocks = numberToHex(numBlocks)
  const result = await client.request({
    method: 'generate_empty_blocks',
    params: [_numBlocks],
  })
  return result
}
