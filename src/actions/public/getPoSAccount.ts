import type { Address as HexAddress, Transport } from 'viem'

import type { Client } from '../../clients/createClient.js'
import type { Chain } from '../../types/chain.js'
import type { PoSAccount } from '../../types/pos.js'
import { formatPoSAccount } from '../../utils/formatters/pos.js'

export type GetPoSAccountParameters = {
  address: HexAddress
}

export type GetPoSAccountReturnType = PoSAccount

export async function getPoSAccount<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address }: GetPoSAccountParameters,
): Promise<GetPoSAccountReturnType> {
  const result = await client.request({
    method: 'pos_getAccount',
    params: [address],
  })
  return formatPoSAccount(result)
}
