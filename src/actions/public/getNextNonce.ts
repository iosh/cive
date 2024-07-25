import { type Transport, numberToHex } from 'viem'
import type { NumberToHexErrorType, RequestErrorType } from 'viem/utils'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetNextNonceParameters = {
  address: Address
  /**
   * @default true
   */
  tryTxPool?: boolean
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

export type GetNextNonceReturnType = number

export type GetNextNonceErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType

export async function getNextNonce<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    address,
    epochNumber,
    tryTxPool = true,
    epochTag = 'latest_state',
  }: GetNextNonceParameters,
): Promise<GetNextNonceReturnType> {
  const defaultFn = async () => {
    const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined
    const nonce = await client.request({
      method: 'cfx_getNextNonce',
      params: [address, _epochNumber || epochTag],
    })
    return Number(nonce)
  }

  try {
    if (tryTxPool) {
      const nonce = await client.request({
        method: 'txpool_nextNonce',
        params: [address],
      })
      return Number(nonce)
    }
    return defaultFn()
  } catch {
    return defaultFn()
  }
}
