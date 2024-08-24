import type { ChecksumAddressErrorType, RequestErrorType } from 'viem/utils'
import type { Account, Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'

export type GetAddressesReturnType = Address[]

export type GetAddressesErrorType =
  | RequestErrorType
  | ChecksumAddressErrorType
  | ErrorType

export async function getAddresses<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
): Promise<GetAddressesReturnType> {
  if (client.account?.type === 'local') return [client.account.address]
  const addresses = await client.request(
    { method: 'cfx_accounts' },
    { dedupe: true },
  )
  return addresses
}
