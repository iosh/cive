import { type Hash, type Transport, numberToHex } from 'viem'
import type { Account } from '../../accounts/types.js'
import type { LocalNodeClient } from '../../clients/createLocalClient.js'
import type { Chain } from '../../types/chain.js'

export type GenerateEmptyLocalNodeBlocksParameters = {
  numBlocks: number
}
export type GenerateEmptyLocalNodeBlocksReturnType = Hash

export async function generateEmptyLocalNodeBlocks<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: LocalNodeClient<Transport, TChain, TAccount, false>,
  { numBlocks }: GenerateEmptyLocalNodeBlocksParameters,
): Promise<GenerateEmptyLocalNodeBlocksReturnType> {
  const result = await client.request({
    method: 'generate_empty_blocks',
    params: [numBlocks],
  })
  return result
}
