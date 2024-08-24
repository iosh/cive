import { numberToHex } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetInterestRateParameters =
  | {
      /**
       * @default 'latest_state'
       */
      epochTag?:
        | Exclude<EpochTag, 'latest_finalized' | 'latest_mined'>
        | undefined
      epochNumber?: never | undefined
    }
  | {
      epochTag?: never | undefined
      epochNumber?: EpochNumber | undefined
    }

export type GetInterestRateReturnType = bigint

export async function getInterestRate<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber, epochTag = 'latest_state' }: GetInterestRateParameters = {},
): Promise<GetInterestRateReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined

  const result = await client.request({
    method: 'cfx_getInterestRate',
    params: [_epochNumber || epochTag],
  })

  return BigInt(result)
}
