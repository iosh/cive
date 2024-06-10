import { chainIdLimit } from "../../constants/chain.js";


export function isValidChainId(chainId: string | number) {
  if (typeof chainId === "string") {
    return /^([1-9]\d*)$/.test(chainId) && Number(chainId) <= chainIdLimit;
  } else {
    return chainId > 0 && chainId < chainIdLimit;
  }
}
