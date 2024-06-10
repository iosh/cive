import {
  mainChainId,
  mainChainName,
  otherChainName,
  testChainId,
  testChainName,
} from "../../constants/chain.js";
import { isValidChainId } from "./isValidNetworkId.js";

import { InvalidChainIdError, InvalidChainNameError } from "../errors/chain.js";

export function getChainIdByChainName(networkName: string): number {
  const lowerCaseNetworkName = networkName.toLowerCase();
  if (lowerCaseNetworkName === mainChainName) {
    return mainChainId;
  }
  if (lowerCaseNetworkName === testChainName) {
    return testChainId;
  }
  const chainName = lowerCaseNetworkName.slice(0, 3);
  const strNetId = lowerCaseNetworkName.slice(3);

  if (!isValidChainId(strNetId)) {
    throw new InvalidChainIdError({ chainId: strNetId });
  }

  if (chainName !== otherChainName) {
    throw new InvalidChainNameError({
      chainName: chainName,
    });
  }
  const netId = Number(strNetId);
  if (netId === mainChainId || netId === testChainId) {
    throw new InvalidChainIdError({
      chainId: strNetId,
    });
  }
  return netId;
}
