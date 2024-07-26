import { type Transport, numberToHex } from 'viem'
import type { NumberToHexErrorType, RequestErrorType } from 'viem/utils'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { ChainAccount } from '../../types/chainAccount.js'
import { formatChainAccount } from '../../utils/formatters/chainAccount.js'

export type GetChainAccountParameters = {
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

export type GetChainAccountReturnType = ChainAccount

export type GetChainAccountErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType

export async function getAccount<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    address,
    epochNumber,
    epochTag = 'latest_state',
  }: GetChainAccountParameters,
) {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined

  const result = await client.request({
    method: 'cfx_getAccount',
    params: [address, _epochNumber || epochTag],
  })

  return formatChainAccount(result)
}
