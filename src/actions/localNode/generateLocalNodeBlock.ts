import { type Transport } from 'viem'
import type { Account } from '../../accounts/types.js'
import type { LocalNodeClient } from '../../clients/createLocalClient.js'
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
  client: LocalNodeClient<Transport, TChain, TAccount, false>,
  { numTxs, blockSizeLimit }: GenerateLocalNodeBlockParameters,
): Promise<GenerateLocalNodeBlockReturnTYpe> {
  const result = await client.request({
    method: 'generateoneblock',
    params: [numTxs, blockSizeLimit],
  })
  return result
}
