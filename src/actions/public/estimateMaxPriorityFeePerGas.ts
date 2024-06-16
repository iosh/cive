import {  Transport } from "viem";
import { Client } from "../../clients/createClient.js";
import { Chain } from "../../types/chain.js";

export type EstimateMaxPriorityFeePerGasReturnType = bigint;

export async function estimateMaxPriorityFeePerGas<
  chain extends Chain | undefined
>(
  client: Client<Transport, chain>
): Promise<EstimateMaxPriorityFeePerGasReturnType> {
  const maxPriorityFeePerGasHex = await client.request({
    method: "cfx_maxPriorityFeePerGas",
  });
  return BigInt(maxPriorityFeePerGasHex);
}