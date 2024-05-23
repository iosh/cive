import type { Index, Quantity } from "viem";
import type {
  TransactionLegacy,
  TransactionReceipt,
  TransactionRequestLegacy,
} from "./transaction";
import type { Block, EpochNumber, EpochTag } from "./block";
import type { Sponsor } from "./sponsor";
import type { FeeValueLegacy } from "./fee";
import type { Log } from "./log";
import type { ChainAccount } from "./chainAccount";
import type { NodeState } from "./node";
import type { Reward } from "./reward";
import type { Deposit } from "./deposit";

export type { Quantity };
export type OutcomeStatus = "0x0" | "0x1" | "0x2";
export type RpcTransaction<TPending extends boolean = boolean> =
  TransactionLegacy<Quantity, Index, TPending>;

export type RpcBlock<
  TBlockTag extends EpochTag = EpochTag,
  TIncludeTransactions extends boolean = boolean,
  TTransaction = RpcTransaction<TBlockTag extends "latest_mined" ? true : false>
> = Block<Quantity, TIncludeTransactions, TBlockTag, TTransaction>;

export type RpcEpochNumber = EpochNumber<Quantity>;

export type RpcSponsor = Sponsor<Quantity>;

export type RpcTransactionRequest = TransactionRequestLegacy<
  Quantity,
  Index,
  "0x0"
>;

export type RpcFeeValue = FeeValueLegacy<Quantity>;

export type RpcLog = Log<Quantity>;

export type RpcTransactionReceipt = TransactionReceipt<
  Quantity,
  Index,
  OutcomeStatus
>;

export type RpcChainAccount = ChainAccount<Quantity>;

export type RpcNodeState = NodeState<Quantity, Index>;

export type RpcReward = Reward<Quantity, Index>;

export type RpcDeposit = Deposit<Quantity, Index>;
