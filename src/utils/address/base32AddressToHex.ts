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
import { decodeBase32Address } from "./decodeBase32Address.js";

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
export type Base32AddressToHexParameters<
  TNetworkId extends number | undefined = undefined,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined
> = {
  address: Address<TNetworkId, TAddressType, TVerbose>;
  strict?: boolean;
};

export function base32AddressToHex<
  TNetworkId extends number | undefined = undefined,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined
>({
  address,
  strict = true,
}: Base32AddressToHexParameters<
  TNetworkId,
  TAddressType,
  TVerbose
>): HexAddress {
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) {
    throw new MixedCaseAddressError({ address });
  }
  const addressInfo = decodeBase32Address({ address, strict });
  return addressInfo.address;
}
