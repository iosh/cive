import { NetworkNameType } from "../../accounts/types.js";
import { InvalidNetworkIdError } from "../../errors/address.js";
import { mainNetworkId, testNetworkId } from "../../constants/networkId.js";
import { isValidNetworkId } from "./isValidNetworkId.js";
export const NET_ID_LIMIT = 0xffffffff;

export function getNetworkPrefixByNetworkId(networkId: number): NetworkNameType {
  if (!isValidNetworkId(networkId)) {
    throw new InvalidNetworkIdError({ networkId });
  }

  if (networkId === mainNetworkId) {
    return "cfx";
  }

  if (networkId === testNetworkId) {
    return "cfxtest";
  }

  return `net${networkId}`;
}
