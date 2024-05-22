import type { RequestErrorType } from "viem/utils";
import type { EpochTag } from "../../types/block";
import type { Reward } from "../../types/reward";
import type { ErrorType } from "../../errors/utils";
import { numberToHex, type Chain, type Transport } from "viem";
import type { Client } from "../../clients/createClient";
import { formatReward } from "../../utils/formatters/reward";

export type GetBlockRewardInfoParameters =
  | {
      epochTag?: "latest_checkpoint" | undefined;
      epochNumber?: never | undefined;
    }
  | {
      epochTag?: never | undefined;
      epochNumber?: bigint | undefined;
    };

export type GetBlockRewardInfoReturnType = Reward[];
export type GetBlockRewardInfoErrorType = RequestErrorType | ErrorType;

export async function getBlockRewardInfo<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber, epochTag = "latest_checkpoint" }: GetBlockRewardInfoParameters
): Promise<GetBlockRewardInfoReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const result = await client.request({
    method: "cfx_getBlockRewardInfo",
    params: [_epochNumber || epochTag],
  });

  return result.map(formatReward);
}
