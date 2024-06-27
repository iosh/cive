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

export type GetBytecodeParameters = {
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

export type GetBytecodeReturnType = Hex | undefined

export type GetBytecodeErrorType =
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType

export async function getBytecode<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = 'latest_state' }: GetBytecodeParameters,
): Promise<GetBytecodeReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined

  const hex = await client.request({
    method: 'cfx_getCode',
    params: [address, _epochNumber || epochTag],
  })
  if (hex === '0x') return undefined
  return hex
}
