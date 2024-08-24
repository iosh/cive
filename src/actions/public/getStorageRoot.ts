import type { Hex } from 'viem'
import { numberToHex } from 'viem/utils'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetStorageRootParameters = {
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

export type GetStorageRootReturnType = {
  data: Hex | null | 'TOMBSTONE'
  intermediate: Hex | null | 'TOMBSTONE'
  snapshot: Hex | null | 'TOMBSTONE'
}

export async function GetStorageRoot<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = 'latest_state' }: GetStorageRootParameters,
): Promise<GetStorageRootReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined

  const data = await client.request({
    method: 'cfx_getStorageRoot',
    params: [address, _epochNumber || epochTag],
  })

  return data
}
