import {  Transport, numberToHex } from "viem";
import { PoSTransaction } from "../../types/pos.js";
import { Client } from "../../clients/createClient.js";
import { formatPoSTransaction } from "../../utils/formatters/pos.js";
import { Chain } from "../../types/chain.js";

export type GetPoSTransactionParameters = {
  transactionNumber: bigint;
};

export type GetPoSTransactionReturnType = PoSTransaction | null;

export async function getPoSTransactionByNumber<
  TChain extends Chain | undefined
>(
  client: Client<Transport, TChain>,
  { transactionNumber }: GetPoSTransactionParameters
): Promise<GetPoSTransactionReturnType> {
  const result = await client.request({
    method: "pos_getTransactionByNumber",
    params: [numberToHex(transactionNumber)],
  });

  if (!result) return null;

  return formatPoSTransaction(result);
}
