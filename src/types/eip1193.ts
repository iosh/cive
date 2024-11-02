import type {
  Quantity,
  RpcAccountPending,
  RpcAccountPendingTransaction,
  RpcBlock,
  RpcChainAccount,
  RpcDeposit,
  RpcFeeHistory,
  RpcGasAndCollateral,
  RpcLog,
  RpcLogFilter,
  RpcNodeState,
  RpcPoSAccount,
  RpcPoSBlock,
  RpcPoSCommittee,
  RpcPoSRewards,
  RpcPoSStatus,
  RpcPoSTransaction,
  RpcReward,
  RpcSponsor,
  RpcSupply,
  RpcTrace,
  RpcTraceBlock,
  RpcTransactionReceipt,
  RpcTransactionRequest,
  RpcVote,
} from './rpc.js'

import type { Address, HexAddress } from '../accounts/types.js'
import type { Block, EpochTag } from './block.js'
import type { Hash, Hex } from './misc.js'
import type { PhaseNameType } from './phase.js'
import type { RpcEpochNumber, RpcTransaction as Transaction } from './rpc.js'
import type { ExactPartial, Prettify } from './utils.js'

export type EIP1474Methods = [...PublicRpcSchema, ...WalletRpcSchema]

//////////////////////////////////////////////////
// Errors

export type ProviderRpcErrorType = ProviderRpcError & {
  name: 'ProviderRpcError'
}
export class ProviderRpcError extends Error {
  code: number
  details: string

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.details = message
  }
}

//////////////////////////////////////////////////
// Provider Events

export type ProviderConnectInfo = {
  chainId: string
}

export type ProviderMessage = {
  type: string
  data: unknown
}

export type EIP1193EventMap = {
  accountsChanged(accounts: Address[]): void
  chainChanged(chainId: string): void
  connect(connectInfo: ProviderConnectInfo): void
  disconnect(error: ProviderRpcError): void
  message(message: ProviderMessage): void
}

export type EIP1193Events = {
  on<event extends keyof EIP1193EventMap>(
    event: event,
    listener: EIP1193EventMap[event],
  ): void
  removeListener<event extends keyof EIP1193EventMap>(
    event: event,
    listener: EIP1193EventMap[event],
  ): void
}

export type EIP1193Provider = Prettify<
  EIP1193Events & {
    request: EIP1193RequestFn<EIP1474Methods>
  }
>

export type WalletPermissionCaveat = {
  type: string
  value: any
}

export type WalletPermission = {
  caveats: WalletPermissionCaveat[]
  date: number
  id: string
  invoker: `http://${string}` | `https://${string}`
  parentCapability: 'cfx_accounts' | string
}

export type PublicRpcSchema = [
  /**
   * @description Returns information about a transaction, identified by its hash.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#json-rpc-methods
   */
  {
    Method: 'cfx_getTransactionByHash'
    Parameters: [hash: Hash]
    ReturnType: Transaction | null
  },
  /**
   * @description Returns information about a block, identified by its hash.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockbyhash
   */
  {
    Method: 'cfx_getBlockByHash'
    Parameters: [hash: Hash, includeTransactions?: boolean]
    ReturnType: Block | null
  },
  /**
   * @description Returns information about a block, identified by its epoch number.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockbyepochnumber
   */
  {
    Method: 'cfx_getBlockByEpochNumber'
    Parameters: [
      block: EpochTag | RpcEpochNumber,
      includeTransactions?: boolean,
    ]
    ReturnType: Block | null
  },
  /**
   * @description Returns the hash of the best block.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getbestblockhash
   */

  {
    Method: 'cfx_getBestBlockHash'
    Parameters: undefined
    ReturnType: Hash
  },
  /**
   * @description Returns the epoch number corresponding to the given tag.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_epochnumber
   */
  {
    Method: 'cfx_epochNumber'
    Parameters: [EpochTag]
    ReturnType: Quantity
  },
  /**
   * @description Returns the current price per gas in Drip.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_gasprice
   */
  {
    Method: 'cfx_gasPrice'
    Parameters: undefined
    ReturnType: Quantity
  },
  /**
   * @description Returns the current priority fee per gas in Drip.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_maxpriorityfeepergas
   */
  {
    Method: 'cfx_maxPriorityFeePerGas'
    Parameters: undefined
    ReturnType: Quantity
  },
  /**
   * @description Returns transaction base fee per gas and effective priority fee per gas for the requested/supported epoch range.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_feehistory
   */
  {
    Method: 'cfx_feeHistory'
    Parameters: [
      epochCount: Quantity,
      newestBlock:
        | RpcEpochNumber
        | Exclude<EpochTag, 'latest_finalized' | 'latest_mined'>,
      rewardPercentile: number[] | undefined,
    ]
    ReturnType: RpcFeeHistory
  },
  /**
   * @description Returns the block hashes in the specified epoch.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblocksbyepoch
   */
  {
    Method: 'cfx_getBlocksByEpoch'
    Parameters: [epoch: RpcEpochNumber | EpochTag]
    ReturnType: Hash[]
  },
  /**
   * @description Returns the balance of the given account, identified by its address.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getbalance
   */
  {
    Method: 'cfx_getBalance'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: Quantity
  },
  /**
   * @description Returns the stacking balance of the given account, identified by its address.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstakingbalance
   */
  {
    Method: 'cfx_getStakingBalance'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: Quantity
  },
  /**
   * @description Returns the size of the collateral storage of a given address, in bytes.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getcollateralforstorage
   */
  {
    Method: 'cfx_getCollateralForStorage'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: Quantity
  },
  /**
   * @description Returns the admin of the specified contract.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getadmin
   */
  {
    Method: 'cfx_getAdmin'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: Address | null
  },
  /**
   * @description Returns the code of the specified contract. If contract not exist will return 0x0
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getcode
   */
  {
    Method: 'cfx_getCode'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: Hex
  },
  /**
   * @description Returns storage entries from a given contract.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstorageat
   */
  {
    Method: 'cfx_getStorageAt'
    Parameters: [
      address: Address,
      storagePosition: Quantity,
      epoch: EpochTag | RpcEpochNumber,
    ]
    ReturnType: Hex | null
  },
  /**
   * @description Returns the storage root of a given contract.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstorageroot
   */
  {
    Method: 'cfx_getStorageRoot'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: {
      data: Hex | 'TOMBSTONE' | null
      intermediate: Hex | 'TOMBSTONE' | null
      snapshot: Hex | 'TOMBSTONE' | null
    }
  },
  /**
   * @description Returns the sponsor info of a given contract.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getsponsorinfo
   */
  {
    Method: 'cfx_getSponsorInfo'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: RpcSponsor
  },
  /**
   * @description Returns the next nonce that should be used by the given account when sending a transaction.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getnextnonce
   */
  {
    Method: 'cfx_getNextNonce'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: Quantity
  },
  /**
   * @description Virtually calls a contract, returns the output data. The transaction will not be added to the blockchain. The error message of cfx_call is similar to cfx_estimateGasAndCollateral and error solutions can be found in
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_call
   */
  {
    Method: 'cfx_call'
    Parameters:
      | [transaction: ExactPartial<RpcTransactionRequest>]
      | [
          transaction: ExactPartial<RpcTransactionRequest>,
          epoch: EpochTag | RpcEpochNumber,
        ]
    ReturnType: Hex
  },
  /**
   * @description Virtually executes a transaction, returns an estimate for the size of storage collateralized and the gas used by the transaction. The transaction will not be added to the blockchain.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_estimategasandcollateral
   */
  {
    Method: 'cfx_estimateGasAndCollateral'
    Parameters:
      | [transaction: ExactPartial<RpcTransactionRequest>]
      | [
          transaction: ExactPartial<RpcTransactionRequest>,
          epoch: EpochTag | RpcEpochNumber,
        ]
    ReturnType: RpcGasAndCollateral
  },
  /**
   * @description Returns logs matching the filter provided.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getlogs
   */
  {
    Method: 'cfx_getLogs'
    Parameters: [filter: ExactPartial<RpcLogFilter>]
    ReturnType: RpcLog[]
  },
  /**
   * @description Returns a transaction receipt, identified by the corresponding transaction hash.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_gettransactionreceipt
   */
  {
    Method: 'cfx_getTransactionReceipt'
    Parameters: [txHash: Hash]
    ReturnType: RpcTransactionReceipt | null
  },
  /**
   * @description Returns an account, identified by its address.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getaccount
   */
  {
    Method: 'cfx_getAccount'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: RpcChainAccount
  },
  /**
   * @description Returns the interest rate at the given epoch.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getinterestrate
   */
  {
    Method: 'cfx_getInterestRate'
    Parameters: [epoch: EpochTag | RpcEpochNumber]
    ReturnType: Quantity
  },
  /**
   * @description Returns the accumulate interest rate at the given epoch.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getaccumulateinterestrate
   */
  {
    Method: 'cfx_getAccumulateInterestRate'
    Parameters: [epoch: EpochTag | RpcEpochNumber]
    ReturnType: Quantity
  },
  /**
   * @description Check if a user's balance is enough to send a transaction with the specified gas and storage limits to the specified contract. The balance is enough if the user can cover the up-front payment of both execution and storage, or if these costs are sponsored by the contract.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_checkbalanceagainsttransaction
   */
  {
    Method: 'cfx_checkBalanceAgainstTransaction'
    Parameters: [
      address: Address,
      address: Address,
      gasLimit: Quantity,
      gasPrice: Quantity,
      storageLimit: Quantity,
      epoch: EpochTag | RpcEpochNumber,
    ]
    ReturnType: {
      isBalanceEnough: boolean
      willPayCollateral: boolean
      willPayTxFee: boolean
    }
  },
  /**
   * @description Returns the list of non-executed blocks in an epoch. By default, Conflux only executes the last 200 blocks in each epoch (note that under normal circumstances, epochs should be much smaller).
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getskippedblocksbyepoch
   */
  {
    Method: 'cfx_getSkippedBlocksByEpoch'
    Parameters: [epoch: EpochTag | RpcEpochNumber]
    ReturnType: RpcBlock[]
  },
  /**
   * @description Returns the confirmation risk of a given block, identified by its hash.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getconfirmationriskbyhash
   */
  {
    Method: 'cfx_getConfirmationRiskByHash'
    Parameters: [blockHash: Hash]
    ReturnType: Quantity | null
  },
  /**
   * @description Returns the node status.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstatus
   */
  {
    Method: 'cfx_getStatus'
    Parameters: undefined
    ReturnType: RpcNodeState
  },
  /**
   * @description Returns the conflux-rust version.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_clientversion
   */
  {
    Method: 'cfx_clientVersion'
    Parameters: undefined
    ReturnType: string
  },
  /**
   * @description Returns the reward info for all executed blocks in the specified epoch.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockrewardinfo
   */
  {
    Method: 'cfx_getBlockRewardInfo'
    Parameters: [epoch: EpochTag | RpcEpochNumber]
    ReturnType: RpcReward[]
  },
  /**
   * @description Returns the requested block if the provided pivot hash is correct, returns an error otherwise.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockbyhashwithpivotassumption
   */
  {
    Method: 'cfx_getBlockByHashWithPivotAssumption'
    Parameters: [
      blockHash: Hash,
      pivotBlockHash: Hash,
      epochNumber: RpcEpochNumber,
    ]
    ReturnType: RpcBlock
  },
  /**
   * @description Returns the deposit list of the given account, identified by its address.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getdepositlist
   */
  {
    Method: 'cfx_getDepositList'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: RpcDeposit[]
  },
  /**
   * @description Returns the vote list of the given account, identified by its address.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getvotelist
   */
  {
    Method: 'cfx_getVoteList'
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber]
    ReturnType: RpcVote[]
  },
  /**
   * @description Returns summary supply info of the entire chain.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getsupplyinfo
   */
  {
    Method: 'cfx_getSupplyInfo'
    Parameters: undefined
    ReturnType: RpcSupply
  },
  /**
   * @description Returns transaction pool pending info of one account
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getaccountpendinginfo
   */
  {
    Method: 'cfx_getAccountPendingInfo'
    Parameters: [address: Address]
    ReturnType: RpcAccountPending
  },
  /**
   * @description Returns pending transactions in pool of one account
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getaccountpendingtransactions
   */

  {
    Method: 'cfx_getAccountPendingTransactions'
    Parameters: [
      address: Address,
      nonce?: Quantity | undefined,
      limit?: Quantity | undefined,
    ]
    ReturnType: RpcAccountPendingTransaction
  },
  /**
   * @description Returns information about a block, identified by its block number (block's tree-graph order number).
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockbyblocknumber
   */
  {
    Method: 'cfx_getBlockByBlockNumber'
    Parameters: [blockNumber: Quantity, includeTransactions: boolean]
    ReturnType: RpcBlock
  },
  /**
   * @description Returns PoS economics summary info.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getposeconomics
   */
  {
    Method: 'cfx_getPoSEconomics'
    Parameters: [epoch: EpochTag | RpcEpochNumber]
    ReturnType: {
      distributablePosInterest: Quantity
      lastDistributeBlock: Quantity
      totalPosStakingTokens: Quantity
    }
  },
  /**
   * @description Get rewards information of a PoS epoch by it's correspond PoW epoch number. Only PoW epoch happen's at PoS epoch end will have rewards information. Others will return null.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getposrewardbyepoch
   */
  {
    Method: 'cfx_getPoSRewardByEpoch'
    Parameters: [epochNumber: RpcEpochNumber]
    ReturnType: {
      accountRewards: {
        posAddress: Address
        powAddress: Address
        reward: Quantity
      }[]
      powEpochHash: Hash
    } | null
  },
  /**
   * @description Returns DAO vote params info
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getparamsfromvote
   */
  {
    Method: 'cfx_getParamsFromVote'
    Parameters: [epoch: EpochTag | RpcEpochNumber]
    ReturnType: {
      powBaseReward: Quantity
      interestRate: Quantity
      storagePointProp: Quantity
      baseFeeShareProp: Quantity
    }
  },
  /**
   *@description This function creates a log filter for tracking usage. It returns a log filter ID, which can be employed through the cfx_getFilterChanges command to retrieve logs newly generated from recently executed transactions. The from* field in this context will be disregarded by this RPC (Remote Procedure Call). This function can also be used via cfx_getFilterLogs to retrieve all logs that match the filter criteria. In this instance, the from* fields are considered.
   *@link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_newfilter
   */
  {
    Method: 'cfx_newFilter'
    Parameters: [filter: ExactPartial<RpcLogFilter>]
    ReturnType: Quantity
  },
  /**
   * @description Create a block filter for following up usage. Returns the block filter id which can be used via cfx_getFilterChanges to retrieve latest executed blocks.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_newblockfilter
   */
  {
    Method: 'cfx_newBlockFilter'
    Parameters: undefined
    ReturnType: Quantity
  },
  /**
   * @description Create a pending transaction filter for following up usage. Returns the transaction filter id which can be used via cfx_getFilterChanges to retrieve ready but not executed transactions.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_newpendingtransactionfilter
   */
  {
    Method: 'cfx_newPendingTransactionFilter'
    Parameters: undefined
    ReturnType: Quantity
  },
  /**
   * @description Get filter changes since last retrieve. Return value depends on which type of filter id is provided. Filter id can be returned from current RPCs:
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getfilterchanges
   */

  {
    Method: 'cfx_getFilterChanges'
    Parameters: [filterId: Quantity]
    ReturnType: RpcLog[] | Hex[]
  },
  /**
   * @description Returns all logs matching the log filter (Unlike cfx_getFilterChanges, from* fields still work).
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getfilterlogs
   */
  {
    Method: 'cfx_getFilterLogs'
    Parameters: [filterId: Quantity]
    ReturnType: RpcLog[]
  },
  /**
   * @description Uninstall the specified filter. Returns a bool whether the uninstallation succeeds.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_uninstallfilter
   */
  {
    Method: 'cfx_uninstallFilter'
    Parameters: [filterId: Quantity]
    ReturnType: boolean
  },
  /**
   * @description Returns current chain collateral status info.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getcollateralinfo
   */
  {
    Method: 'cfx_getCollateralInfo'
    Parameters: [epoch: RpcEpochNumber | EpochTag]
    ReturnType: {
      totalStorageTokens: Quantity
      convertedStoragePoints: Quantity
      usedStoragePoints: Quantity
    }
  },
  /**
   * @description  Return one address's next usable nonce in transaction pool.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/txpool_rpc#rpcs
   */
  {
    Method: 'txpool_nextNonce'
    Parameters: [address: Address]
    ReturnType: Quantity
  },
  /**
   * @description Returns the current status of the PoS chain.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getstatus
   */
  {
    Method: 'pos_getStatus'
    Parameters: undefined
    ReturnType: RpcPoSStatus
  },
  /**
   * @description Get the PoS account information
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getaccount
   */
  {
    Method: 'pos_getAccount'
    Parameters: [address: HexAddress, blockNumber?: Quantity | undefined]
    ReturnType: RpcPoSAccount
  },
  /**
   * @description Get the current PoS committee information in default. It is also able to get the committee information for a block in history by specifying the blockNumber.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getcommittee
   */
  {
    Method: 'pos_getCommittee'
    Parameters: [blockNumber?: Quantity]
    ReturnType: RpcPoSCommittee
  },
  /**
   * @description Get block information by its hash value
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getblockbyhash
   */
  {
    Method: 'pos_getBlockByHash'
    Parameters: [blockHash: Hash]
    ReturnType: RpcPoSBlock | null
  },
  /**
   * @description Get block information by its block number
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getblockbynumber
   */
  {
    Method: 'pos_getBlockByNumber'
    Parameters: [blockNumber: Quantity | 'latest_committed' | 'latest_voted']
    ReturnType: RpcPoSBlock | null
  },
  /**
   * @description returns the rewards information of a PoS epoch
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getrewardsbyepoch
   */
  {
    Method: 'pos_getRewardsByEpoch'
    Parameters: [epoch: Quantity]
    ReturnType: RpcPoSRewards | null
  },
  /**
   * @description Get the transaction information by transaction number
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_gettransactionbynumber
   */
  {
    Method: 'pos_getTransactionByNumber'
    Parameters: [epoch: Quantity]
    ReturnType: RpcPoSTransaction | null
  },
  /**
   * @description Get one epoch's all receipts in one RPC call
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/debug_rpc#cfx_getepochreceipts
   */
  {
    Method: 'cfx_getEpochReceipts'
    Parameters: [epoch: Quantity | EpochTag, includeTxReceipts?: boolean]
    ReturnType: RpcTransactionReceipt[][]
  },
  /**
   * @description Get block traces by block hash
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/trace_rpc#trace_block
   */
  {
    Method: 'trace_block'
    Parameters: [blockHash: Hash]
    ReturnType: RpcTraceBlock
  },
  /**
   * @description Get transaction's trace by it's hash
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/trace_rpc#trace_transaction
   */
  {
    Method: 'trace_transaction'
    Parameters: [txHash: Hash]
    ReturnType: RpcTrace
  },
  {
    Method: 'cfx_chainId'
    Parameters?: undefined
    ReturnType: Quantity
  },
  /**
   * @description  Get the total burnt tx gas fee by 1559. Added in Conflux-Rust v2.4.0.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getfeeburnt
   */
  {
    Method: 'cfx_getFeeBurnt'
    Parameters?: undefined
    ReturnType: Quantity
  },
]

export type WalletRpcSchema = [
  /**
   * @description Sends a signed transaction into the network for processing.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_sendrawtransaction
   */

  {
    Method: 'cfx_sendRawTransaction'
    Parameters: [signedTransaction: Hex]
    ReturnType: Hash
  },
  {
    Method: 'cfx_accounts'
    Parameters?: undefined
    ReturnType: Address[]
  },
  {
    Method: 'cfx_chainId'
    Parameters?: undefined
    ReturnType: Quantity
  },
  {
    Method: 'cfx_requestAccounts'
    Parameters?: undefined
    ReturnType: Address[]
  },
  {
    Method: 'wallet_requestPermissions'
    Parameters: [permissions: { cfx_accounts: Record<string, any> }]
    ReturnType: WalletPermission[]
  },
  {
    Method: 'cfx_sendTransaction'
    Parameters: [transaction: RpcTransactionRequest]
    ReturnType: Hash
  },
  {
    Method: 'personal_sign'
    Parameters: [
      /** Data to sign */
      data: Hex,
      /** Address to use for signing */
      address: Address,
    ]
    ReturnType: Hex
  },
  {
    Method: 'cfx_signTransaction'
    Parameters: [request: RpcTransactionRequest]
    ReturnType: Hex
  },
  {
    Method: 'cfx_signTypedData_v4'
    Parameters: [
      /** Address to use for signing */
      address: Address,
      /** Message to sign containing type information, a domain separator, and data */
      message: string,
    ]
    ReturnType: Hex
  },
  {
    Method: 'wallet_switchConfluxChain'
    Parameters: [chain: { chainId: string }]
    ReturnType: null
  },
]

export type TestRpcSchema = [
  {
    Method: 'txpool_clear'
    Parameters: undefined
    ReturnType: undefined
  },
  /**
   * @description Returns the list of addresses in the local node.
   */
  {
    Method: 'accounts'
    Parameters: undefined
    ReturnType: Address[]
  },
  /**
   * @description Creates a new account in the local node.
   */
  {
    Method: 'new_account'
    Parameters: [password: string]
    ReturnType: Address
  },
  /**
   * @description Unlocks an account in the local node.
   */
  {
    Method: 'unlock_account'
    Parameters: [address: Address, password: string, duration?: Quantity]
    ReturnType: boolean
  },
  /**
   * @description Locks an account in the local node.
   */
  {
    Method: 'lock_account'
    Parameters: [address: Address]
    ReturnType: boolean
  },
  {
    Method: 'generateoneblock'
    Parameters: [numTxs: number, blockSizeLimit: number]
    ReturnType: Hash
  },
  {
    Method: 'sayhello'
    Parameters: undefined
    ReturnType: string
  },
  {
    Method: 'generate_empty_blocks'
    Parameters: [numBlocks: number]
    ReturnType: Hash[]
  },
  {
    Method: 'current_sync_phase'
    Parameters: undefined
    ReturnType: PhaseNameType
  },
]

export type RpcSchema = readonly {
  Method: string
  Parameters?: unknown | undefined
  ReturnType: unknown
}[]

export type RpcSchemaOverride = Omit<RpcSchema[number], 'Method'>

export type EIP1193Parameters<
  rpcSchema extends RpcSchema | undefined = undefined,
> = rpcSchema extends RpcSchema
  ? {
      [K in keyof rpcSchema]: Prettify<
        {
          method: rpcSchema[K] extends rpcSchema[number]
            ? rpcSchema[K]['Method']
            : never
        } & (rpcSchema[K] extends rpcSchema[number]
          ? rpcSchema[K]['Parameters'] extends undefined
            ? { params?: undefined }
            : { params: rpcSchema[K]['Parameters'] }
          : never)
      >
    }[number]
  : {
      method: string
      params?: unknown | undefined
    }

export type EIP1193RequestOptions = {
  // Deduplicate in-flight requests.
  dedupe?: boolean | undefined
  // The base delay (in ms) between retries.
  retryDelay?: number | undefined
  // The max number of times to retry.
  retryCount?: number | undefined
  /** Unique identifier for the request. */
  uid?: string | undefined
}

type DerivedRpcSchema<
  rpcSchema extends RpcSchema | undefined,
  rpcSchemaOverride extends RpcSchemaOverride | undefined,
> = rpcSchemaOverride extends RpcSchemaOverride
  ? [rpcSchemaOverride & { Method: string }]
  : rpcSchema

export type EIP1193RequestFn<
  rpcSchema extends RpcSchema | undefined = undefined,
> = <
  rpcSchemaOverride extends RpcSchemaOverride | undefined = undefined,
  _parameters extends EIP1193Parameters<
    DerivedRpcSchema<rpcSchema, rpcSchemaOverride>
  > = EIP1193Parameters<DerivedRpcSchema<rpcSchema, rpcSchemaOverride>>,
  _returnType = DerivedRpcSchema<rpcSchema, rpcSchemaOverride> extends RpcSchema
    ? Extract<
        DerivedRpcSchema<rpcSchema, rpcSchemaOverride>[number],
        { Method: _parameters['method'] }
      >['ReturnType']
    : unknown,
>(
  args: _parameters,
  options?: EIP1193RequestOptions | undefined,
) => Promise<_returnType>
