import type { Address } from "abitype";
import type { Hash, Hex } from "viem";

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
