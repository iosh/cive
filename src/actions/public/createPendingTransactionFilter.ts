import { RequestErrorType } from "viem/utils";
import { Filter } from "../../types/filter.js";
import { ErrorType } from "../../errors/utils.js";
import { Chain, Transport } from "viem";
import { Client } from "../../clients/createClient.js";
import { createFilterRequestScope } from "../../utils/filters/createFilterRequestScope.js";

export type CreatePendingTransactionFilterReturnType = Filter<"transaction">;

export type CreatePendingTransactionFilterErrorType =
  | RequestErrorType
  | ErrorType;

export async function createPendingTransactionFilter<
  TChain extends Chain | undefined
>(
  client: Client<Transport, TChain>
): Promise<CreatePendingTransactionFilterReturnType> {
  const getRequest = createFilterRequestScope(client, {
    method: "cfx_newPendingTransactionFilter",
  });
  const id = await client.request({
    method: "cfx_newPendingTransactionFilter",
  });
  return { id, request: getRequest(id), type: "transaction" };
}
