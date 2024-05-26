import type { Chain, Hash, Transport } from "viem";
import type { Client } from "../../clients/createClient.js";
import type { RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils.js";

export type GetBastBlockHashErrorType = RequestErrorType | ErrorType;
export type GetBastBlockHashReturn = Hash;

/**
 * Returns the hash of the best block.
 * - Docs: https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getbestblockhash
 * - JSON-RPC Method: [`cfx_getBestBlockHash`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getbestblockhash)
 * @param client
 * @returns
 */
export function getBastBlockHash<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>
): Promise<GetBastBlockHashReturn> {
  const blockHash = client.request({
    method: "cfx_getBestBlockHash",
  });

  return blockHash;
}
