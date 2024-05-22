import type { Address } from "abitype";
import type { Hash } from "viem";

export type Reward<TQuantity = bigint, TIndex = number> = {
  blockHash: Hash;
  author: Address;
  totalReward: TQuantity;
  baseReward: TQuantity;
  txFee: TIndex;
};
