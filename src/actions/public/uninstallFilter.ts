import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { Filter } from '../../types/filter.js'

export type UninstallFilterParameters = {
  filter: Filter<any>
}
export type UninstallFilterReturnType = boolean

export type UninstallFilterErrorType = RequestErrorType | ErrorType

export async function uninstallFilter<TChain extends Chain | undefined>(
  _client: Client<Transport, TChain>,
  { filter }: UninstallFilterParameters,
): Promise<UninstallFilterReturnType> {
  return filter.request({
    method: 'cfx_uninstallFilter',
    params: [filter.id],
  })
}
