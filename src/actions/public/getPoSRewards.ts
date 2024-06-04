import { Chain, Transport, numberToHex } from "viem";
import { PoSRewards } from "../../types/pos.js";
import { Client } from "../../clients/createClient.js";
import { formatPosRewards } from "../../utils/formatters/pos.js";

export type GetPoSRewardsParameters = {
  epochNumber: bigint;
};

export type GetPoSRewardsReturnType = PoSRewards;

export async function getPoSRewards<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber }: GetPoSRewardsParameters
): Promise<GetPoSRewardsReturnType> {
  const result = await client.request({
    method: "pos_getRewardsByEpoch",
    params: [numberToHex(epochNumber)],
  });
  return formatPosRewards(result);
}
