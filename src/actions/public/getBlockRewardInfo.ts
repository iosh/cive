import type { RequestErrorType } from "viem/utils";
import type { Reward } from "../../types/reward.js";
import type { ErrorType } from "../../errors/utils.js";
import { numberToHex,  type Transport } from "viem";
import type { Client } from "../../clients/createClient.js";
import { formatReward } from "../../utils/formatters/reward.js";
import { EpochNumber } from "../../types/block.js";
import { Chain } from "../../types/chain.js";

export type GetBlockRewardInfoParameters =
  | {
      epochTag?: "latest_checkpoint" | undefined;
      epochNumber?: never | undefined;
    }
  | {
      epochTag?: never | undefined;
      epochNumber?: EpochNumber | undefined;
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
