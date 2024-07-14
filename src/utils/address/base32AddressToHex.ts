import type { Address, AddressType, HexAddress } from '../../accounts/types.js'
import { MixedCaseAddressError } from '../../errors/address.js'
import { decodeBase32Address } from './decodeBase32Address.js'

export type Base32AddressToHexParameters<
  TNetworkId extends number | undefined = undefined,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined,
> = {
  address: Address<TNetworkId, TAddressType, TVerbose>
  strict?: boolean
}

export function base32AddressToHex<
  TNetworkId extends number | undefined = undefined,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined,
>({
  address,
  strict = true,
}: Base32AddressToHexParameters<
  TNetworkId,
  TAddressType,
  TVerbose
>): HexAddress {
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) {
    throw new MixedCaseAddressError({ address })
  }
  const addressInfo = decodeBase32Address({ address, strict })
  return addressInfo.address
}
