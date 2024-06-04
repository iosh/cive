import { Chain, Transport, numberToHex } from "viem";
import { TransactionReceipt } from "../../types/transaction.js";
import { Client } from "../../clients/createClient.js";
import { formatTransactionReceipt } from "../../utils/formatters/transactionReceipt.js";

export type GetEpochReceiptsParameters = {
  epochNumber: bigint;
};

export type GetEpochReceiptsReturnType = TransactionReceipt[];

export async function getEpochReceipts<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber }: GetEpochReceiptsParameters
): Promise<GetEpochReceiptsReturnType> {
  const result = await client.request({
    method: "cfx_getEpochReceipts",
    params: [numberToHex(epochNumber)],
  });
  return result.map(formatTransactionReceipt);
}
