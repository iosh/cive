import {
  type BytesToHexErrorType,
  type ConcatErrorType,
  type StringToHexErrorType,
  bytesToHex,
  concat,
  size,
  stringToHex,
} from 'viem'
import { preSignMessagePrefix } from '../../constants/strings.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Hex, SignableMessage } from '../../types/misc.js'

export type ToPrefixedMessageErrorType =
  | ConcatErrorType
  | StringToHexErrorType
  | BytesToHexErrorType
  | ErrorType

export function toPrefixedMessage(message_: SignableMessage): Hex {
  const message = (() => {
    if (typeof message_ === 'string') return stringToHex(message_)
    if (typeof message_.raw === 'string') return message_.raw
    return bytesToHex(message_.raw)
  })()
  const prefix = stringToHex(`${preSignMessagePrefix}${size(message)}`)
  return concat([prefix, message])
}
