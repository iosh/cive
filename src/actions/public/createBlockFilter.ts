import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { Filter } from '../../types/filter.js'
import { createFilterRequestScope } from '../../utils/filters/createFilterRequestScope.js'

export type CreateBlockFilterReturnType = Filter<'block'>

export type CreateBlockFilterErrorType = RequestErrorType | ErrorType

export async function createBlockFilter<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
): Promise<CreateBlockFilterReturnType> {
  const getRequest = createFilterRequestScope(client, {
    method: 'cfx_newBlockFilter',
  })
  const id = await client.request({
    method: 'cfx_newBlockFilter',
  })
  return { id, request: getRequest(id), type: 'block' }
}
