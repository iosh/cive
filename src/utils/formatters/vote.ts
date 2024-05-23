import type { RpcVote } from "../../types/rpc";
import type { ExactPartial } from "../../types/utils";
import type { Vote } from "../../types/vote";

export function formatVote(vote: ExactPartial<RpcVote>): Vote {
  const result = {
    ...vote,
    amount: vote.amount ? BigInt(vote.amount) : undefined,
    unlockBlockNumber: vote.unlockBlockNumber
      ? Number(vote.unlockBlockNumber)
      : undefined,
  } as Vote;

  return result;
}
