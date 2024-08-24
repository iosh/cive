import { numberToHex } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { FeeHistory } from '../../types/fee.js'
import { formatFeeHistory } from '../../utils/formatters/feeHistory.js'

export type GetFeeHistoryParameters = {
  epochCount: number

  rewardPercentiles: number[]
} & (
  | {
      epochNumber?: undefined
      /**
       * @default latest_state
       */
      epochTag?:
        | Exclude<EpochTag, 'latest_finalized' | 'latest_mined'>
        | undefined
    }
  | {
      epochNumber?: bigint | undefined
      epochTag?: undefined
    }
)
export type GetFeeHistoryReturnType = FeeHistory
export async function getFeeHistory<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  {
    epochCount: blockCount,
    epochNumber,
    epochTag = 'latest_state',
    rewardPercentiles,
  }: GetFeeHistoryParameters,
): Promise<GetFeeHistoryReturnType> {
  const epochNumberHex = epochNumber ? numberToHex(epochNumber) : undefined
  const feeHistory = await client.request(
    {
      method: 'cfx_feeHistory',
      params: [
        numberToHex(blockCount),
        epochNumberHex || epochTag,
        rewardPercentiles,
      ],
    },
    { dedupe: Boolean(epochNumberHex) },
  )
  return formatFeeHistory(feeHistory)
}
