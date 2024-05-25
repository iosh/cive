import type { AccountPendingTransaction } from "../../types/account";
import { numberToHex, type Chain, type Transport } from "viem";
import type { Client } from "../../clients/createClient";
import { formatAccountPendingTransaction } from "../../utils/formatters/account";
import type { Address } from "../../accounts/types";

export type GetAccountPendingTransactionsParameters = {
  account: Address;
  nonce?: number;
  limit?: number;
};

export type GetAccountPendingTransactionsReturnType = AccountPendingTransaction;

export async function getAccountPendingTransactions<
  TChain extends Chain | undefined
>(
  client: Client<Transport, TChain>,
  { account, nonce, limit }: GetAccountPendingTransactionsParameters
): Promise<GetAccountPendingTransactionsReturnType> {
  const _nonce = nonce ? numberToHex(nonce) : undefined;
  const _limit = limit ? numberToHex(limit) : undefined;
  const result = await client.request({
    method: "cfx_getAccountPendingTransactions",
    params: [account, _nonce, _limit],
  });
  return formatAccountPendingTransaction(result);
}
