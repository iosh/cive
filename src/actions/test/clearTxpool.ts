import type { Account } from '../../accounts/types.js'
import type { TestClient } from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'

export async function clearTxpool<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(client: TestClient<Transport, TChain, TAccount, false>): Promise<void> {
  await client.request({
    method: 'txpool_clear',
  })
}
