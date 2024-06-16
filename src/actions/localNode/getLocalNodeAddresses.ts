import { Transport } from "viem";
import { LocalNodeClient } from "../../clients/createLocalClient.js";
import { Chain } from "../../types/chain.js";
import { Account, Address } from "../../accounts/types.js";

export type GetLocalNodeAddressesReturnType = Address[];
export async function getLocalNodeAddresses<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined
>(
  client: LocalNodeClient<Transport, TChain, TAccount, false>
): Promise<GetLocalNodeAddressesReturnType> {
  const result = await client.request({
    method: "accounts",
  });
  return result;
}
