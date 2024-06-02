import {
  Chain,
  EIP1193Parameters,
  EIP1193RequestFn,
  Hex,
  Transport,
} from "viem";
import type { Filter } from "../../types/utils.js";
import { Client } from "../../clients/createClient.js";
import { PublicRpcSchema } from "../../types/eip1193.js";
import { OnResponseFn } from "../../clients/transports/fallback.js";

type CreateFilterRequestScopeParameters = {
  method:
    | "cfx_newFilter"
    | "cfx_newBlockFilter"
    | "cfx_newPendingTransactionFilter";
};

type FilterRpcSchema = Filter<
  PublicRpcSchema,
  { Method: "cfx_getFilterLogs" | "cfx_getFilterChanges" }
>;

type CreateFilterRequestScopeReturnType = (
  id: Hex
) => EIP1193RequestFn<FilterRpcSchema>;

/**
 * Scopes `request` to the filter ID. If the client is a fallback, it will
 * listen for responses and scope the child transport `request` function
 * to the successful filter ID.
 */
export function createFilterRequestScope<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { method }: CreateFilterRequestScopeParameters
): CreateFilterRequestScopeReturnType {
  const requestMap: Record<Hex, EIP1193RequestFn> = {};

  if (client.transport.type === "fallback")
    client.transport.onResponse?.(
      ({
        method: method_,
        response: id,
        status,
        transport,
      }: Parameters<OnResponseFn>[0]) => {
        if (status === "success" && method === method_)
          requestMap[id as Hex] = transport.request;
      }
    );

  return ((id) =>
    requestMap[id] || client.request) as CreateFilterRequestScopeReturnType;
}
