import type { PoSAccount, PoSStatus } from "../../types/pos.js";
import type { RpcPoSAccount, RpcPoSStatus } from "../../types/rpc.js";
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

export function formatPoSAccount(
  account: ExactPartial<RpcPoSAccount>
): PoSAccount {
  const { status } = account;
  const result = {
    ...account,
    blockNumber: account.blockNumber ? BigInt(account.blockNumber) : undefined,
    status: {
      ...status,
      availableVotes: status?.availableVotes
        ? BigInt(status.availableVotes)
        : undefined,
      forfeited: status?.forfeited ? BigInt(status.forfeited) : undefined,
      forceRetired: status?.forceRetired
        ? BigInt(status.forceRetired)
        : undefined,
      inQueue: status?.inQueue
        ? status.inQueue.map((inQueue) => ({
            endBlockNumber: inQueue?.endBlockNumber
              ? BigInt(inQueue.endBlockNumber)
              : undefined,
            power: inQueue?.power ? BigInt(inQueue.power) : undefined,
          }))
        : undefined,
      locked: status?.locked ? BigInt(status.locked) : undefined,
      outQueue: status?.outQueue
        ? status.outQueue.map((outQueue) => ({
            endBlockNumber: outQueue?.endBlockNumber
              ? BigInt(outQueue.endBlockNumber)
              : undefined,
            power: outQueue?.power ? BigInt(outQueue.power) : undefined,
          }))
        : undefined,
      unlocked: status?.unlocked ? BigInt(status.unlocked) : undefined,
    },
  } as PoSAccount;

  return result;
}
