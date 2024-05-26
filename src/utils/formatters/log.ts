import type { ExactPartial } from "../../types/utils.js";
import type { RpcLog } from "../../types/rpc.js";
import type { Log } from "../../types/log.js";

export function formatLog(log: ExactPartial<RpcLog>) {
  return {
    ...log,
    epochNumber: log.epochNumber ? BigInt(log.epochNumber) : null,
    transactionIndex: log.transactionIndex
      ? BigInt(log.transactionIndex)
      : null,
    logIndex: log.transactionIndex ? BigInt(log.transactionIndex) : null,
    transactionLogIndex: log.transactionIndex
      ? BigInt(log.transactionIndex)
      : null,
  } as Log;
}
