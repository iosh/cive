import type { HDKey } from '@scure/bip32'

import { type ToHexErrorType, toHex } from 'viem/utils'

import type { ErrorType } from '../errors/utils.js'

import type { PrivateKeyToAccountErrorType } from 'viem/accounts'
import { privateKeyToAccount } from './privateKeyToAccount.js'
import type { HDAccount, HDOptions } from './types.js'

export type HDKeyToAccountErrorType =
  | PrivateKeyToAccountErrorType
  | ToHexErrorType
  | ErrorType

/**
 * @description Creates an Account from a HD Key.
 *
 * @returns A HD Account.
 */
export function hdKeyToAccount(
  hdKey_: HDKey,
  {
    networkId,
    accountIndex = 0,
    addressIndex = 0,
    changeIndex = 0,
    path,
    verbose = false,
  }: HDOptions & {
    verbose?: boolean | undefined
  },
): HDAccount {
  // default Conflux path-503
  const hdKey = hdKey_.derive(
    path || `m/44'/503'/${accountIndex}'/${changeIndex}/${addressIndex}`,
  )
  const account = privateKeyToAccount(toHex(hdKey.privateKey!), {
    networkId,
    verbose,
  })
  return {
    ...account,
    getHdKey: () => hdKey,
    source: 'hd',
  }
}
