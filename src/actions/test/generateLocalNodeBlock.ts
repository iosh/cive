import type { Account } from '../../accounts/types.js'
import type { TestClient } from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type { Hash } from '../../types/misc.js'

export type GenerateLocalNodeBlockParameters = {
  numTxs: number
  blockSizeLimit: number
}

export type GenerateLocalNodeBlockReturnTYpe = Hash

export async function generateLocalNodeBlock<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: TestClient<Transport, TChain, TAccount, false>,
  { numTxs, blockSizeLimit }: GenerateLocalNodeBlockParameters,
): Promise<GenerateLocalNodeBlockReturnTYpe> {
  const result = await client.request({
    method: 'test_generateOneBlock',
    params: [numTxs, blockSizeLimit],
  })
  return result
}
