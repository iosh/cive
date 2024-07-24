import { type Hash, type Transport, numberToHex } from 'viem'
import type { NumberToHexErrorType, RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetBlocksByEpochParameters = {} & (
  | {
      epochNumber?: EpochNumber
      epochTag?: never | undefined
    }
  | {
      epochNumber?: never | undefined
      epochTag?: Exclude<EpochTag, 'latest_finalized'>
    }
)

export type GetBlocksByEpochReturnType = Hash[]

export type GetBlocksByEpochErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType

export async function getBlocksByEpoch<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber, epochTag = 'latest_state' }: GetBlocksByEpochParameters = {},
): Promise<GetBlocksByEpochReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined

  const blockHashes = await client.request({
    method: 'cfx_getBlocksByEpoch',
    params: [_epochNumber || epochTag],
  })

  return blockHashes
}
