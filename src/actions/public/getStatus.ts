import type { Chain, Transport } from "viem";
import type { NodeState } from "../../types/node";
import type { Client } from "../../clients/createClient";
import { formatNodeState } from "../../utils/formatters/node";
import type { RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";

export type GetStatusReturnType = NodeState;

export type GetStatusErrorType = RequestErrorType | ErrorType;

export async function getStatus<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>
): Promise<GetStatusReturnType> {
  const result = await client.request({
    method: "cfx_getStatus",
  });
  return formatNodeState(result);
}
