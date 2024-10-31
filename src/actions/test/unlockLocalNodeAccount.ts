import { numberToHex } from 'viem/utils'
import type { Account, Address } from '../../accounts/types.js'
import type { TestClient } from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'

export type UnlockLocalNodeAccountParameters = {
  address: Address
  password: string
  /**
   * @default 300 seconds
   */
  duration?: number
}

export type UnlockLocalNodeAccountReturnType = boolean

export async function unlockLocalNodeAccount<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: TestClient<Transport, TChain, TAccount, false>,
  { address, password, duration = 300 }: UnlockLocalNodeAccountParameters,
): Promise<UnlockLocalNodeAccountReturnType> {
  const duration_ = numberToHex(duration)
  const result = await client.request({
    method: 'unlock_account',
    params: [address, password, duration_],
  })
  return result
}
