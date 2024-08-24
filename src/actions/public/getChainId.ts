import type { HexToNumberErrorType } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import { getAction } from '../../utils/getAction.js'
import { getStatus } from './getStatus.js'

export type GetChainIdReturnType = number

export type GetChainIdErrorType =
  | HexToNumberErrorType
  | RequestErrorType
  | ErrorType

export async function getChainId<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
): Promise<GetChainIdReturnType> {
  const result = await getAction(client, getStatus, 'getStatus')({})
  return result.chainId
}
