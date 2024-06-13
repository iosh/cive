import type {  Transport } from "viem";
import type { Address } from "../../accounts/types.js";
import type { PoSAccount } from "../../types/pos.js";
import type { Client } from "../../clients/createClient.js";
import { formatPoSAccount } from "../../utils/formatters/pos.js";
import { Chain } from "../../types/chain.js";

export type GetPoSAccountParameters = {
  address: Address;
};

export type GetPoSAccountReturnType = PoSAccount;

export async function getPoSAccount<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address }: GetPoSAccountParameters
): Promise<GetPoSAccountReturnType> {
  const result = await client.request({
    method: "pos_getAccount",
    params: [address],
  });
  return formatPoSAccount(result);
}
