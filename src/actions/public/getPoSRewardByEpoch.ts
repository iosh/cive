import { type Hash, type Transport, numberToHex } from 'viem'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { EpochNumber } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetPoSRewardByEpochParameters = {
  epochNumber: EpochNumber
}

export type GetPoSRewardByEpochReturnType = {
  accountRewards: {
    posAddress: Address
    powAddress: Address
    reward: BigInt
  }[]
  powEpochHash: Hash
} | null

export async function getPoSRewardByEpoch<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber }: GetPoSRewardByEpochParameters,
): Promise<GetPoSRewardByEpochReturnType> {
  const result = await client.request({
    method: 'cfx_getPoSRewardByEpoch',
    params: [numberToHex(epochNumber)],
  })

  if (result === null) return null

  return {
    ...result,
    accountRewards: result.accountRewards.map((item) => ({
      ...item,
      reward: BigInt(item.reward),
    })),
  }
}
