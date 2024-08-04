import { type RecoverAddressErrorType, recoverAddress } from 'viem'
import type { HexAddress } from '../../accounts/types.js'
import type { ErrorType } from '../../errors/utils.js'
import type {
  ByteArray,
  Hex,
  SignableMessage,
  Signature,
} from '../../types/misc.js'
import { type HashMessageErrorType, hashMessage } from './hashMessage.js'

export type RecoverMessageAddressParameters = {
  message: SignableMessage
  signature: Hex | ByteArray | Signature
}

export type RecoverMessageAddressReturnType = HexAddress

export type RecoverMessageAddressErrorType =
  | HashMessageErrorType
  | RecoverAddressErrorType
  | ErrorType

export async function recoverMessageAddress({
  message,
  signature,
}: RecoverMessageAddressParameters): Promise<RecoverMessageAddressReturnType> {
  return recoverAddress({ hash: hashMessage(message), signature })
}
