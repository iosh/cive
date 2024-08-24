import type { Index, Quantity } from 'viem'
import type { AccountPending, AccountPendingTransaction } from './account.js'
import type { Block, EpochNumber, EpochTag } from './block.js'
import type { ChainAccount } from './chainAccount.js'
import type { Deposit } from './deposit.js'
import type { FeeHistory, FeeValues, GasAndCollateral } from './fee.js'
import type { LogFilter } from './filter.js'
import type { Log } from './log.js'
import type { NodeState } from './node.js'
import type {
  PoSAccount,
  PoSBlock,
  PoSCommittee,
  PoSRewards,
  PoSStatus,
  PoSTransaction,
} from './pos.js'
import type { Reward } from './reward.js'
import type { Sponsor } from './sponsor.js'
import type { Supply } from './supply.js'
import type { Trace, TraceBlock } from './tract.js'
import type {
  TransactionEIP1559,
  TransactionEIP2930,
  TransactionLegacy,
  TransactionReceipt,
  TransactionRequestEIP1559,
  TransactionRequestEIP2930,
  TransactionRequestLegacy,
  TransactionType,
} from './transaction.js'
import type { OneOf, UnionOmit } from './utils.js'
import type { Vote } from './vote.js'
import type { Hex } from './misc.js'
import type { Address } from '../accounts/types.js'

export type { Quantity }
export type OutcomeStatus = '0x0' | '0x1' | '0x2'
export type RpcTransaction<TPending extends boolean = boolean> = UnionOmit<
  OneOf<
    | TransactionLegacy<Quantity, Index, TPending, '0x0'>
    | TransactionEIP2930<Quantity, Index, TPending, '0x1'>
    | TransactionEIP1559<Quantity, Index, TPending, '0x2'>
  >,
  // `yParity` is optional on the RPC type as some nodes do not return it
  // for 1559 & 2930 transactions (they should!).
  'yParity'
>

export type RpcBlock<
  TBlockTag extends EpochTag = EpochTag,
  TIncludeTransactions extends boolean = boolean,
  TTransaction = RpcTransaction<
    TBlockTag extends 'latest_mined' ? true : false
  >,
> = Block<Quantity, TIncludeTransactions, TBlockTag, TTransaction>

export type RpcEpochNumber = EpochNumber<Quantity>

export type RpcSponsor = Sponsor<Quantity>

export type RpcTransactionRequest = OneOf<
  | TransactionRequestLegacy<Quantity, Index, '0x0'>
  | TransactionRequestEIP2930<Quantity, Index, '0x1'>
  | TransactionRequestEIP1559<Quantity, Index, '0x2'>
>

export type RpcFeeValue = FeeValues<Quantity>
export type RpcGasAndCollateral = GasAndCollateral<Quantity>
export type RpcFeeHistory = FeeHistory<Quantity>

export type RpcLog = Log<Quantity, Index>

export type RpcTransactionReceipt = TransactionReceipt<
  Quantity,
  Index,
  OutcomeStatus,
  TransactionType
>

export type RpcChainAccount = ChainAccount<Quantity>

export type RpcNodeState = NodeState<Quantity, Index>

export type RpcReward = Reward<Quantity, Index>

export type RpcDeposit = Deposit<Quantity, Index>

export type RpcVote = Vote<Quantity, Index>

export type RpcSupply = Supply<Quantity>

export type RpcAccountPending = AccountPending<Quantity>

export type RpcAccountPendingTransaction = AccountPendingTransaction<
  Quantity,
  RpcTransaction
>

export type RpcLogFilter = LogFilter<Quantity>

export type RpcPoSStatus = PoSStatus<Quantity>

export type RpcPoSAccount = PoSAccount<Quantity>

export type RpcPoSCommittee = PoSCommittee<Quantity>

export type RpcPoSBlock = PoSBlock<Quantity>

export type RpcPoSRewards = PoSRewards<Quantity>

export type RpcPoSTransaction = PoSTransaction<Quantity>

export type RpcTraceBlock = TraceBlock<Quantity>

export type RpcTrace = Trace<Quantity>

type SuccessResult<result> = {
  method?: undefined
  result: result
  error?: undefined
}
type ErrorResult<error> = {
  method?: undefined
  result?: undefined
  error: error
}
type Subscription<result, error> = {
  method: 'eth_subscription'
  error?: undefined
  result?: undefined
  params:
    | {
        subscription: string
        result: result
        error?: undefined
      }
    | {
        subscription: string
        result?: undefined
        error: error
      }
}

export type RpcRequest = {
  jsonrpc?: '2.0' | undefined
  method: string
  params?: any | undefined
  id?: number | undefined
}

export type RpcResponse<result = any, error = any> = {
  jsonrpc: `${number}`
  id: number
} & (SuccessResult<result> | ErrorResult<error> | Subscription<result, error>)

/** A key-value mapping of slot and storage values (supposedly 32 bytes each) */
export type RpcStateMapping = {
  [slots: Hex]: Hex
}

export type RpcAccountStateOverride = {
  /** Fake balance to set for the account before executing the call. <32 bytes */
  balance?: Hex | undefined
  /** Fake nonce to set for the account before executing the call. <8 bytes */
  nonce?: Hex | undefined
  /** Fake EVM bytecode to inject into the account before executing the call. */
  code?: Hex | undefined
  /** Fake key-value mapping to override all slots in the account storage before executing the call. */
  state?: RpcStateMapping | undefined
  /** Fake key-value mapping to override individual slots in the account storage before executing the call. */
  stateDiff?: RpcStateMapping | undefined
}

export type RpcStateOverride = {
  [address: Address]: RpcAccountStateOverride
}
