import type { Index, Quantity } from "viem";
import type {
  TransactionLegacy,
  TransactionReceipt,
  TransactionRequest,
  TransactionRequestLegacy,
} from "./transaction.js";
import type { Block, EpochNumber, EpochTag } from "./block.js";
import type { Sponsor } from "./sponsor.js";
import type { FeeValueLegacy } from "./fee.js";
import type { Log } from "./log.js";
import type { ChainAccount } from "./chainAccount.js";
import type { NodeState } from "./node.js";
import type { Reward } from "./reward.js";
import type { Deposit } from "./deposit.js";
import type { Vote } from "./vote.js";
import type { Supply } from "./supply.js";
import type { AccountPending, AccountPendingTransaction } from "./account.js";
import { OneOf } from "./utils.js";

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

export type RpcTransactionRequest = OneOf<TransactionRequest<Quantity, Index>>;

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

export type RpcVote = Vote<Quantity, Index>;

export type RpcSupply = Supply<Quantity>;

export type RpcAccountPending = AccountPending<Quantity>;

export type RpcAccountPendingTransaction = AccountPendingTransaction<
  Quantity,
  Index
>;
