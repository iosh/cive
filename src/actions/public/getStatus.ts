import type { Transport } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { NodeState } from '../../types/node.js'
import { formatNodeState } from '../../utils/formatters/node.js'

export type GetStatusReturnType = NodeState

export type GetStatusErrorType = RequestErrorType | ErrorType

export async function getStatus<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
): Promise<GetStatusReturnType> {
  const result = await client.request({
    method: 'cfx_getStatus',
  })
  return formatNodeState(result)
}
