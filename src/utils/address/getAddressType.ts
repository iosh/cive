import type { AddressType } from '../../accounts/types.js'

export function getAddressTypeByHexAddress(
  hexAddressUit8Array: Uint8Array,
): AddressType | 'unknown' {
  switch (hexAddressUit8Array[0] & 0xf0) {
    case 0x10:
      return 'user'
    case 0x80:
      return 'contract'
    case 0x00:
      for (const x of hexAddressUit8Array) {
        if (x !== 0x00) return 'builtin'
      }
      return 'null'
    default:
      return 'unknown'
  }
}
