import {
  generateMnemonic,
  generatePrivateKey,
  serializeSignature,
} from 'viem/accounts'
import type {
  GeneratePrivateKeyErrorType,
  PrivateKeyToAccountErrorType,
} from 'viem/accounts'

export { HDKey } from '@scure/bip32'
export { wordlist as czech } from '@scure/bip39/wordlists/czech'
export { wordlist as english } from '@scure/bip39/wordlists/english'
export { wordlist as french } from '@scure/bip39/wordlists/french'
export { wordlist as italian } from '@scure/bip39/wordlists/italian'
export { wordlist as japanese } from '@scure/bip39/wordlists/japanese'
export { wordlist as korean } from '@scure/bip39/wordlists/korean'
export { wordlist as simplifiedChinese } from '@scure/bip39/wordlists/simplified-chinese'
export { wordlist as spanish } from '@scure/bip39/wordlists/spanish'
export { wordlist as traditionalChinese } from '@scure/bip39/wordlists/traditional-chinese'

export { generateMnemonic, type GeneratePrivateKeyErrorType }

export { generatePrivateKey, type PrivateKeyToAccountErrorType }

export {
  type HDKeyToAccountErrorType,
  hdKeyToAccount,
} from './hdKeyToAccount.js'

export {
  MnemonicToAccountErrorType,
  mnemonicToAccount,
} from './mnemonicToAccount.js'

export { privateKeyToAccount } from './privateKeyToAccount.js'

export { type ToAccountErrorType, toAccount } from './toAccount.js'

export type {
  Account,
  AccountSource,
  CustomSource,
  HDOptions,
  JsonRpcAccount,
  LocalAccount,
  HDAccount,
  PrivateKeyAccount,
} from './types.js'
export {
  type SignErrorType,
  type SignParameters,
  type SignReturnType,
  sign,
} from './utils/sign.js'

export { serializeSignature }

export {
  type SignTransactionParameters,
  type SignTransactionReturnType,
  signTransaction,
} from './utils/signTransaction.js'

export {
  type ParseAccountErrorType,
  parseAccount,
} from './utils/parseAccount.js'
export {
  type PublicKeyToAddressErrorType,
  publicKeyToAddress,
} from './utils/publicKeyToAddress.js'
export {
  type PrivateKeyToAddressErrorType,
  privateKeyToAddress,
} from './utils/privateKeyToAddress.js'
