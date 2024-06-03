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

export type PoSCommitteeNode<TQuantity = bigint> = {
  address: Address;
  votingPower: TQuantity;
};
export type PoSElection<TQuantity = bigint> = {
  isFinalized: boolean;
  startBlockNumber: TQuantity;
  topElectingNodes: PoSCommitteeNode<TQuantity>[];
};
export type PoSCurrentCommittee<TQuantity = bigint> = {
  epochNumber: TQuantity;
  nodes: PoSCommitteeNode<TQuantity>[];
  quorumVotingPower: TQuantity;
  totalVotingPower: TQuantity;
};

export type PoSCommittee<TQuantity = bigint> = {
  currentCommittee: PoSCurrentCommittee;
  elections: PoSElection<TQuantity>[];
};
