import { NetworkPrefix } from "../../accounts/types.js";
import { InvalidNetworkIdError } from "../../errors/address.js";
import { MAIN_NETWORK_ID, TEST_NETWORK_ID } from "../network/networkId.js";
export const NET_ID_LIMIT = 0xffffffff;

export function getAddressPrefixByNetworkId(networkId: number): NetworkPrefix {
  if (networkId < 0 || networkId > NET_ID_LIMIT) {
    throw new InvalidNetworkIdError({ networkId });
  }

  if (networkId === MAIN_NETWORK_ID) {
    return "cfx";
  }

  if (networkId === TEST_NETWORK_ID) {
    return "cfxtest";
  }

  return `net${networkId}`;
}
