import { hexToNumber, type HexToNumberErrorType, type Transport } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { Account } from '../../accounts/index.js'
import type { Client } from '../../clients/createClient.js'

export type GetChainIdReturnType = number

export type GetChainIdErrorType =
  | HexToNumberErrorType
  | RequestErrorType
  | ErrorType

export async function getChainId<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(client: Client<Transport, TChain, TAccount>): Promise<GetChainIdReturnType> {
  const chainIdHex = await client.request(
    {
      method: 'cfx_chainId',
    },
    { dedupe: true },
  )
  return hexToNumber(chainIdHex)
}
