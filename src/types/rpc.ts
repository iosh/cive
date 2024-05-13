import type { Index, Quantity } from "viem";
import type { TransactionLegacy } from "./transaction";

export type RpcTransaction<TPending extends boolean = boolean> =
  TransactionLegacy<Quantity, Index, TPending, "0x0">;
