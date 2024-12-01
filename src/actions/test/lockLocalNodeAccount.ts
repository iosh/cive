import type { Account, Address } from '../../accounts/types.js'
import type { TestClient } from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'

export type LockLocalNodeAccountParameters = {
  address: Address
}

export type LockLocalNodeAccountReturnType = boolean

export async function lockLocalNodeAccount<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: TestClient<Transport, TChain, TAccount, false>,
  { address }: LockLocalNodeAccountParameters,
): Promise<LockLocalNodeAccountReturnType> {
  const result = await client.request({
    method: 'cfx_lockAccount',
    params: [address],
  })

  return result
}
