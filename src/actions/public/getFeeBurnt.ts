import type { Transport } from 'viem'
import type { Client } from '../../clients/createClient.js'
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
