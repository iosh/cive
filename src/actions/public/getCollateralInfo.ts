import { type Transport, numberToHex } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetCollateralInfoParameters =
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

export type GetCollateralInfoReturnType = {
  totalStorageTokens: bigint
  convertedStoragePoints: bigint
  usedStoragePoints: bigint
}

export async function getCollateralInfo<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber, epochTag = 'latest_state' }: GetCollateralInfoParameters = {},
): Promise<GetCollateralInfoReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined
  const epoch = _epochNumber || epochTag
  const result = await client.request({
    method: 'cfx_getCollateralInfo',
    params: [epoch],
  })
  return {
    ...result,
    totalStorageTokens: BigInt(result.totalStorageTokens),
    convertedStoragePoints: BigInt(result.convertedStoragePoints),
    usedStoragePoints: BigInt(result.usedStoragePoints),
  }
}
