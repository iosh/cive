import { numberToHex, type Chain, type Hash, type Transport } from "viem";
import type { EpochNumber } from "../../types/block.js";
import type { Client } from "../../clients/createClient.js";
import type { Address } from "../../accounts/types.js";

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
  | null;

export async function getPoSRewardByEpoch<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber }: GetPoSRewardByEpochParameters
): Promise<GetPoSRewardByEpochReturnType> {
  const result = await client.request({
    method: "cfx_getPoSRewardByEpoch",
    params: [numberToHex(epochNumber)],
  });

  if (result === null) return null;

  return {
    ...result,
    accountRewards: result.accountRewards.map((item) => ({
      ...item,
      reward: BigInt(item.reward),
    })),
  };
}
