import { Hash, Transport } from "viem";
import { TraceBlock } from "../../types/tract.js";
import { Client } from "../../clients/createClient.js";
import { formatTraceBlock } from "../../utils/formatters/tract.js";
import { Chain } from "../../types/chain.js";

export type TraceBlockParameters = {
  blockHash: Hash;
};

export type TraceBlockReturnType = TraceBlock;

export async function traceBlock<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { blockHash }: TraceBlockParameters
): Promise<TraceBlockReturnType> {
  const result = await client.request({
    method: "trace_block",
    params: [blockHash],
  });

  return formatTraceBlock(result);
}
