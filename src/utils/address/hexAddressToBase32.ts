import { hexToBytes } from "@noble/curves/abstract/utils";
import { Address, AddressType, NetworkPrefix } from "../../accounts/types.js";
import { MAIN_NETWORK_ID, TEST_NETWORK_ID } from "../network/networkId.js";

const typeMapToHex: Record<AddressType, string> = {
  builtin: "0x0",
  user: "0x1",
  contract: "0x2",
};

export function replaceHexPrefixByType(
  address: string,
  type: AddressType
): string {
  const typeHex = typeMapToHex[type];
  return typeHex + address.slice(3);
}

export function getAddressPrefixByNetworkId(networkId: number): NetworkPrefix {
  if (networkId === MAIN_NETWORK_ID) {
    return "cfx";
  }

  if (networkId === TEST_NETWORK_ID) {
    return "cfxtest";
  }

  return `net${networkId}`;
}

export type HexAddressToBase32Parameters = {
  hexAddress: string;
  networkId: number;
  addressType?: AddressType;
};

export function hexAddressToBase32({
  hexAddress,
  networkId,
  addressType = "user",
}: HexAddressToBase32Parameters): Address {
  const typedAddress = replaceHexPrefixByType(hexAddress, addressType);
  const hexBuffer = hexToBytes(typedAddress.slice(2));
  const addressPrefix = getAddressPrefixByNetworkId(networkId);

  
  const addressPrefix5Bits = hexToBytes(addressPrefix).map(
    (_byte) => _byte & 31
  );
}
