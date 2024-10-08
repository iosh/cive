import type { ErrorType } from '../../errors/utils.js'
import type { Hex, SignableMessage } from '../../types/misc.js'
import {
  type HashMessageErrorType,
  hashMessage,
} from '../../utils/signature/hashMessage.js'
import {
  type SerializeSignatureErrorType,
  serializeSignature,
} from '../../utils/signature/serializeSignature.js'

import { type SignErrorType, sign } from './sign.js'

export type SignMessageParameters = {
  /** The message to sign. */
  message: SignableMessage
  /** The private key to sign with. */
  privateKey: Hex
}

export type SignMessageReturnType = Hex

export type SignMessageErrorType =
  | SignErrorType
  | HashMessageErrorType
  | SerializeSignatureErrorType
  | ErrorType

export async function signMessage({
  message,
  privateKey,
}: SignMessageParameters): Promise<SignMessageReturnType> {
  const signature = await sign({ hash: hashMessage(message), privateKey })
  return serializeSignature(signature)
}
