import type { Hash } from 'viem'
import { numberToHex } from 'viem/utils'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { EpochNumber } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetPoSRewardByEpochParameters = {
  epochNumber: EpochNumber
}

export type GetPoSRewardByEpochReturnType =
  | {
      accountRewards: {
        posAddress: Address
        powAddress: Address
        reward: BigInt
      }[]
      powEpochHash: Hash
    }
  | undefined

export async function getPoSRewardByEpoch<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber }: GetPoSRewardByEpochParameters,
): Promise<GetPoSRewardByEpochReturnType> {
  const result = await client.request({
    method: 'cfx_getPoSRewardByEpoch',
    params: [numberToHex(epochNumber)],
  })

  if (result === null) return undefined

  return {
    ...result,
    accountRewards: result.accountRewards.map((item) => ({
      ...item,
      reward: BigInt(item.reward),
    })),
  }
}
