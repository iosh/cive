import { type NumberToHexErrorType, type Transport, numberToHex } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Account } from '../../accounts/index.js'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'

export type SwitchChainParameters = {
  /** ID of Chain to switch to */
  id: Chain['id']
}

export type SwitchChainErrorType =
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType

export async function switchChain<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined = undefined,
>(client: Client<Transport, TChain, TAccount>, { id }: SwitchChainParameters) {
  await client.request(
    {
      method: 'wallet_switchConfluxChain',
      params: [
        {
          chainId: numberToHex(id),
        },
      ],
    },
    { retryCount: 0 },
  )
}
