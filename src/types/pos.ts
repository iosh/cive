import { Hash } from "viem";

export type Decision<TQuantity = bigint> = {
  height: TQuantity;
  blockHash: Hash;
};

export type PoSStatus<TQuantity = bigint> = {
  epoch: TQuantity;
  latestCommitted: TQuantity;
  latestVoted: TQuantity;
  pivotDecision: Decision<TQuantity>;
};
