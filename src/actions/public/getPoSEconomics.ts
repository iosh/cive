import { type Transport, numberToHex } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetPoSEconomicsParameters =
  | {
      /**
       * @default 'latest_state'
       */
      epochTag?: EpochTag | undefined
      epochNumber?: never | undefined
    }
  | {
      epochTag?: never | undefined
      epochNumber?: EpochNumber | undefined
    }

export type GetPoSEconomicsReturnType = {
  distributablePosInterest: bigint
  lastDistributeBlock: bigint
  totalPosStakingTokens: bigint
}

export async function getPoSEconomics<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber, epochTag = 'latest_state' }: GetPoSEconomicsParameters = {},
): Promise<GetPoSEconomicsReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined
  const result = await client.request({
    method: 'cfx_getPoSEconomics',
    params: [_epochNumber || epochTag],
  })

  return {
    ...result,
    distributablePosInterest: BigInt(result.distributablePosInterest),
    lastDistributeBlock: BigInt(result.lastDistributeBlock),
    totalPosStakingTokens: BigInt(result.totalPosStakingTokens),
  }
}
