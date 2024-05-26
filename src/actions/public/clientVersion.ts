import type { RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils.js";
import type { Chain, Transport } from "viem";
import type { Client } from "../../clients/createClient.js";

export type ClientVersionReturnType = string;

export type ClientVersionErrorType = RequestErrorType | ErrorType;

export async function clientVersion<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>
): Promise<ClientVersionReturnType> {
  const result = await client.request({
    method: "cfx_clientVersion",
  });
  return result;
}
