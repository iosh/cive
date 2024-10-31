import type { TestClient } from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { PhaseNameType } from '../../types/phase.js'

export type GetCurrentSyncPhaseReturnType = PhaseNameType

export async function getCurrentSyncPhase<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: TestClient<Transport, TChain, TAccount, false>,
): Promise<GetCurrentSyncPhaseReturnType> {
  const result = await client.request({
    method: 'current_sync_phase',
  })
  return result
}
