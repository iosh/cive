import type { Chain, Hash, Transport } from "viem";
import type { EpochNumber } from "../../types/block";
import type { Address } from "abitype";
import type { Client } from "../../clients/createClient";

export type GetPoSRewardByEpochParameters = {
  epochNumber: EpochNumber;
};

export type GetPoSRewardByEpochReturnType =
  | {
      accountRewards: {
        posAddress: Address;
        powAddress: Address;
        reward: BigInt;
      }[];
      powEpochHash: Hash;
    }
  | undefined;

export async function getPoSRewardByEpoch<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber }: GetPoSRewardByEpochParameters
): Promise<GetPoSRewardByEpochReturnType> {
  const result = await client.request({
    method: "cfx_getPoSRewardByEpoch",
    params: [epochNumber],
  });

  if (result === null) return undefined;

  return {
    ...result,
    accountRewards: result.accountRewards.map((item) => ({
      ...item,
      reward: BigInt(item.reward),
    })),
  };
}
