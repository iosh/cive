import type { Account } from '../../accounts/types.js'
import type { TestClient } from '../../clients/createTestClient.js'
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
  client: TestClient<Transport, TChain, TAccount, false>,
  { numBlocks }: GenerateEmptyLocalNodeBlocksParameters,
): Promise<GenerateEmptyLocalNodeBlocksReturnType> {
  const result = await client.request({
    method: 'test_generateEmptyBlocks',
    params: [numBlocks],
  })
  return result
}
