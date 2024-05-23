import type { Chain, Transport } from "viem";
import type { Address } from "../../accounts/types";
import type { AccountPending } from "../../types/account";
import type { Client } from "../../clients/createClient";
import { formatAccountPending } from "../../utils/formatters/account";

export type GetAccountPendingInfoParameters = {
  address: Address;
};

export type GetAccountPendingInfoReturnType = AccountPending;

export async function getAccountPendingInfo<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address }: GetAccountPendingInfoParameters
): Promise<GetAccountPendingInfoReturnType> {
  const result = await client.request({
    method: "cfx_getAccountPendingInfo",
    params: [address],
  });
  return formatAccountPending(result);
}
