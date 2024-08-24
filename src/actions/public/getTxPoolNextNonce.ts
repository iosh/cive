import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'

export type GetTxPoolNextNonceParameters = {
  address: Address
}

export type GetTxPoolNextNonceReturnType = number

export async function getTxPoolNextNonce<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address }: GetTxPoolNextNonceParameters,
): Promise<GetTxPoolNextNonceReturnType> {
  const nonce = await client.request({
    method: 'txpool_nextNonce',
    params: [address],
  })
  return Number(nonce)
}
