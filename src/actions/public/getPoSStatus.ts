import type { Transport } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Chain } from '../../types/chain.js'
import type { PoSStatus } from '../../types/pos.js'
import { formatPoSStatus } from '../../utils/formatters/pos.js'

export type GetPoSStatusReturnType = PoSStatus

export async function getPoSStatus<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
): Promise<GetPoSStatusReturnType> {
  const result = await client.request({
    method: 'pos_getStatus',
  })
  return formatPoSStatus(result)
}
