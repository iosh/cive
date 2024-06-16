import { Transport } from "viem";
import { LocalClient } from "../../clients/createLocalClient.js";
import { Chain } from "../../types/chain.js";
import { Account, Address } from "../../accounts/types.js";

export type GetAddressesLocalNodeReturnType = Address[];
export async function getAddressesLocalNode<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined
>(
  client: LocalClient<Transport, TChain, TAccount, false>
): Promise<GetAddressesLocalNodeReturnType> {
  const result = await client.request({
    method: "accounts",
  });
  return result;
}
