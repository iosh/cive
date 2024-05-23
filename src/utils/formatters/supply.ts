import type { RpcSupply } from "../../types/rpc";
import type { Supply } from "../../types/supply";
import type { ExactPartial } from "../../types/utils";

export function formatSupply(supply: ExactPartial<RpcSupply>): Supply {
  const result = {
    ...supply,
    totalIssued: supply.totalIssued ? BigInt(supply.totalIssued) : undefined,
    totalCollateral: supply.totalCollateral
      ? BigInt(supply.totalCollateral)
      : undefined,
    totalStaking: supply.totalStaking ? BigInt(supply.totalStaking) : undefined,
    totalCirculating: supply.totalCirculating
      ? BigInt(supply.totalCirculating)
      : undefined,
    totalEspaceTokens: supply.totalEspaceTokens
      ? BigInt(supply.totalEspaceTokens)
      : undefined,
  } as Supply;

  return result;
}
