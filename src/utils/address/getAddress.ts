import type { Address } from '../../accounts/types.js'
import type { ErrorType } from '../../errors/utils.js'
import { InvalidAddressError } from '../errors/address.js'
import { type IsAddressErrorType, isAddress } from './isAddress.js'

export type GetAddressErrorType = IsAddressErrorType | ErrorType

export function getAddress(address: string): Address {
  if (!isAddress(address)) throw new InvalidAddressError({ address })
  return address
}
