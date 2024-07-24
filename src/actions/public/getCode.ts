import {
  type Hex,
  type NumberToHexErrorType,
  type Transport,
  numberToHex,
} from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetCodeParameters = {
  address: Address
} & (
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
)

export type GetCodeReturnType = Hex | undefined

export type GetBytecodeErrorType =
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType

export async function getCode<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = 'latest_state' }: GetCodeParameters,
): Promise<GetCodeReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined

  const hex = await client.request({
    method: 'cfx_getCode',
    params: [address, _epochNumber || epochTag],
  })
  if (hex === '0x') return undefined
  return hex
}
