import { secp256k1 } from '@noble/curves/secp256k1'

import type { NumberToHexErrorType } from 'viem'
import { numberToHex } from 'viem/utils'
import type { ErrorType } from '../../errors/utils.js'
import type { Hex, Signature } from '../../types/misc.js'
export type ParseSignatureErrorType = NumberToHexErrorType | ErrorType

export function parseSignature(signatureHex: Hex) {
  const { r, s } = secp256k1.Signature.fromCompact(signatureHex.slice(2, 130))
  const v = Number(`0x${signatureHex.slice(130)}`)

  return {
    r: numberToHex(r, { size: 32 }),
    s: numberToHex(s, { size: 32 }),
    v: BigInt(v),
  } satisfies Signature
}
