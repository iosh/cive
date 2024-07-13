import type { TypedData } from 'abitype'
import type { Account } from '../../accounts/types.js'
import {
  type ParseAccountErrorType,
  parseAccount,
} from '../../accounts/utils/parseAccount.js'
import type { SignTypedDataErrorType as SignTypedDataErrorType_account } from '../../accounts/utils/signTypedData.js'
import type { Client } from '../../clients/createClient.js'
import {
  AccountNotFoundError,
  type AccountNotFoundErrorType,
} from '../../errors/account.js'
import type { ErrorType } from '../../errors/utils.js'
import type { GetAccountParameter } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { Hex } from '../../types/misc.js'
import type { TypedDataDefinition } from '../../types/typedData.js'

import type { IsHexErrorType, StringifyErrorType, Transport } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import {
  type GetTypesForCIP23DomainErrorType,
  type SerializeTypedDataErrorType,
  type ValidateTypedDataErrorType,
  getTypesForCIP23Domain,
  serializeTypedData,
  validateTypedData,
} from '../../utils/typedData.js'

export type SignTypedDataParameters<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | 'CIP23Domain' = keyof typedData,
  account extends Account | undefined = undefined,
  ///
  primaryTypes = typedData extends TypedData ? keyof typedData : string,
> = TypedDataDefinition<typedData, primaryType, primaryTypes> &
  GetAccountParameter<account>

export type SignTypedDataReturnType = Hex

export type SignTypedDataErrorType =
  | AccountNotFoundErrorType
  | ParseAccountErrorType
  | GetTypesForCIP23DomainErrorType
  | ValidateTypedDataErrorType
  | StringifyErrorType
  | SignTypedDataErrorType_account
  | IsHexErrorType
  | RequestErrorType
  | SerializeTypedDataErrorType
  | ErrorType

export async function signTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | 'CIP23Domain',
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SignTypedDataParameters<typedData, primaryType, account>,
): Promise<SignTypedDataReturnType> {
  const {
    account: account_ = client.account,
    domain,
    message,
    primaryType,
  } = parameters as unknown as SignTypedDataParameters

  if (!account_)
    throw new AccountNotFoundError({
      docsPath: '/docs/actions/wallet/signTypedData',
    })
  const account = parseAccount(account_)

  const types = {
    EIP712Domain: getTypesForCIP23Domain({ domain }),
    ...parameters.types,
  }

  // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
  // as we can't statically check this with TypeScript.
  validateTypedData({ domain, message, primaryType, types })

  if (account.type === 'local')
    return account.signTypedData({ domain, message, primaryType, types })

  const typedData = serializeTypedData({ domain, message, primaryType, types })
  return client.request(
    {
      method: 'cfx_signTypedData_v4',
      params: [account.address, typedData],
    },
    { retryCount: 0 },
  )
}
