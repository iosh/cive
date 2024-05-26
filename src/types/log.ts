import type { Hash, Hex } from "viem";
import type { Address } from "../accounts/types.js";

export type Log<TQuantity = bigint> = {
  address: Address;
  topics: Hex[];
  data: Hex;
  blockHash: Hex;
  epochNumber: TQuantity;
  transactionHash: Hash;
  transactionIndex: TQuantity;
  logIndex: TQuantity;
  transactionLogIndex: TQuantity;
};
