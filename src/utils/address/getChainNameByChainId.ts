import { ChainNameType } from "../../accounts/types.js";
import { mainChainId, testChainId } from "../../constants/chain.js";
import { InvalidChainIdError } from "../errors/chain.js";
import { isValidChainId } from "./isValidNetworkId.js";

export function getChainNameByChainName(chainId: number): ChainNameType {
  if (!isValidChainId(chainId)) {
    throw new InvalidChainIdError({ chainId: chainId });
  }

  if (chainId === mainChainId) {
    return "cfx";
  }

  if (chainId === testChainId) {
    return "cfxtest";
  }

  return `net${chainId}`;
}
