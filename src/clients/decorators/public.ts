import type {
  Transport,
  Chain,
  MaybeAbiEventName,
  MaybeExtractEventArgsFromAbi,
  GetProofReturnType,
} from "viem";
import type { Address, Account } from "../../accounts/types.js";
import type { Client } from "../createClient.js";
import {
  getTransaction,
  type GetTransactionReturnType,
  type GetTransactionParameters,
} from "../../actions/public/getTransaction.js";
import type { EpochNumber, EpochTag } from "../../types/block.js";
import {
  getBlock,
  type GetBlockParameters,
  type GetBlockReturnType,
} from "../../actions/public/getBlock.js";
import {
  getEpochNumber,
  type GetEpochNumberParameters,
  type GetEpochNumberReturnType,
} from "../../actions/public/getEpochNumber.js";
import {
  getGasPrice,
  type GetGasPriceReturnType,
} from "../../actions/public/getGasPrice.js";
import {
  getBastBlockHash,
  type GetBastBlockHashReturn,
} from "../../actions/public/getBastBlockHash.js";
import {
  getBlocksByEpoch,
  type GetBlocksByEpochParameters,
  type GetBlocksByEpochReturnType,
} from "../../actions/public/getBlocksByEpoch.js";
import {
  getBalance,
  type GetBalanceParameters,
  type GetBalanceReturnType,
} from "../../actions/public/getBalance.js";
import {
  getStakingBalance,
  type GetStakingBalanceParameters,
  type GetStakingBalanceReturnType,
} from "../../actions/public/getStakingBalance.js";
import {
  getCollateralForStorage,
  type GetCollateralForStorageParameters,
  type GetCollateralForStorageReturnType,
} from "../../actions/public/getCollaterlForStorage.js";
import {
  getAdmin,
  type GetAdminParameters,
  type GetAdminReturnType,
} from "../../actions/public/getAdmin.js";
import {
  getBytecode,
  type GetBytecodeParameters,
  type GetBytecodeReturnType,
} from "../../actions/public/getBytecode.js";
import {
  GetStorageAt,
  type GetStorageAtParameters,
  type GetStorageAtReturnType,
} from "../../actions/public/getStorageAt.js";
import {
  GetStorageRoot,
  type GetStorageRootParameters,
  type GetStorageRootReturnType,
} from "../../actions/public/getStorageRoot.js";
import {
  GetSponsorInfo,
  type GetSponsorInfoParameters,
  type GetSponsorInfoReturnType,
} from "../../actions/public/getSponsorInfo.js";
import {
  getNextNonce,
  type GetNextNonceParameters,
  type GetNextNonceReturnType,
} from "../../actions/public/getNextNonce.js";
import {
  getTransactionReceipt,
  type GetTransactionReceiptParameters,
  type GetTransactionReceiptReturnType,
} from "../../actions/public/getTransactionReceipt.js";
import {
  getAccount,
  type GetChainAccountParameters,
  type GetChainAccountReturnType,
} from "../../actions/public/getAccount.js";
import {
  getInterestRate,
  type GetInterestRateParameters,
  type GetInterestRateReturnType,
} from "../../actions/public/getInterestRate.js";
import {
  getAccumulateInterestRate,
  type GetAccumulateInterestRateParameters,
  type GetAccumulateInterestRateReturnType,
} from "../../actions/public/getAccumulateInterestRate.js";
import {
  checkBalanceAgainstTransaction,
  type CheckBalanceAgainstTransactionParameters,
  type CheckBalanceAgainstTransactionReturnType,
} from "../../actions/public/checkBalanceAgainstTransaction.js";
import {
  getSkippedBlocksByEpoch,
  type GetSkippedBlocksByEpochParameters,
  type GetSkippedBlocksByEpochReturnType,
} from "../../actions/public/getSkippedBlocksByEpoch.js";
import {
  getConfirmationRiskByHash,
  type GetConfirmationRiskByHashParameters,
  type GetConfirmationRiskByHashReturnType,
} from "../../actions/public/getConfirmationRiskByHash.js";
import {
  getStatus,
  type GetStatusReturnType,
} from "../../actions/public/getStatus.js";
import {
  clientVersion,
  type ClientVersionReturnType,
} from "../../actions/public/clientVersion.js";
import {
  getBlockRewardInfo,
  type GetBlockRewardInfoParameters,
  type GetBlockRewardInfoReturnType,
} from "../../actions/public/getBlockRewardInfo.js";
import {
  getBlockByHashWithPivotAssumption,
  type GetBlockByHashWithPivotAssumptionParameters,
  type GetBlockByHashWithPivotAssumptionReturnType,
} from "../../actions/public/getBlockByHashWithPivotAssumption.js";
import {
  getDepositList,
  type GetDepositListParameters,
  type GetDepositListReturnType,
} from "../../actions/public/getDepositList.js";
import {
  getVoteList,
  type GetVoteListParameters,
  type GetVoteListReturnType,
} from "../../actions/public/getVoteList.js";
import {
  getSupplyInfo,
  type GetSupplyInfoReturnType,
} from "../../actions/public/getSupplyInfo.js";
import {
  getAccountPendingInfo,
  type GetAccountPendingInfoParameters,
  type GetAccountPendingInfoReturnType,
} from "../../actions/public/getAccountPendingInfo.js";
import {
  getAccountPendingTransactions,
  type GetAccountPendingTransactionsParameters,
  type GetAccountPendingTransactionsReturnType,
} from "../../actions/public/getAccountPendingTransactions.js";
import {
  getPoSEconomics,
  type GetPoSEconomicsParameters,
  type GetPoSEconomicsReturnType,
} from "../../actions/public/getPoSEconomics.js";
import {
  getPoSRewardByEpoch,
  type GetPoSRewardByEpochParameters,
  type GetPoSRewardByEpochReturnType,
} from "../../actions/public/getPoSRewardByEpoch.js";
import {
  getParamsFromVote,
  type GetParamsFormVoteParameters,
  type GetParamsFormVoteReturnType,
} from "../../actions/public/getParamsFromVote.js";
import {
  CallParameters,
  CallReturnType,
  call,
} from "../../actions/public/call.js";
import {
  EstimateGasAndCollateralParameters,
  EstimateGasAndCollateralReturnType,
  estimateGasAndCollateral,
} from "../../actions/public/estimateGasAndCollateral.js";
import {
  GetLogsParameters,
  GetLogsReturnType,
  getLogs,
} from "../../actions/public/getLogs.js";
import {
  CreateBlockFilterReturnType,
  createBlockFilter,
} from "../../actions/public/createBlockFilter.js";
import {
  CreateEventFilterParameters,
  CreateEventFilterReturnType,
  createEventFilter,
} from "../../actions/public/createEventFilter.js";
import { AbiEvent } from "abitype";
import {
  CreatePendingTransactionFilterReturnType,
  createPendingTransactionFilter,
} from "../../actions/public/createPendingTransactionFilter.js";
import {
  GetFilterChangesParameters,
  GetFilterChangesReturnType,
  getFilterChanges,
} from "../../actions/public/getFilterChanges.js";
import {
  GetFilterLogsParameters,
  GetFilterLogsReturnType,
  getFilterLogs,
} from "../../actions/public/getFilterLogs.js";
import {
  UninstallFilterParameters,
  UninstallFilterReturnType,
  uninstallFilter,
} from "../../actions/public/uninstallFilter.js";
import {
  GetCollateralInfoParameters,
  GetCollateralInfoReturnType,
  getCollateralInfo,
} from "../../actions/public/getCollateralInfo.js";
import {
  TxPoolNextNonceParameters,
  TxPoolNextNonceReturnType,
  txPoolNextNonce,
} from "../../actions/public/txPoolNextNonce.js";
import {
  GetPoSStatusReturnType,
  getPoSStatus,
} from "../../actions/public/getPoSStatus.js";
import {
  GetPoSAccountParameters,
  GetPoSAccountReturnType,
  getPoSAccount,
} from "../../actions/public/getPoSAccount..js";
import {
  GetPosCommitteeParameters,
  GetPosCommitteeReturnType,
  getPosCommittee,
} from "../../actions/public/getPoSCommittee.js";
import {
  GetPoSBlockParameters,
  GetPosBlockReturnType,
  getPoSBlock,
} from "../../actions/public/getPoSBlock.js";

export type PublicActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined
> = {
  /**
   * Returns information about a transaction, identified by its hash.
   * - Docs: https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_gettransactionbyhash
   * @param args {@link GetTransactionParameters}
   * @returns {@link GetTransactionReturnType}
   */
  getTransaction: (
    args: GetTransactionParameters
  ) => Promise<GetTransactionReturnType<TChain>>;

  /**
   * Returns information about a block, identified by its hash or number or tag
   * - JSON-RPC Methods:
   *  - Calls [`cfx_getblockbyhash`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockbyhash)
   *  - Calls [`cfx_getBlockByEpochNumber`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockbyepochnumber)
   *  - Calls [`cfx_getBlockByBlockNumber`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockbyblocknumber)
   *  @param args {@link GetBlockParameters}
   * @returns {@link GetBlockReturnType}
   */
  getBlock: <
    TIncludeTransactions extends boolean = false,
    TEpochTag extends EpochTag = "latest_state"
  >(
    args?: GetBlockParameters<TIncludeTransactions, TEpochTag>
  ) => Promise<GetBlockReturnType<TChain, TIncludeTransactions, TEpochTag>>;

  /**
   * Returns the hash of the best block.
   * - JSON-RPC Methods: [`cfx_getbestblockhash`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getbestblockhash)
   * @returns hash of the best block. {@link GetBastBlockHashReturn}
   */
  getBastBlockHash: () => Promise<GetBastBlockHashReturn>;
  /**
   * Returns the epoch number corresponding to the given tag.
   * - JSON-RPC Methods: [`cfx_epochNumber`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_epochnumber)
   * @param args  {@link GetEpochNumberParameters}
   * @returns {@link GetEpochNumberReturnType}
   */
  getEpochNumber: (
    args?: GetEpochNumberParameters
  ) => Promise<GetEpochNumberReturnType>;
  /**
   * Returns the current price per gas in Drip.
   * - JSON-RPC Method: [`cfx_gasprice`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_gasprice)
   * @returns  integer of the current gas price in Drip. {@link GetGasPriceReturnType}
   */
  getGasPrice: () => Promise<GetGasPriceReturnType>;

  /**
   * Returns the block hashes in the specified epoch.
   * - JSON-RPC Methods: [`cfx_getBlocksByEpoch`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblocksbyepoch)
   * @param args - {@link GetBlocksByEpochParameters}
   * @returns - {@link GetBlocksByEpochReturnType}
   */
  getBlocksByEpoch: (
    args: GetBlocksByEpochParameters
  ) => Promise<GetBlocksByEpochReturnType>;

  /**
   * Returns the balance of the given account, identified by its address.
   * - JSON-RPC Methods: [`cfx_getbalance`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getbalance)
   * @param args - {@link GetBalanceParameters}
   * @returns   integer of the current balance in Drip. {@link GetBalanceReturnType}
   */

  getBalance: (args: GetBalanceParameters) => Promise<GetBalanceReturnType>;

  /**
   * Returns the stacking balance of the given account, identified by its address.
   * -JSON-RPC Methods: [`cfx_getStakingBalance`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstakingbalance)
   * @param args - {@link GetStakingBalanceParameters}
   * @returns Returns the stacking balance of the given account, identified by its address. {@link GetStakingBalanceReturnType}
   */
  getStakingBalance: (
    args: GetStakingBalanceParameters
  ) => Promise<GetStakingBalanceReturnType>;

  /**
   * Returns the size of the collateral storage of a given address, in bytes.
   * - JSON-RPC Methods: [`cfx_getCollateralForStorage`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getcollateralforstorage)
   * @param args - {@link GetCollateralForStorageParameters}
   * @returns -integer of the collateral storage in Byte. {@link GetCollateralForStorageReturnType}
   */
  getCollateralForStorage: (
    args: GetCollateralForStorageParameters
  ) => Promise<GetCollateralForStorageReturnType>;

  /**
   * Returns the admin of the specified contract.
   * - JSON-RPC Methods: [`cfx_getAdmin`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getadmin)
   * @param args - {@link GetAdminParameters}
   * @returns -address of admin, or null if the contract does not exist. {@link GetAdminReturnType}
   */
  getAdmin: (args: GetAdminParameters) => Promise<GetAdminReturnType>;

  /**
   * Returns the code of the specified contract. If contract not exist will return 0x
   * - JSON-RPC Methods: [`cfx_getCode`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getcode)
   * @param args - {@link GetBytecodeParameters}
   * @returns byte code of the contract, or 0x if the account has no code. {@link GetBytecodeReturnType}
   */
  getBytecode: (args: GetBytecodeParameters) => Promise<GetBytecodeReturnType>;

  /**
   * Returns storage entries from a given contract.
   * - JSON-RPC Methods: [`cfx_getStorageAt`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstorageat)
   * @param args - {@link GetStorageAtParameters}
   * @returns the contents of the storage position, or null if the contract does not exist. {@link GetStorageAtReturnType}
   */

  getStorageAt: (
    args: GetStorageAtParameters
  ) => Promise<GetStorageAtReturnType>;

  /**
   * Returns the storage root of a given contract.
   * - JSON-RPC Methods: [`cfx_getStorageRoot`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstorageroot)
   * @param args - {@link GetStorageRootParameters}
   * @returns - {@link GetStorageRootReturnType}
   */
  getStorageRoot: (
    args: GetStorageRootParameters
  ) => Promise<GetStorageRootReturnType>;

  /**
   * Returns the sponsor info of a given contract.
   * - JSON-RPC Method: [`cfx_getSponsorInfo`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getsponsorinfo)
   * @param args - {@link GetSponsorInfoParameters}
   * @returns -A sponsor info object. If the contract doesn't have a sponsor, then all fields in the object returned will be 0 {@link GetSponsorInfoReturnType}
   */

  getSponsorInfo: (
    args: GetSponsorInfoParameters
  ) => Promise<GetSponsorInfoReturnType>;

  /**
   * Returns the next nonce that should be used by the given account when sending a transaction.
   * - JSON-RPC Method: [`cfx_getNextNonce`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getnextnonce)
   * @param args - {@link GetNextNonceParameters}
   * @returns - integer of the next nonce that should be used by the given address.
   */
  getNextNonce: (
    args: GetNextNonceParameters
  ) => Promise<GetNextNonceReturnType>;

  /**
   * Virtually calls a contract, returns the output data. The transaction will not be added to the blockchain. The error message of cfx_call is similar to cfx_estimateGasAndCollateral and error solutions can be found in cfx_estimateGasAndCollateral behaviour#errors.
   * @param args - {@link CallParameters}
   * @returns - {@link CallReturnType}
   */
  call: (args: CallParameters) => Promise<CallReturnType>;

  /**
   * Virtually executes a transaction, returns an estimate for the size of storage collateralized and the gas used by the transaction. The transaction will not be added to the blockchain.
   * - JSON-RPC Method: [`cfx_estimateGasAndCollateral`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_estimategasandcollateral)
   * @param args - {@link EstimateContractGasParameters}
   * @returns  an estimate result object {@link EstimateContractGasReturnType}
   */
  estimateGasAndCollateral: (
    args: EstimateGasAndCollateralParameters
  ) => Promise<EstimateGasAndCollateralReturnType>;
  /**
   * Returns logs matching the filter provided.
   * - JSON-RPC Method: [`cfx_getLogs`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getlogs)
   * @param args - {@link GetLogsParameters}
   * @returns - {@link GetLogsReturnType}
   */
  getLogs: (args: GetLogsParameters) => Promise<GetLogsReturnType>;
  /**
   * Returns a transaction receipt, identified by the corresponding transaction hash.
   * - JSON-RPC Method: [`cfx_getTransactionReceipt`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_gettransactionreceipt)
   * @param args - {@link GetTransactionReceiptParameters}
   * @returns a transaction receipt object, or null when no transaction was found or the transaction was not executed yet: {@link GetTransactionReceiptReturnType}
   */
  getTransactionReceipt: (
    args: GetTransactionReceiptParameters
  ) => Promise<GetTransactionReceiptReturnType>;

  /**
   * Returns an account, identified by its address.
   * - JSON-RPC Method: [`cfx_getAccount`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getaccount)
   * @param args - {@link GetChainAccountParameters}
   * @returns - the state of the given account:
   */
  getAccount: (
    args: GetChainAccountParameters
  ) => Promise<GetChainAccountReturnType>;
  /**
   * Returns the interest rate at the given epoch.
   * -JSON-RPC Method: [`cfx_getInterestRate`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getinterestrate)
   * @param args - {@link GetInterestRateParameters}
   * @returns  the interest rate at the given epoch. {@link GetInterestRateReturnType}
   */
  getInterestRate: (
    args: GetInterestRateParameters
  ) => Promise<GetInterestRateReturnType>;
  /**
   * Returns the accumulate interest rate at the given epoch.
   * - JSON-RPC Method: [`cfx_getAccumulateInterestRate`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getaccumulateinterestrate)
   * @param args - {@link GetAccumulateInterestRateParameters}
   * @returns the accumulate interest rate at the given epoch. {@link GetAccumulateInterestRateReturnType}
   */
  getAccumulateInterestRate: (
    args: GetAccumulateInterestRateParameters
  ) => Promise<GetAccumulateInterestRateReturnType>;

  /**
   * Check if a user's balance is enough to send a transaction with the specified gas and storage limits to the specified contract. The balance is enough if the user can cover the up-front payment of both execution and storage, or if these costs are sponsored by the contract.
   * -JSON-RPC Method: [`cfx_checkBalanceAgainstTransaction`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_checkbalanceagainsttransaction)
   * @param args - {@link CheckBalanceAgainstTransactionParameters}
   * @returns - {@link CheckBalanceAgainstTransactionReturnType}
   */
  checkBalanceAgainstTransaction: (
    args: CheckBalanceAgainstTransactionParameters
  ) => Promise<CheckBalanceAgainstTransactionReturnType>;

  /**
   * Returns the list of non-executed blocks in an epoch. By default, Conflux only executes the last 200 blocks in each epoch (note that under normal circumstances, epochs should be much smaller).
   * - JSON-RPC Method: [`cfx_getSkippedBlocksByEpoch`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getskippedblocksbyepoch)
   * @param args - {@link GetSkippedBlocksByEpochParameters}
   * @returns Array of block hashes {@link GetSkippedBlocksByEpochReturnType}
   */
  getSkippedBlocksByEpoch: (
    args: GetSkippedBlocksByEpochParameters
  ) => Promise<GetSkippedBlocksByEpochReturnType>;

  /**
   * Returns the confirmation risk of a given block, identified by its hash.
   * - JSON-RPC Method: [`cfx_getConfirmationRiskByHash`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getconfirmationriskbyhash)
   * @param args - the block hash. {@link GetConfirmationRiskByHashParameters}
   * @returns  the integer confirmation risk, or undefined if the block does not exist. {@link GetConfirmationRiskByHashReturnType}
   */
  getConfirmationRiskByHash: (
    args: GetConfirmationRiskByHashParameters
  ) => Promise<GetConfirmationRiskByHashReturnType>;

  /**
   * Returns the node status.
   * - JSON-RPC Method: [`cfx_getStatus`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstatus)
   * @returns - {@link GetStatusReturnType}
   */
  getStatus: () => Promise<GetStatusReturnType>;

  /**
   * Returns the conflux-rust version.
   * - JSON-RPC Method: [`cfx_clientVersion`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_clientversion)
   * @returns - {@link ClientVersionReturnType}
   */
  clientVersion: () => Promise<ClientVersionReturnType>;

  /**
   * Returns the reward info for all executed blocks in the specified epoch.
   * - JSON-RPC Method: [`cfx_getBlockRewardInfo`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockrewardinfo)
   * @param args - {@link GetBlockRewardInfoParameters}
   * @returns  array of reward info objects {@link GetBlockRewardInfoReturnType}
   */
  getBlockRewardInfo: (
    args: GetBlockRewardInfoParameters
  ) => Promise<GetBlockRewardInfoReturnType>;
  /**
   *Returns the requested block if the provided pivot hash is correct, returns an error otherwise.
   - JSON-RPC Method: [`cfx_getBlockByHashWithPivotAssumption`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockbyhashwithpivotassumption)
   * @param args -{@link GetBlockByHashWithPivotAssumptionParameters}
   * @returns - {@link GetBlockByHashWithPivotAssumptionReturnType}
   */
  getBlockByHashWithPivotAssumption: (
    args: GetBlockByHashWithPivotAssumptionParameters
  ) => Promise<GetBlockByHashWithPivotAssumptionReturnType>;

  /**
   * Returns the deposit list of the given account, identified by its address.
   * - JSON-RPC Method: [`cfx_getDepositList`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getdepositlist)
   * @param args - {@link GetDepositListParameters}
   * @returns - {@link GetDepositListReturnType}
   */
  getDepositList: (
    args: GetDepositListParameters
  ) => Promise<GetDepositListReturnType>;

  /**
   * Returns the vote list of the given account, identified by its address.
   * - JSON-RPC Method: [`cfx_getVoteList`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getvotelist)
   * @param args - {@link GetDepositListParameters}
   * @returns -array of vote info object {@link GetDepositListReturnType}
   */
  getVoteList: (args: GetVoteListParameters) => Promise<GetVoteListReturnType>;

  /**
   * Returns summary supply info of the entire chain.
   * - JSON-RPC Method: [`cfx_getSupplyInfo`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getsupplyinfo)
   * @returns - {@link GetSupplyInfoReturnType}
   */
  getSupplyInfo: () => Promise<GetSupplyInfoReturnType>;

  /**
   * Returns transaction pool pending info of one account
   * - JSON-RPC Method: [`cfx_getAccountPendingInfo`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getaccountpendinginfo)
   * @param args - {@link GetAccountPendingInfoParameters}
   * @returns - {@link GetAccountPendingInfoReturnType}
   */
  getAccountPendingInfo: (
    args: GetAccountPendingInfoParameters
  ) => Promise<GetAccountPendingInfoReturnType>;

  /**
   * Returns pending transactions in pool of one account
   * - JSON-RPC Method: [`cfx_getAccountPendingTransactions`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getaccountpendingtransactions)
   * @param args
   * @returns
   */
  getAccountPendingTransactions: (
    args: GetAccountPendingTransactionsParameters
  ) => Promise<GetAccountPendingTransactionsReturnType>;

  /**
   * Returns PoS economics summary info.
   * - JSON-RPC Method: [`cfx_getPoSEconomics`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getposeconomics)
   * @param args - {@link GetPoSEconomicsParameters}
   * @returns - {@link GetPoSEconomicsReturnType}
   */
  getPoSEconomics: (
    args: GetPoSEconomicsParameters
  ) => Promise<GetPoSEconomicsReturnType>;

  /**
   * Get rewards information of a PoS epoch by it's correspond PoW epoch number. Only PoW epoch happen's at PoS epoch end will have rewards information. Others will return undefined.
   * - JSON-RPC Method: [`cfx_getPoSRewardByEpoch`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getposrewardbyepoch)
   * @param args - {@link GetPoSRewardByEpochParameters}
   * @returns - {@link GetPoSRewardByEpochReturnType}
   */
  getPoSRewardByEpoch: (
    args: GetPoSRewardByEpochParameters
  ) => Promise<GetPoSRewardByEpochReturnType>;

  /**
   *  Returns DAO vote params info
   * - JSON-RPC Method: [`cfx_getParamsFromVote`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getparamsfromvote)
   * @param args - {@link GetParamsFormVoteParameters}
   * @returns - {@link GetParamsFormVoteReturnType}
   */
  getParamsFromVote: (
    args: GetParamsFormVoteParameters
  ) => Promise<GetParamsFormVoteReturnType>;

  /**
   * This function creates a log filter for tracking usage. It returns a log filter ID, which can be employed through the cfx_getFilterChanges command to retrieve logs newly generated from recently executed transactions. The from* field in this context will be disregarded by this RPC (Remote Procedure Call). This function can also be used via cfx_getFilterLogs to retrieve all logs that match the filter criteria. In this instance, the from* fields are considered.
   * - JSON-RPC Method: [`cfx_newFilter`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_newfilter)
   * @param args - {@link CreateEventFilterParameters}
   * @returns - {@link CreateEventFilterReturnType}
   */
  createEventFilter: <
    const TAbiEvent extends AbiEvent | undefined = undefined,
    const TAbiEvents extends
      | readonly AbiEvent[]
      | readonly unknown[]
      | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
    TStrict extends boolean | undefined = undefined,
    TFromEpoch extends EpochNumber | EpochTag | undefined = undefined,
    TToEpoch extends EpochNumber | EpochTag | undefined = undefined,
    _EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
    _Args extends
      | MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName>
      | undefined = undefined
  >(
    args?:
      | CreateEventFilterParameters<
          TAbiEvent,
          TAbiEvents,
          TStrict,
          _EventName,
          _Args
        >
      | undefined
  ) => Promise<
    CreateEventFilterReturnType<
      TAbiEvent,
      TAbiEvents,
      TStrict,
      TFromEpoch,
      TToEpoch,
      _EventName,
      _Args
    >
  >;
  /**
  /**
   * Create a block filter for following up usage. Returns the block filter id which can be used via cfx_getFilterChanges to retrieve latest executed blocks.
   * - JSON-RPC Method: [`cfx_newBlockFilter`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_newblockfilter)
   * @returns - {@link CreateBlockFilterReturnType}
   */
  createBlockFilter: () => Promise<CreateBlockFilterReturnType>;
  /**
   * Create a pending transaction filter for following up usage. Returns the transaction filter id which can be used via cfx_getFilterChanges to retrieve ready but not executed transactions.
   * - JSON-RPC Method: [`cfx_newPendingTransactionFilter`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_newpendingtransactionfilter)
   * @returns - {@link CreatePendingTransactionFilterReturnType}
   */
  createPendingTransactionFilter: () => Promise<CreatePendingTransactionFilterReturnType>;
  /**
   * Get filter changes since last retrieve. Return value depends on which type of filter id is provided. Filter id can be returned from current RPCs:
   * cfx_newFilter: new logs generated from newly executed transactions matching the filter. Noting that from* fields will be ignored by this RPC.
   * cfx_newBlockFilter: new executed blocks.
   * cfx_newPendingTransactionFilter: new pending transactions which are ready to execute.
   * @param args - {@link GetFilterChangesParameters}
   * @returns - {@link GetFilterChangesReturnType}
   */
  getFilterChanges: (
    args: GetFilterChangesParameters
  ) => Promise<GetFilterChangesReturnType>;

  /**
   * Returns all logs matching the log filter (Unlike cfx_getFilterChanges, from* fields still work).
   * - JSON-RPC Method: [`cfx_getFilterLogs`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getfilterlogs)
   * @param args - {@link GetFilterLogsParameters}
   * @returns - {@link GetFilterLogsReturnType}
   */
  getFilterLogs: (
    args: GetFilterLogsParameters
  ) => Promise<GetFilterLogsReturnType>;
  /**
   * Uninstall the specified filter. Returns a bool whether the uninstallation succeeds.
   * - JSON-RPC Method: [`cfx_uninstallFilter`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_uninstallfilter)
   * @param args - {@link UninstallFilterParameters}
   * @returns - {@link UninstallFilterReturnType}
   */
  uninstallFilter: (
    args: UninstallFilterParameters
  ) => Promise<UninstallFilterReturnType>;

  /**
   * Returns current chain collateral status info.
   * - JSON-RPC Method: [`cfx_getCollateralInfo`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getcollateralinfo)
   * @param args - {@link GetCollateralInfoParameters}
   * @returns - {@link GetCollateralForStorageReturnType}
   */
  getCollateralInfo: (
    args: GetCollateralInfoParameters
  ) => Promise<GetCollateralInfoReturnType>;
  /**
   * These RPC methods require node's public_rpc_apis config set to safe or all, or the namespace include txpool
   * Return one address's next usable nonce in transaction pool.
   * - JSON-RPC Method: [`txpool_nextNonce`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/txpool_rpc#txpool_nextnonce)
   * @param args - {@link TxPoolNextNonceParameters}
   * @returns - {@link TxPoolNextNonceReturnType}
   */
  txPoolNextNonce: (
    args: TxPoolNextNonceParameters
  ) => Promise<TxPoolNextNonceReturnType>;
  /**
   * Returns the current status of the PoS chain
   * - JSON-RPC Method: [`pos_getStatus`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getstatus)
   * @returns  - {@link GetPoSStatusReturnType}
   */
  getPoSStatus: () => Promise<GetPoSStatusReturnType>;
  /**
   * Get the PoS account information
   * - JSON-RPC Method: [`pos_getAccount`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getaccount)
   * @param args - {@link GetPoSAccountParameters}
   * @returns - {@link GetPoSAccountReturnType}
   */
  getPoSAccount: (
    args: GetPoSAccountParameters
  ) => Promise<GetPoSAccountReturnType>;
  /**
   * Get the current PoS committee information in default. It is also able to get the committee information for a block in history by specifying the blockNumber.Parameters
   * - JSON-RPC Method: [`pos_getCommittee`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getcommittee)
   * @param args - {@link GetPosCommitteeParameters}
   * @returns - {@link GetPosCommitteeReturnType}
   */
  getPosCommittee: (
    args: GetPosCommitteeParameters
  ) => Promise<GetPosCommitteeReturnType>;

  /**
   * Get block information by its hash value
   * - JSON-RPC Method: [`pos_getBlockByHash`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getblockbyhash)
   * - JSON-RPC Method: [`pos_getBlockByNumber`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/pos_rpc#pos_getblockbynumber)
   * @param args - {@link GetPosBlockParameters}
   * @returns - {@link GetPosBlockReturnType}
   */
  getPoSBlock: (args: GetPoSBlockParameters) => Promise<GetPosBlockReturnType>;
};

export function publicActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account<Address> | undefined = Account<Address> | undefined
>(
  client: Client<TTransport, TChain, TAccount>
): PublicActions<TTransport, TChain, TAccount> {
  return {
    getTransaction: (args) => getTransaction(client, args),
    getBlock: (args) => getBlock(client, args),
    getBastBlockHash: () => getBastBlockHash(client),
    getEpochNumber: (args) => getEpochNumber(client, args),
    getGasPrice: () => getGasPrice(client),
    getBlocksByEpoch: (args) => getBlocksByEpoch(client, args),
    getBalance: (args) => getBalance(client, args),
    getStakingBalance: (args) => getStakingBalance(client, args),
    getCollateralForStorage: (args) => getCollateralForStorage(client, args),
    getAdmin: (args) => getAdmin(client, args),
    getBytecode: (args) => getBytecode(client, args),
    getStorageAt: (args) => GetStorageAt(client, args),
    getStorageRoot: (args) => GetStorageRoot(client, args),
    getSponsorInfo: (args) => GetSponsorInfo(client, args),
    getNextNonce: (args) => getNextNonce(client, args),
    call: (args) => call(client, args),
    estimateGasAndCollateral: (args) => estimateGasAndCollateral(client, args),
    getLogs: (args) => getLogs(client, args),
    getTransactionReceipt: (args) => getTransactionReceipt(client, args),
    getAccount: (args) => getAccount(client, args),
    getInterestRate: (args) => getInterestRate(client, args),
    getAccumulateInterestRate: (args) =>
      getAccumulateInterestRate(client, args),
    checkBalanceAgainstTransaction: (args) =>
      checkBalanceAgainstTransaction(client, args),
    getSkippedBlocksByEpoch: (args) => getSkippedBlocksByEpoch(client, args),
    getConfirmationRiskByHash: (args) =>
      getConfirmationRiskByHash(client, args),
    getStatus: () => getStatus(client),
    clientVersion: () => clientVersion(client),
    getBlockRewardInfo: (args) => getBlockRewardInfo(client, args),
    getBlockByHashWithPivotAssumption: (args) =>
      getBlockByHashWithPivotAssumption(client, args),
    getDepositList: (args) => getDepositList(client, args),
    getVoteList: (args) => getVoteList(client, args),
    getSupplyInfo: () => getSupplyInfo(client),
    getAccountPendingInfo: (args) => getAccountPendingInfo(client, args),
    getAccountPendingTransactions: (args) =>
      getAccountPendingTransactions(client, args),
    getPoSEconomics: (args) => getPoSEconomics(client, args),
    getPoSRewardByEpoch: (args) => getPoSRewardByEpoch(client, args),
    getParamsFromVote: (args) => getParamsFromVote(client, args),
    createEventFilter: (args) => createEventFilter(client, args),
    createBlockFilter: () => createBlockFilter(client),
    createPendingTransactionFilter: () =>
      createPendingTransactionFilter(client),
    getFilterChanges: (args) => getFilterChanges(client, args),
    getFilterLogs: (args) => getFilterLogs(client, args),
    uninstallFilter: (args) => uninstallFilter(client, args),
    getCollateralInfo: (args) => getCollateralInfo(client, args),
    txPoolNextNonce: (args) => txPoolNextNonce(client, args),
    getPoSStatus: () => getPoSStatus(client),
    getPoSAccount: (args) => getPoSAccount(client, args),
    getPosCommittee: (args) => getPosCommittee(client, args),
    getPoSBlock: (args) => getPoSBlock(client, args),
  };
}
