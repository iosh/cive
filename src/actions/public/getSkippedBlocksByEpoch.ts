import type { NumberToHexErrorType } from 'viem'
import { numberToHex } from 'viem/utils'
import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Block, EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import { formatBlock } from '../../utils/formatters/block.js'

export type GetSkippedBlocksByEpochParameters =
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

export type GetSkippedBlocksByEpochReturnType = Block[]
export type GetSkippedBlocksByEpochErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType

export async function getSkippedBlocksByEpoch<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    epochNumber,
    epochTag = 'latest_state',
  }: GetSkippedBlocksByEpochParameters = {},
): Promise<GetSkippedBlocksByEpochReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined
  const blocks = await client.request({
    method: 'cfx_getSkippedBlocksByEpoch',
    params: [_epochNumber || epochTag],
  })

  const format = client.chain?.formatters?.block?.format || formatBlock

  return blocks.map((block) => format(block))
}
