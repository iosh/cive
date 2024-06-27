import type { Transport } from 'viem'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { AccountPending } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import { formatAccountPending } from '../../utils/formatters/account.js'

export type GetAccountPendingInfoParameters = {
  address: Address
}

export type GetAccountPendingInfoReturnType = AccountPending

export async function getAccountPendingInfo<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address }: GetAccountPendingInfoParameters,
): Promise<GetAccountPendingInfoReturnType> {
  const result = await client.request({
    method: 'cfx_getAccountPendingInfo',
    params: [address],
  })
  return formatAccountPending(result)
}
