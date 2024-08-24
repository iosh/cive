import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'

export type GetClientVersionReturnType = string

export type GetClientVersionErrorType = RequestErrorType | ErrorType

export async function getClientVersion<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
): Promise<GetClientVersionReturnType> {
  const result = await client.request({
    method: 'cfx_clientVersion',
  })
  return result
}
