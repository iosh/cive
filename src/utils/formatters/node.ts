import type { NodeState } from "../../types/node";
import type { RpcNodeState } from "../../types/rpc";
import type { ExactPartial } from "../../types/utils";

export function formatNodeState(
  nodeState: ExactPartial<RpcNodeState>
): NodeState {
  const result = {
    ...nodeState,
    blockNumber: nodeState.blockNumber
      ? BigInt(nodeState.blockNumber)
      : undefined,
    chainId: nodeState.chainId ? Number(nodeState.chainId) : undefined,
    networkId: nodeState.networkId ? Number(nodeState.networkId) : undefined,
    ethereumSpaceChainId: nodeState.ethereumSpaceChainId
      ? Number(nodeState.ethereumSpaceChainId)
      : undefined,
    epochNumber: nodeState.epochNumber
      ? BigInt(nodeState.epochNumber)
      : undefined,
    latestCheckpoint: nodeState.latestCheckpoint
      ? BigInt(nodeState.latestCheckpoint)
      : undefined,
    latestConfirmed: nodeState.latestConfirmed
      ? BigInt(nodeState.latestConfirmed)
      : undefined,
    latestState: nodeState.latestState
      ? BigInt(nodeState.latestState)
      : undefined,
    latestFinalized: nodeState.latestFinalized
      ? BigInt(nodeState.latestFinalized)
      : undefined,
    pendingTxNumber: nodeState.pendingTxNumber
      ? Number(nodeState.pendingTxNumber)
      : undefined,
  } as NodeState;

  return result;
}
