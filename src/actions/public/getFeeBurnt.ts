import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'

export type GetFeeBurntReturnType = bigint

export async function getFeeBurnt<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
): Promise<bigint> {
  const result = await client.request({
    method: 'cfx_getFeeBurnt',
  })
  return BigInt(result)
}
