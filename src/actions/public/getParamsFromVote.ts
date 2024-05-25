import { numberToHex, type Chain, type Transport } from "viem";
import type { EpochTag } from "../../types/block";
import type { Client } from "../../clients/createClient";

export type GetParamsFormVoteParameters =
  | {
      /**
       * @default 'latest_state'
       */
      epochTag?: EpochTag | undefined;
      epochNumber?: never | undefined;
    }
  | {
      epochTag?: never | undefined;
      epochNumber?: bigint | undefined;
    };

export type GetParamsFormVoteReturnType = {
  powBaseReward: BigInt;
  interestRate: BigInt;
  storagePointProp: BigInt;
};

export async function getParamsFromVote<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber, epochTag = "latest_state" }: GetParamsFormVoteParameters
): Promise<GetParamsFormVoteReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const result = await client.request({
    method: "cfx_getParamsFromVote",
    params: [_epochNumber || epochTag],
  });
  return {
    ...result,
    powBaseReward: BigInt(result.powBaseReward),
    interestRate: BigInt(result.interestRate),
    storagePointProp: BigInt(result.storagePointProp),
  };
}
