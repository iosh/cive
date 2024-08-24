import type { Account } from '../../accounts/types.js'
import type { LocalNodeClient } from '../../clients/createLocalClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type { Hash } from '../../types/misc.js'

export type GenerateEmptyLocalNodeBlocksParameters = {
  numBlocks: number
}
export type GenerateEmptyLocalNodeBlocksReturnType = Hash[]

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
