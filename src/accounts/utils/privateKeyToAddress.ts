import { secp256k1 } from '@noble/curves/secp256k1'
import { type BytesToHexErrorType, type Hex, bytesToHex } from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import type { Address, AddressType } from '../types.js'
import {
  type PublicKeyToAddressErrorType,
  publicKeyToAddress,
} from './publicKeyToAddress.js'

export type PrivateKeyToAddressErrorType =
  | BytesToHexErrorType
  | PublicKeyToAddressErrorType
  | ErrorType

export type PrivateKeyToAddressParameters = {
  privateKey: Hex
  networkId: number
  addressType?: AddressType | undefined
  verbose?: boolean | undefined
}

export function privateKeyToAddress<
  TNetworkId extends number = number,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined,
>({ privateKey, networkId, verbose = false }: PrivateKeyToAddressParameters) {
  const publicKey = bytesToHex(
    secp256k1.getPublicKey(privateKey.slice(2), false),
  )
  return publicKeyToAddress({
    publicKey,
    networkId,
    verbose,
  }) as Address<TNetworkId, TAddressType, TVerbose>
}
