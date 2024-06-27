import {
  InvalidStorageKeySizeError,
  type InvalidStorageKeySizeErrorType,
} from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import type { Hex } from '../../types/misc.js'
import type { AccessList } from '../../types/transaction.js'
import { base32AddressToHex } from '../address/base32AddressToHex.js'
import { type IsAddressErrorType, isAddress } from '../address/isAddress.js'

import {
  InvalidAddressError,
  type InvalidAddressErrorType,
} from '../errors/address.js'

export type RecursiveArray<T> = T | readonly RecursiveArray<T>[]
export type SerializeAccessListErrorType =
  | InvalidStorageKeySizeErrorType
  | InvalidAddressErrorType
  | IsAddressErrorType
  | ErrorType

/*
 * Serialize an  EIP-2930 access list
 * @remarks
 * Use to create a transaction serializer with support for EIP-2930 access lists
 *
 * @param accessList - Array of objects of address and arrays of Storage Keys
 * @throws InvalidAddressError, InvalidStorageKeySizeError
 * @returns Array of hex strings
 */
export function serializeAccessList(
  accessList?: AccessList | undefined,
): RecursiveArray<Hex> {
  if (!accessList || accessList.length === 0) return []

  const serializedAccessList = []
  for (let i = 0; i < accessList.length; i++) {
    const { address, storageKeys } = accessList[i]

    for (let j = 0; j < storageKeys.length; j++) {
      if (storageKeys[j].length - 2 !== 64) {
        throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] })
      }
    }

    if (!isAddress(address)) {
      throw new InvalidAddressError({ address })
    }

    serializedAccessList.push([base32AddressToHex({ address }), storageKeys])
  }
  return serializedAccessList
}
