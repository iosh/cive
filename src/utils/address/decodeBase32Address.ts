import { Address as HexAddress, bytesToHex, stringToBytes } from "viem";
import { Address, AddressType } from "../../accounts/types.js";
import {
  AddressTypeNotMatchError,
  InvalidAddressVersionError,
  MixedCaseAddressError,
} from "../../errors/address.js";
import { convertBit } from "./convertBit.js";
import { VERSION_BYTE } from "./hexAddressToBase32.js";
import { getAddressTypeByHexAddress } from "./getAddressType.js";
import { polyMod } from "./polyMod.js";
import { getNetworkIdByNetworkIdPrefix } from "./getNetworkIdByNetworkIdPrefix.js";

const ALPHABET_MAP: Record<string, number> = {
  "0": 22,
  "1": 23,
  "2": 24,
  "3": 25,
  "4": 26,
  "5": 27,
  "6": 28,
  "7": 29,
  "8": 30,
  "9": 31,
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  J: 8,
  K: 9,
  M: 10,
  N: 11,
  P: 12,
  R: 13,
  S: 14,
  T: 15,
  U: 16,
  V: 17,
  W: 18,
  X: 19,
  Y: 20,
  Z: 21,
};
export type DecodeBase32AddressParameters<
  TNetworkId extends number | undefined = undefined,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined
> = {
  address: Address<TNetworkId, TAddressType, TVerbose>;
  strict?: boolean;
};

export type DecodeBase32AddressReturnType = {
  address: HexAddress;
  type: AddressType;
  networkId: number;
};

export function decodeBase32Address<
  TNetworkId extends number | undefined = undefined,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined
>({
  address,
  strict = true,
}: DecodeBase32AddressParameters<
  TNetworkId,
  TAddressType,
  TVerbose
>): DecodeBase32AddressReturnType {
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) {
    throw new MixedCaseAddressError({ address });
  }

  const [, netName, shouldHaveType, payload, checksum] = address
    .toUpperCase()
    .match(/^([^:]+):(.+:)?(.{34})(.{8})$/) || ["", "", "", "", ""];

  const netName5Bits = stringToBytes(netName).map((_byte) => _byte & 0b11111);
  const payload5Bits = Array.from(payload, (char) => ALPHABET_MAP[char]);
  const checksum5Bits = Array.from(checksum, (char) => ALPHABET_MAP[char]);

  const [version, ...addressBytes] = convertBit(
    new Uint8Array([...payload5Bits]),
    5,
    8
  );
  if (version !== VERSION_BYTE) {
    throw new InvalidAddressVersionError({ address });
  }
  const byteAddress = new Uint8Array([...addressBytes]);
  const networkId = getNetworkIdByNetworkIdPrefix(netName);
  const type = getAddressTypeByHexAddress(byteAddress);

  if (shouldHaveType && `type.${type}:` !== shouldHaveType.toLowerCase()) {
    throw new AddressTypeNotMatchError({ address });
  }

  if (strict) {
    const valid = polyMod(
      new Uint8Array([...netName5Bits, 0, ...payload5Bits, ...checksum5Bits])
    );

    if (valid) {
      throw new InvalidAddressVersionError({ address });
    }
  }

  return {
    address: bytesToHex(byteAddress),
    type: type,
    networkId: networkId,
  };
}
