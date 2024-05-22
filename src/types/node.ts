import type { Hash } from "viem";

export type NodeState<TQuantity = bigint, TIndex = number> = {
  bestHash: Hash;
  blockNumber: TQuantity;
  chainId: TIndex;
  networkId: TIndex;
  ethereumSpaceChainId: TIndex;
  epochNumber: TQuantity;
  latestCheckpoint: TQuantity;
  latestConfirmed: TQuantity;
  latestFinalized: TQuantity;
  latestState: TQuantity;
  pendingTxNumber: TIndex;
};
