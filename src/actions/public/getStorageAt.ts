import type { Hex } from 'viem'
import { numberToHex } from 'viem/utils'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetStorageAtParameters = {
  address: Address
  slot: Hex
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

export type GetStorageAtReturnType = Hex | null

export async function GetStorageAt<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    address,
    slot,
    epochNumber,
    epochTag = 'latest_state',
  }: GetStorageAtParameters,
): Promise<GetStorageAtReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined

  const data = await client.request({
    method: 'cfx_getStorageAt',
    params: [address, slot, _epochNumber || epochTag],
  })

  if (data === '0x') return null

  return data
}
