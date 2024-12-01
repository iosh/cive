import type { Account } from '../../accounts/types.js'
import type { TestClient } from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'

export type SayHelloLocalNodeReturnType = string
export async function sayHelloLocalNode<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: TestClient<Transport, TChain, TAccount, false>,
): Promise<SayHelloLocalNodeReturnType> {
  const result = await client.request(
    {
      method: 'test_sayHello',
    },
    {
      retryCount: 30,
      retryDelay: 300,
    },
  )
  return result
}
