import type { Index, Quantity } from "viem";
import type {
  TransactionEIP1559,
  TransactionEIP2930,
  TransactionLegacy,
  TransactionReceipt,
  TransactionRequest,
  TransactionRequestEIP1559,
  TransactionRequestEIP2930,
  TransactionRequestLegacy,
  TransactionType,
} from "./transaction.js";
import type { Block, EpochNumber, EpochTag } from "./block.js";
import type { Sponsor } from "./sponsor.js";
import type { FeeValues, GasAndCollateral } from "./fee.js";
import type { Log } from "./log.js";
import type { ChainAccount } from "./chainAccount.js";
import type { NodeState } from "./node.js";
import type { Reward } from "./reward.js";
import type { Deposit } from "./deposit.js";
import type { Vote } from "./vote.js";
import type { Supply } from "./supply.js";
import type { AccountPending, AccountPendingTransaction } from "./account.js";
import { OneOf, UnionOmit, UnionPartialBy } from "./utils.js";
import { LogFilter } from "./filter.js";
import { PoSStatus } from "./posStatus.js";

export type { Quantity };
export type OutcomeStatus = "0x0" | "0x1" | "0x2";
export type RpcTransaction<TPending extends boolean = boolean> = UnionOmit<
  OneOf<
    | TransactionLegacy<Quantity, Index, TPending, "0x0">
    | TransactionEIP2930<Quantity, Index, TPending, "0x1">
    | TransactionEIP1559<Quantity, Index, TPending, "0x2">
  >,
  // `yParity` is optional on the RPC type as some nodes do not return it
  // for 1559 & 2930 transactions (they should!).
  "yParity"
>;

export type RpcBlock<
  TBlockTag extends EpochTag = EpochTag,
  TIncludeTransactions extends boolean = boolean,
  TTransaction = RpcTransaction<TBlockTag extends "latest_mined" ? true : false>
> = Block<Quantity, TIncludeTransactions, TBlockTag, TTransaction>;

export type RpcEpochNumber = EpochNumber<Quantity>;

export type RpcSponsor = Sponsor<Quantity>;

export type RpcTransactionRequest = OneOf<
  | TransactionRequestLegacy<Quantity, Index, "0x0">
  | TransactionRequestEIP2930<Quantity, Index, "0x1">
  | TransactionRequestEIP1559<Quantity, Index, "0x2">
>;

export type RpcFeeValue = FeeValues<Quantity>;
export type RpcGasAndCollateral = GasAndCollateral<Quantity>;

export type RpcLog = Log<Quantity, Index>;

export type RpcTransactionReceipt = TransactionReceipt<
  Quantity,
  Index,
  OutcomeStatus,
  TransactionType
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

export type RpcLogFilter = LogFilter<Quantity>;


export type RpcPoSStatus = PoSStatus<Quantity>