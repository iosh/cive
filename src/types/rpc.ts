import type { Index, Quantity } from "viem";
import type { TransactionLegacy } from "./transaction";
import type { Block, EpochNumber, EpochTag } from "./block";

export type { Quantity };
export type RpcTransaction<TPending extends boolean = boolean> =
  TransactionLegacy<Quantity, Index, TPending, "0x0">;

export type RpcBlock<
  TBlockTag extends EpochTag = EpochTag,
  TIncludeTransactions extends boolean = boolean,
  TTransaction = RpcTransaction<TBlockTag extends "latest_mined" ? true : false>
> = Block<Quantity, TIncludeTransactions, TBlockTag, TTransaction>;

export type RpcEpochNumber = EpochNumber<Quantity>;
