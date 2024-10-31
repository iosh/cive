import type { Account, Address } from '../../accounts/types.js'
import type { TestClient } from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'

export type CreateLocalNodeAccountParameters = {
  password: string
}

export type CreateLocalNodeAccountReturnType = Address

export async function createLocalNodeAccount<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: TestClient<Transport, TChain, TAccount, false>,
  { password }: CreateLocalNodeAccountParameters,
): Promise<CreateLocalNodeAccountReturnType> {
  const address = await client.request({
    method: 'new_account',
    params: [password],
  })

  return address
}
