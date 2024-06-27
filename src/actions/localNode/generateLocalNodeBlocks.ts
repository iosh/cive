import { numberToHex, type Hash, type Transport } from 'viem'
import type { Chain } from '../../types/chain.js'
import type { Account } from '../../accounts/types.js'
import type { LocalNodeClient } from '../../clients/createLocalClient.js'

export type GenerateLocalNodeBlocksParameters = {
  numTxs: number
  blockSizeLimit: number
}
export type GenerateLocalNodeBlocksReturnType = Hash

export async function generateLocalNodeBlocks<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: LocalNodeClient<Transport, TChain, TAccount, false>,
  { numTxs, blockSizeLimit }: GenerateLocalNodeBlocksParameters,
): Promise<GenerateLocalNodeBlocksReturnType> {
  const _numTxs = numberToHex(numTxs)
  const _blockSizeLimit = numberToHex(blockSizeLimit)
  const result = await client.request({
    method: 'generateoneblock',
    params: [_numTxs, _blockSizeLimit],
  })
  return result
}
