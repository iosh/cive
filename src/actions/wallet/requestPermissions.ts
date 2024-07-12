import type { RequestErrorType } from 'viem/utils'
import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'

import type { Transport } from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { WalletPermission } from '../../types/eip1193.js'
import type { Prettify } from '../../types/utils.js'

export type RequestPermissionsParameters = Prettify<
  {
    cfx_accounts: Record<string, any>
  } & {
    [key: string]: Record<string, any>
  }
>
export type RequestPermissionsReturnType = WalletPermission[]

export type RequestPermissionsErrorType = RequestErrorType | ErrorType

export async function requestPermissions<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  permissions: RequestPermissionsParameters,
) {
  return client.request(
    {
      method: 'wallet_requestPermissions',
      params: [permissions],
    },
    { retryCount: 0 },
  )
}
