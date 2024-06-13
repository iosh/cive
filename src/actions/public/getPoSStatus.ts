import {  Transport } from "viem";
import { PoSStatus } from "../../types/pos.js";
import { Client } from "../../clients/createClient.js";
import { formatPoSStatus } from "../../utils/formatters/pos.js";
import { Chain } from "../../types/chain.js";

export type GetPoSStatusReturnType = PoSStatus;

export async function getPoSStatus<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>
): Promise<GetPoSStatusReturnType> {
  const result = await client.request({
    method: "pos_getStatus",
  });
  return formatPoSStatus(result);
}
