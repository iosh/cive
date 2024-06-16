import { Transport } from "viem";
import { Account, Address } from "../../accounts/types.js";
import { LocalNodeClient } from "../../clients/createLocalClient.js";
import { Chain } from "../../types/chain.js";

export type CreateLocalNodeAccountParameters = {
  password: string;
};

export type CreateLocalNodeAccountReturnType = Address;

export async function createLocalNodeAccount<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined
>(
  client: LocalNodeClient<Transport, TChain, TAccount, false>,
  { password }: CreateLocalNodeAccountParameters
): Promise<CreateLocalNodeAccountReturnType> {
  const address = await client.request({
    method: "new_account",
    params: [password],
  });

  return address;
}
