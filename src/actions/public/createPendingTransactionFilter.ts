import type { Transport } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { Filter } from '../../types/filter.js'
import { createFilterRequestScope } from '../../utils/filters/createFilterRequestScope.js'

export type CreatePendingTransactionFilterReturnType = Filter<'transaction'>

export type CreatePendingTransactionFilterErrorType =
  | RequestErrorType
  | ErrorType

export async function createPendingTransactionFilter<
  TChain extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
): Promise<CreatePendingTransactionFilterReturnType> {
  const getRequest = createFilterRequestScope(client, {
    method: 'cfx_newPendingTransactionFilter',
  })
  const id = await client.request({
    method: 'cfx_newPendingTransactionFilter',
  })
  return { id, request: getRequest(id), type: 'transaction' }
}
