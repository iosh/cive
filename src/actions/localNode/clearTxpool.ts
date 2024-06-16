import { Transport } from "viem";
import { LocalNodeClient } from "../../clients/createLocalNodeClient.js";
import { Chain } from "../../types/chain.js";

export async function clearTxpool<TChain extends Chain | undefined>(
  client: LocalNodeClient<Transport, TChain>
): Promise<void> {
  await client.request({
    method: "txpool_clear",
  });
}
