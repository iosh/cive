import { Hash, Hex } from "viem";
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

export type PoSSignature<TQuantity = bigint> = {
  account: Address;
  votes: TQuantity;
};

export type PoSBlock<TQuantity = bigint> = {
  hash: Hash;
  hight: TQuantity;
  epoch: TQuantity;
  round: TQuantity;
  miner: Address | null;
  lastTxNumber: TQuantity;
  parentHash: Hash;
  pivotDecision: Decision<TQuantity>;
  timestamp: TQuantity;
  signatures: PoSSignature<TQuantity>[];
};

export type PoSAccountRewards<TQuantity = bigint> = {
  posAddress: Address;
  powAddress: Address;
  reward: TQuantity;
};
export type PoSRewards<TQuantity = bigint> = {
  accountRewards: PoSAccountRewards<TQuantity>[];
  powEpochHash: Hash;
};

export type PoSTransactionRegisterType = {
  type: "Register";
  payload: {
    publicKey: Hex;
    vrfPublicKey: Hex;
  };
};

export type PoSTransactionElectionType<TQuantity = bigint> = {
  type: "Election";
  payload: {
    publicKey: Hex;
    targetTerm: TQuantity;
    vrfProof: Hex;
    vrfPublicKey: Hex;
  };
};

export type PoSTransactionUpdateVotingPowerType<TQuantity = bigint> = {
  type: "UpdateVotingPower";
  payload: {
    address: Hex;
    votingPower: TQuantity;
  };
};

export type PoSTransactionRetireType<TQuantity = bigint> = {
  type: "Retire";
  payload: {
    address: Hex;
    votingPower: TQuantity;
  };
};
export type PoSTransactionPivotDecisionType<TQuantity = bigint> = {
  type: "PivotDecision";
  payload: {
    blockHash: Hash;
    height: TQuantity;
  };
};
export type PoSTransactionDisputeType = {
  type: "Dispute";
  payload: {
    address: Hex;
    blsPublicKey: Hex;
    vrfPublicKey: Hex;
    conflictingVotes: {
      conflictVoteType: Hex;
      first: Hex;
      second: Hex;
    };
  };
};

export type PoSTransactionTypeAndPayload<TQuantity = bigint> =
  | PoSTransactionRegisterType
  | PoSTransactionElectionType<TQuantity>
  | PoSTransactionUpdateVotingPowerType<TQuantity>
  | PoSTransactionRetireType<TQuantity>
  | PoSTransactionPivotDecisionType<TQuantity>
  | PoSTransactionDisputeType;

export type PoSTransaction<TQuantity = bigint> = {
  hash: Hash;
  from: Address;
  number: TQuantity;
  blockHash: Hash;
  blockNumber: TQuantity;
  timestamp: TQuantity;
  status: "Executed" | "Failed" | "Discard"
} & PoSTransactionTypeAndPayload<TQuantity>;
