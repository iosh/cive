import type { Account, Address } from '../../accounts/types.js'
import type { TestClient } from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'

export type GetLocalNodeAddressesReturnType = Address[]
export async function getLocalNodeAddresses<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: TestClient<Transport, TChain, TAccount, false>,
): Promise<GetLocalNodeAddressesReturnType> {
  const result = await client.request({
    method: 'cfx_accounts',
  })
  return result
}
