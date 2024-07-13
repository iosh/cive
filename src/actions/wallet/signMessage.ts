import { type ToHexErrorType, type Transport, stringToHex, toHex } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import {
  type Account,
  type ParseAccountErrorType,
  parseAccount,
} from '../../accounts/index.js'
import type { SignMessageErrorType as SignMessageErrorType_account } from '../../accounts/utils/signMessage.js'
import type { Client } from '../../clients/createClient.js'
import { AccountNotFoundError } from '../../errors/account.js'
import type { ErrorType } from '../../errors/utils.js'
import type { GetAccountParameter } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { Hex, SignableMessage } from '../../types/misc.js'

export type SignMessageParameters<
  TAccount extends Account | undefined = Account | undefined,
> = GetAccountParameter<TAccount> & {
  message: SignableMessage
}

export type SignMessageReturnType = Hex

export type SignMessageErrorType =
  | ParseAccountErrorType
  | RequestErrorType
  | SignMessageErrorType_account
  | ToHexErrorType
  | ErrorType

export async function signMessage<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  {
    account: account_ = client.account,
    message,
  }: SignMessageParameters<TAccount>,
): Promise<SignMessageReturnType> {
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: '/docs/actions/wallet/signMessage',
    })
  const account = parseAccount(account_)
  if (account.type === 'local') return account.signMessage({ message })

  const message_ = (() => {
    if (typeof message === 'string') return stringToHex(message)
    if (message.raw instanceof Uint8Array) return toHex(message.raw)
    return message.raw
  })()

  return client.request(
    {
      method: 'personal_sign',
      params: [message_, account.address],
    },
    { retryCount: 0 },
  )
}
