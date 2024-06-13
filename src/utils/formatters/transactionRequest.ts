import { numberToHex } from "viem";
import { TransactionRequest } from "../../types/transaction.js";
import { ExactPartial } from "../../types/utils.js";
import { RpcTransactionRequest } from "../../types/rpc.js";
import { Chain, ExtractChainFormatterParameters } from "../../types/chain.js";

export type FormattedTransactionRequest<
  TChain extends Chain | undefined = Chain | undefined
> = ExtractChainFormatterParameters<
  TChain,
  "transactionRequest",
  TransactionRequest
>;

export const rpcTransactionType = {
  legacy: "0x0",
  eip2930: "0x1",
  eip1559: "0x2",
} as const;

export function formatTransactionRequest(
  request: ExactPartial<TransactionRequest>
): RpcTransactionRequest {
  const rpcRequest = {} as RpcTransactionRequest;
  if (typeof request.from !== "undefined") rpcRequest.from = request.from;
  if (typeof request.to !== "undefined") rpcRequest.to = request.to;
  if (typeof request.gasPrice !== "undefined")
    rpcRequest.gasPrice = numberToHex(request.gasPrice);
  if (typeof request.gas !== "undefined")
    rpcRequest.gas = numberToHex(request.gas);
  if (typeof request.value !== "undefined")
    rpcRequest.value = numberToHex(request.value);
  if (typeof request.data !== "undefined") rpcRequest.data = request.data;
  if (typeof request.nonce !== "undefined")
    rpcRequest.nonce = numberToHex(request.nonce);
  if (typeof request.storageLimit !== "undefined") {
    rpcRequest.storageLimit = numberToHex(request.storageLimit);
  }
  if (typeof request.accessList !== "undefined")
    rpcRequest.accessList = request.accessList;
  if (typeof request.maxFeePerGas !== "undefined")
    rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
  if (typeof request.maxPriorityFeePerGas !== "undefined")
    rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
  if (typeof request.type !== "undefined")
    rpcRequest.type = rpcTransactionType[request.type];
  return rpcRequest;
}
