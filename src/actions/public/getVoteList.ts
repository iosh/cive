import { type Transport, numberToHex } from 'viem'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { Vote } from '../../types/vote.js'
import { formatVote } from '../../utils/formatters/vote.js'

export type GetVoteListParameters = {
  address: Address
} & (
  | {
      /**
       * @default 'latest_state'
       */
      epochTag?: Exclude<EpochTag, 'latest_finalized' | 'latest_mined'> | undefined
      epochNumber?: never | undefined
    }
  | {
      epochTag?: never | undefined
      epochNumber?: EpochNumber | undefined
    }
)

export type GetVoteListReturnType = Vote[]

export async function getVoteList<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = 'latest_state' }: GetVoteListParameters,
): Promise<GetVoteListReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined
  const result = await client.request({
    method: 'cfx_getVoteList',
    params: [address, _epochNumber || epochTag],
  })
  return result.map(formatVote)
}
