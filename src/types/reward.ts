import type { Hash } from "viem";
import type { Address } from "../accounts/types";

export type Reward<TQuantity = bigint, TIndex = number> = {
  blockHash: Hash;
  author: Address;
  totalReward: TQuantity;
  baseReward: TQuantity;
  txFee: TIndex;
};
