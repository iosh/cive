import { Transport } from "viem";
import { DebugClient } from "../../clients/createDebugClient.js";
import { Chain } from "../../types/chain.js";

export async function clearTxpool<TChain extends Chain | undefined>(
  client: DebugClient<Transport, TChain>
) {
  await client.request({
    method: "txpool_clear",
  });
}
