import type { Hex, Keccak256ErrorType } from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import { hexAddressToBase32 } from '../../utils/address/hexAddressToBase32.js'
import type { Address, AddressType } from '../types.js'
import { publicKeyToHexAddress } from './publicKeyToHexAddress.js'

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
  return hexAddressToBase32({
    hexAddress: publicKeyToHexAddress(publicKey),
    networkId,
    verbose,
  }) as Address<TNetworkId, TAddressType, TVerbose>
}
