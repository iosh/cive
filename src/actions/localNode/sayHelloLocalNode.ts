import type { Transport } from 'viem'
import type { Account } from '../../accounts/types.js'
import type { LocalNodeClient } from '../../clients/createLocalClient.js'
import type { Chain } from '../../types/chain.js'

export type SayHelloLocalNodeReturnType = string
export async function sayHelloLocalNode<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: LocalNodeClient<Transport, TChain, TAccount, false>,
): Promise<SayHelloLocalNodeReturnType> {
  const result = await client.request(
    {
      method: 'sayhello',
    },
    {
      retryCount: 30,
      retryDelay: 300,
    },
  )
  return result
}
