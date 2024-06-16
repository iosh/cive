import { Transport } from "viem";
import { LocalNodeClient } from "../../clients/createLocalClient.js";
import { Chain } from "../../types/chain.js";
import { Account } from "../../accounts/types.js";

export async function clearTxpool<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined
>(client: LocalNodeClient<Transport, TChain, TAccount, false>): Promise<void> {
  await client.request({
    method: "txpool_clear",
  });
}
