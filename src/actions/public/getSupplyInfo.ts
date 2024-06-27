import type { Transport } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Chain } from '../../types/chain.js'
import type { Supply } from '../../types/supply.js'
import { formatSupply } from '../../utils/formatters/supply.js'

export type GetSupplyInfoReturnType = Supply

export async function getSupplyInfo<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
): Promise<GetSupplyInfoReturnType> {
  const result = await client.request({
    method: 'cfx_getSupplyInfo',
  })
  return formatSupply(result)
}
