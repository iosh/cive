import type { PoSStatus } from "../../types/posStatus.js";
import type { RpcPoSStatus } from "../../types/rpc.js";
import { ExactPartial } from "../../types/utils.js";

export function formatPoSStatus(status: ExactPartial<RpcPoSStatus>): PoSStatus {
  const result = {
    ...status,
    epoch: status.epoch ? BigInt(status.epoch) : undefined,
    latestCommitted: status.latestCommitted
      ? BigInt(status.latestCommitted)
      : undefined,
    latestVoted: status.latestVoted ? BigInt(status.latestVoted) : undefined,
    pivotDecision: status.pivotDecision
      ? {
          height: status.pivotDecision.height
            ? BigInt(status.pivotDecision.height)
            : undefined,
          blockHash: status.pivotDecision.blockHash
            ? status.pivotDecision.blockHash
            : undefined,
        }
      : undefined,
  } as PoSStatus;

  return result;
}
