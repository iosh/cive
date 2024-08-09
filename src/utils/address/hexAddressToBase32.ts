import { type Hex, hexToBytes, padHex, stringToBytes, toHex } from 'viem'
import type { Address, AddressType } from '../../accounts/types.js'
import { convertBit } from './convertBit.js'
import { getNetworkPrefixByNetworkId } from './getNetworkIdPrefixByNetworkId.js'
import { polyMod } from './polyMod.js'
import { getAddressTypeByHexAddress } from './getAddressType.js'

export const VERSION_BYTE = 0

export type HexAddressToBase32Parameters<
  TNetworkId extends number = number,
  TVerbose extends boolean | undefined = undefined,
> = {
  hexAddress: Hex
  networkId: TNetworkId
  verbose?: TVerbose | undefined
}

const ALPHABET = 'ABCDEFGHJKMNPRSTUVWXYZ0123456789'

export function hexAddressToBase32<
  TNetworkId extends number = number,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined,
>({
  hexAddress,
  networkId,
  verbose = false,
}: HexAddressToBase32Parameters<TNetworkId, TVerbose>): Address<
  TNetworkId,
  TAddressType,
  TVerbose
> {
  const hexBuffer = hexToBytes(hexAddress)
  
  const addressType = getAddressTypeByHexAddress(hexBuffer)

  const netName = getNetworkPrefixByNetworkId(networkId).toUpperCase()

  const netName5Bits = stringToBytes(netName).map((_byte) => _byte & 31)

  const payload5Bits = convertBit(
    new Uint8Array([VERSION_BYTE, ...hexBuffer]),
    8,
    5,
    true,
  )
  const checksumBigInt = polyMod(
    new Uint8Array([
      ...netName5Bits,
      0,
      ...payload5Bits,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]),
  )
  let checksumHex = toHex(checksumBigInt)
  if (checksumHex.length < 12) {
    checksumHex = padHex(checksumHex, { dir: 'left', size: 5 })
  }

  const checksumBytes = hexToBytes(checksumHex)
  const checksum5Bits = convertBit(checksumBytes, 8, 5, true)

  const payload = payload5Bits.map((_byte2) => ALPHABET[_byte2]).join('')
  const checksum = checksum5Bits.map((_byte3) => ALPHABET[_byte3]).join('')

  return (
    verbose
      ? `${netName}:TYPE.${addressType.toUpperCase()}:${payload}${checksum}`
      : `${netName}:${payload}${checksum}`.toLowerCase()
  ) as Address<TNetworkId, TAddressType, TVerbose>
}
