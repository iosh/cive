import { secp256k1 } from '@noble/curves/secp256k1'

import {
  type HexToBigIntErrorType,
  type ToHexErrorType,
  hexToBigInt,
  toHex,
} from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import type { Hex, Signature } from '../../types/misc.js'

export type SerializeSignatureErrorType =
  | HexToBigIntErrorType
  | ToHexErrorType
  | ErrorType

export function serializeSignature({ r, s, v }: Signature): Hex {
  return `0x${new secp256k1.Signature(
    hexToBigInt(r),
    hexToBigInt(s),
  ).toCompactHex()}${toHex(v, { size: 1 }).slice(2)}`
}
