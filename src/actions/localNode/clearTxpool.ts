import type { Transport } from 'viem'
import type { Account } from '../../accounts/types.js'
import type { LocalNodeClient } from '../../clients/createLocalClient.js'
import type { Chain } from '../../types/chain.js'

export async function clearTxpool<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(client: LocalNodeClient<Transport, TChain, TAccount, false>): Promise<void> {
  await client.request({
    method: 'txpool_clear',
  })
}
