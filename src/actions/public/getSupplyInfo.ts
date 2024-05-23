import type { Chain, Transport } from "viem";
import type { Supply } from "../../types/supply";
import type { Client } from "../../clients/createClient";
import { formatSupply } from "../../utils/formatters/supply";

export type GetSupplyInfoReturnType = Supply;

export async function getSupplyInfo<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>
): Promise<GetSupplyInfoReturnType> {
  const result = await client.request({
    method: "cfx_getSupplyInfo",
  });
  return formatSupply(result);
}
