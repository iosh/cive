import { hexToBytes } from "@noble/curves/abstract/utils";
import { Address, AddressType } from "../../accounts/types.js";
import { stringToBytes, toHex, padHex, Hex } from "viem";
import { convertBit } from "./convertBit.js";
import { polyMod } from "./polyMod.js";
import { getAddressPrefixByNetworkId } from "./getAddressPrefixByNetworkId.js";

export const VERSION_BYTE = 0;

const typeMapToHex: Record<AddressType, string> = {
  builtin: "0x0",
  user: "0x1",
  contract: "0x2",
  null: "0x0",
};

export function replaceHexPrefixByType(
  address: string,
  type: AddressType
): string {
  const typeHex = typeMapToHex[type];
  return typeHex + address.slice(3);
}

export type HexAddressToBase32Parameters<TNetworkId extends number = number> = {
  hexAddress: Hex;
  networkId: TNetworkId;
  addressType?: AddressType;
  verbose?: boolean;
};

const ALPHABET = "ABCDEFGHJKMNPRSTUVWXYZ0123456789";

export function hexAddressToBase32<TNetworkId extends number = number>({
  hexAddress,
  networkId,
  addressType = "user",
  verbose = false,
}: HexAddressToBase32Parameters<TNetworkId>): Address<
  TNetworkId,
  typeof addressType
> {
  const typedAddress = replaceHexPrefixByType(hexAddress, addressType);
  const hexBuffer = hexToBytes(typedAddress.slice(2));
  const netName = getAddressPrefixByNetworkId(networkId).toUpperCase();

  const netName5Bits = stringToBytes(netName).map((_byte) => _byte & 31);

  const payload5Bits = convertBit(
    new Uint8Array([VERSION_BYTE, ...hexBuffer]),
    8,
    5,
    true
  );
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
    ])
  );
  let checksumHex = toHex(checksumBigInt);
  if (checksumHex.length < 12) {
    checksumHex = padHex(checksumHex, { dir: "left", size: 5 });
  }

  const checksumBytes = hexToBytes(checksumHex.replace(/0x/, ""));
  const checksum5Bits = convertBit(checksumBytes, 8, 5, true);

  const payload = payload5Bits
    .map(function (_byte2) {
      return ALPHABET[_byte2];
    })
    .join("");
  const checksum = checksum5Bits
    .map(function (_byte3) {
      return ALPHABET[_byte3];
    })
    .join("");

  return (
    verbose
      ? `${netName}:TYPE.${addressType.toUpperCase()}:${payload}${checksum}`
      : `${netName}:${payload}${checksum}`.toLowerCase()
  ) as Address<TNetworkId, typeof addressType>;
}
