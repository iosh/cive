import { type Transport, numberToHex } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Chain } from '../../types/chain.js'
import type { PoSRewards } from '../../types/pos.js'
import { formatPosRewards } from '../../utils/formatters/pos.js'

export type GetPoSRewardsParameters = {
  epochNumber: bigint
}

export type GetPoSRewardsReturnType = PoSRewards | null

export async function getPoSRewards<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber }: GetPoSRewardsParameters,
): Promise<GetPoSRewardsReturnType> {
  const result = await client.request({
    method: 'pos_getRewardsByEpoch',
    params: [numberToHex(epochNumber)],
  })

  if (!result) return null
  return formatPosRewards(result)
}
