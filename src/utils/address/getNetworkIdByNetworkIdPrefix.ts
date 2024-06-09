import { InvalidNetworkIdError } from "../../errors/address.js";
import { mainNetworkId, testNetworkId } from "../../constants/networkId.js";
import { isValidNetworkId } from "./isValidNetworkId.js";
import {
  mainNetworkName,
  otherNetworkName,
  testNetworkName,
} from "../../constants/networkName.js";

export function getNetworkIdByNetworkIdPrefix(networkName: string): number {
  if (networkName === mainNetworkName) {
    return mainNetworkId;
  }
  if (networkName === testNetworkName) {
    return testNetworkId;
  }
  const netPrefix = networkName.slice(0, 3);
  const strNetId = networkName.slice(3);

  if (!isValidNetworkId(strNetId)) {
    throw new InvalidNetworkIdError({ networkId: strNetId });
  }

  if (netPrefix !== otherNetworkName) {
    throw new InvalidNetworkIdError({
      networkId: strNetId,
      message: "netId prefix should be passed by 'cfx', 'cfxtest' or 'net[n]'",
    });
  }
  const netId = Number(strNetId);
  if (netId === mainNetworkId || netId === testNetworkId) {
    throw new InvalidNetworkIdError({
      networkId: strNetId,
      message: "net1 or net1029 are invalid",
    });
  }
  return netId;
}
