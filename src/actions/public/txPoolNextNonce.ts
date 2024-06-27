import type { Transport } from 'viem'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Chain } from '../../types/chain.js'

export type TxPoolNextNonceParameters = {
  address: Address
}

export type TxPoolNextNonceReturnType = number

export async function txPoolNextNonce<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address }: TxPoolNextNonceParameters,
): Promise<TxPoolNextNonceReturnType> {
  const nonce = await client.request({
    method: 'txpool_nextNonce',
    params: [address],
  })
  return Number(nonce)
}
