import { Chain, Hash, Transport } from "viem";
import { TraceBlock } from "../../types/tract.js";
import { Client } from "../../clients/createClient.js";
import { formatTraceBlock } from "../../utils/formatters/tract.js";

export type TraceTransactionParameters = {
  transactionHash: Hash;
};

export type TraceTransactionReturnType = TraceBlock;

export async function traceTransaction<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { transactionHash }: TraceTransactionParameters
): Promise<TraceTransactionReturnType> {
  const result = await client.request({
    method: "trace_transaction",
    params: [transactionHash],
  });

  return formatTraceBlock(result);
}
