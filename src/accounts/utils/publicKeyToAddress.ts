import { type Hex, type Keccak256ErrorType, keccak256 } from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import { hexAddressToBase32 } from '../../utils/address/hexAddressToBase32.js'
import type { Address, AddressType } from '../types.js'

export type PublicKeyToAddressParameters<
  TNetworkId extends number = number,
  TVerbose extends boolean | undefined = undefined,
> = {
  publicKey: Hex
  networkId: TNetworkId
  verbose?: TVerbose
}

export type PublicKeyToAddressErrorType = Keccak256ErrorType | ErrorType

export function publicKeyToAddress<
  TNetworkId extends number = number,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined,
>({
  publicKey,
  networkId,
  verbose = false,
}: PublicKeyToAddressParameters<TNetworkId, TVerbose>) {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26)
  return hexAddressToBase32({
    hexAddress: `0x1${address.substring(1)}`,
    networkId,
    verbose,
  }) as Address<TNetworkId, TAddressType, TVerbose>
}
