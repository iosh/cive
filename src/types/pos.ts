import { Hash } from "viem";
import { Address } from "../accounts/types.js";

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

export type PoSVotesInQueue<TQuantity = bigint> = {
  endBlockNumber: TQuantity;
  power: TQuantity;
};
export type PoSAccountStatus<TQuantity = bigint> = {
  availableVotes: TQuantity;
  forfeited: TQuantity;
  forceRetired: TQuantity;
  inQueue: PoSVotesInQueue<TQuantity>[];
  locked: TQuantity;
  outQueue: PoSVotesInQueue<TQuantity>[];
  unlocked: TQuantity;
};

export type PoSAccount<TQuantity = bigint> = {
  address: Address;
  blockNumber: TQuantity;
  status: PoSAccountStatus<TQuantity>;
};
