import type { Address } from '../../accounts/types.js'
import type { ErrorType } from '../../errors/utils.js'
import { LruMap } from '../lru.js'
import { base32AddressToHex } from './base32AddressToHex.js'

export const isAddressCache = /*#__PURE__*/ new LruMap<boolean>(8192)

export type IsAddressErrorType = ErrorType

export function isAddress(address: string): address is Address {
  if (isAddressCache.has(address)) return isAddressCache.get(address)!

  const result = (() => {
    if (address.toLowerCase() !== address && address.toUpperCase() !== address)
      return false
    try {
      const addr = base32AddressToHex({ address: address as Address })
      return !!addr
    } catch (_error) {
      return false
    }
  })()
  isAddressCache.set(address, result)
  return result
}
