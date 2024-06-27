import {
  ConvertBitExcessPaddingError,
  ConvertBitNonZeroPaddingError,
} from '../../errors/address.js'

export function convertBit(
  buffer: Uint8Array,
  inBits: number,
  outBits: number,
  isPad = false,
) {
  const mask = (1 << outBits) - 1
  const array = []
  let bits = 0
  let value = 0

  for (const byte of buffer) {
    bits += inBits

    value = (value << inBits) | byte

    while (bits >= outBits) {
      bits -= outBits
      array.push((value >>> bits) & mask)
    }
  }

  value = (value << (outBits - bits)) & mask
  if (bits && isPad) {
    array.push(value)
  } else if (value && !isPad) {
    throw new ConvertBitExcessPaddingError()
  } else if (bits >= inBits && !isPad) {
    throw new ConvertBitNonZeroPaddingError()
  }
  return array
}
