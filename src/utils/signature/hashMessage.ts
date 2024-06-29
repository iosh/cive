import { type Keccak256ErrorType, keccak256 } from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import type { ByteArray, Hex, SignableMessage } from '../../types/misc.js'

import { toPrefixedMessage } from './toPrefixedMessage.js'

type To = 'hex' | 'bytes'

export type HashMessage<TTo extends To> =
  | (TTo extends 'bytes' ? ByteArray : never)
  | (TTo extends 'hex' ? Hex : never)

export type HashMessageErrorType = Keccak256ErrorType | ErrorType

export function hashMessage<TTo extends To = 'hex'>(
  message: SignableMessage,
  to_?: TTo | undefined,
): HashMessage<TTo> {
  return keccak256(toPrefixedMessage(message), to_)
}
