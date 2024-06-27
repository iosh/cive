import { type Transport, numberToHex } from 'viem'
import type { NumberToHexErrorType, RequestErrorType } from 'viem/utils'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetStakingBalanceParameters = {
  address: Address
} & (
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
)

export type GetStakingBalanceReturnType = bigint

export type GetStakingBalanceErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType

export async function getStakingBalance<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    address,
    epochNumber,
    epochTag = 'latest_state',
  }: GetStakingBalanceParameters,
): Promise<GetStakingBalanceReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined

  const balance = await client.request({
    method: 'cfx_getStakingBalance',
    params: [address, _epochNumber || epochTag],
  })

  return BigInt(balance)
}
