import type {
  PoSAccount,
  PoSBlock,
  PoSCommittee,
  PoSRewards,
  PoSStatus,
  PoSTransaction,
} from "../../types/pos.js";
import type {
  RpcPoSAccount,
  RpcPoSBlock,
  RpcPoSCommittee,
  RpcPoSRewards,
  RpcPoSStatus,
  RpcPoSTransaction,
} from "../../types/rpc.js";
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

export function formatPoSCommittee(
  committee: ExactPartial<RpcPoSCommittee>
): PoSCommittee {
  const { currentCommittee } = committee;
  const result = {
    ...committee,
    currentCommittee: {
      ...currentCommittee,
      epochNumber: currentCommittee?.epochNumber
        ? BigInt(currentCommittee.epochNumber)
        : undefined,
      nodes: currentCommittee?.nodes
        ? currentCommittee?.nodes?.map((node) => ({
            ...node,
            votingPower: node?.votingPower
              ? BigInt(node.votingPower)
              : undefined,
          }))
        : undefined,
      quorumVotingPower: currentCommittee?.quorumVotingPower
        ? BigInt(currentCommittee.quorumVotingPower)
        : undefined,
      totalVotingPower: currentCommittee?.totalVotingPower
        ? BigInt(currentCommittee.totalVotingPower)
        : undefined,
    },
    elections: committee?.elections
      ? committee?.elections?.map((election) => ({
          ...election,
          startBlockNumber: election?.startBlockNumber
            ? BigInt(election.startBlockNumber)
            : undefined,
          topElectingNodes: election?.topElectingNodes
            ? election?.topElectingNodes?.map((node) => ({
                ...node,
                votingPower: node?.votingPower
                  ? BigInt(node.votingPower)
                  : undefined,
              }))
            : undefined,
        }))
      : undefined,
  } as PoSCommittee;

  return result;
}

export function formatPoSBlock(block: ExactPartial<RpcPoSBlock>): PoSBlock {
  const { pivotDecision } = block;
  const result = {
    ...block,
    epoch: block.epoch ? BigInt(block.epoch) : undefined,
    hight: block.hight ? BigInt(block.hight) : undefined,
    lastTxNumber: block?.lastTxNumber ? BigInt(block.lastTxNumber) : undefined,
    pivotDecision: {
      ...pivotDecision,
      height: pivotDecision?.height ? BigInt(pivotDecision.height) : undefined,
    },
    round: block?.round ? BigInt(block.round) : undefined,
    signatures: block?.signatures
      ? block.signatures.map((signature) => ({
          ...signature,
          votes: signature?.votes ? BigInt(signature.votes) : undefined,
        }))
      : undefined,
    timestamp: block?.timestamp ? BigInt(block.timestamp) : undefined,
  } as PoSBlock;

  return result;
}

export function formatPosRewards(
  rewards: ExactPartial<RpcPoSRewards>
): PoSRewards {
  const result = {
    ...rewards,
    accountRewards: rewards?.accountRewards
      ? rewards.accountRewards.map((reward) => ({
          ...reward,
          reward: reward?.reward ? BigInt(reward.reward) : undefined,
        }))
      : undefined,
  } as PoSRewards;

  return result;
}

export function formatPoSTransaction(
  tx: ExactPartial<RpcPoSTransaction>
): PoSTransaction {
  const result = {
    ...tx,
    number: tx?.number ? BigInt(tx.number) : undefined,
    blockNumber: tx?.blockNumber ? BigInt(tx.blockNumber) : undefined,
    timestamp: tx?.timestamp ? BigInt(tx.timestamp) : undefined,
  } as PoSTransaction;

  if (result.type === "Election") {
    result.payload = {
      ...result.payload,
      targetTerm: BigInt(result.payload.targetTerm),
    };
  }

  if (result.type === "UpdateVotingPower") {
    result.payload = {
      ...result.payload,
      votingPower: BigInt(result.payload.votingPower),
    };
  }

  if (result.type === "Retire") {
    result.payload = {
      ...result.payload,
      votingPower: BigInt(result.payload.votingPower),
    };
  }

  if (result.type === "PivotDecision") {
    result.payload = {
      ...result.payload,
      height: BigInt(result.payload.height),
    };
  }

  return result;
}
