import type { Transport, Chain } from "viem";
import type { Address, Account } from "../../accounts/types";
import type { Client } from "../createClient";
import {
  getTransaction,
  type GetTransactionReturnType,
  type GetTransactionParameters,
} from "../../actions/public/getTransaction";
import type { EpochTag } from "../../types/block";
import {
  getBlock,
  type GetBlockParameters,
  type GetBlockReturnType,
} from "../../actions/public/getBlock";
import {
  getEpochNumber,
  type GetEpochNumberParameters,
  type GetEpochNumberReturnType,
} from "../../actions/public/getEpochNumber";
import {
  getGasPrice,
  type GetGasPriceReturnType,
} from "../../actions/public/getGasPrice";
import {
  getBastBlockHash,
  type GetBastBlockHashReturn,
} from "../../actions/public/getBastBlockHash";
import {
  getBlocksByEpoch,
  type GetBlocksByEpochParameters,
  type GetBlocksByEpochReturnType,
} from "../../actions/public/getBlocksByEpoch";
import {
  getBalance,
  type GetBalanceParameters,
  type GetBalanceReturnType,
} from "../../actions/public/getBalance";
import {
  getStakingBalance,
  type GetStakingBalanceParameters,
  type GetStakingBalanceReturnType,
} from "../../actions/public/getStakingBalance";
import {
  getCollateralForStorage,
  type GetCollateralForStorageParameters,
  type GetCollateralForStorageReturnType,
} from "../../actions/public/getCollaterlForStorage";
import {
  getAdmin,
  type GetAdminParameters,
  type GetAdminReturnType,
} from "../../actions/public/getAdmin";
import {
  getBytecode,
  type GetBytecodeParameters,
  type GetBytecodeReturnType,
} from "../../actions/public/getBytecode";
import {
  GetStorageAt,
  type GetStorageAtParameters,
  type GetStorageAtReturnType,
} from "../../actions/public/getStorageAt";
import {
  GetStorageRoot,
  type GetStorageRootParameters,
  type GetStorageRootReturnType,
} from "../../actions/public/getStorageRoot";
import {
  GetSponsorInfo,
  type GetSponsorInfoParameters,
  type GetSponsorInfoReturnType,
} from "../../actions/public/getSponsorInfo";
import {
  getNextNonce,
  type GetNextNonceParameters,
  type GetNextNonceReturnType,
} from "../../actions/public/getNextNonce";
import {
  getTransactionReceipt,
  type GetTransactionReceiptParameters,
  type GetTransactionReceiptReturnType,
} from "../../actions/public/getTransactionReceipt";
import {
  getAccount,
  type GetChainAccountParameters,
  type GetChainAccountReturnType,
} from "../../actions/public/getAccount";
import {
  getInterestRate,
  type GetInterestRateParameters,
  type GetInterestRateReturnType,
} from "../../actions/public/getInterestRate";
import {
  getAccumulateInterestRate,
  type GetAccumulateInterestRateParameters,
  type GetAccumulateInterestRateReturnType,
} from "../../actions/public/getAccumulateInterestRate";
import {
  checkBalanceAgainstTransaction,
  type CheckBalanceAgainstTransactionParameters,
  type CheckBalanceAgainstTransactionReturnType,
} from "../../actions/public/checkBalanceAgainstTransaction";
import {
  getSkippedBlocksByEpoch,
  type GetSkippedBlocksByEpochParameters,
  type GetSkippedBlocksByEpochReturnType,
} from "../../actions/public/getSkippedBlocksByEpoch";
import {
  getConfirmationRiskByHash,
  type GetConfirmationRiskByHashParameters,
  type GetConfirmationRiskByHashReturnType,
} from "../../actions/public/getConfirmationRiskByHash";
import {
  getStatus,
  type GetStatusReturnType,
} from "../../actions/public/getStatus";
import {
  clientVersion,
  type ClientVersionReturnType,
} from "../../actions/public/clientVersion";
import {
  getBlockRewardInfo,
  type GetBlockRewardInfoParameters,
  type GetBlockRewardInfoReturnType,
} from "../../actions/public/getBlockRewardInfo";
import {
  getBlockByHashWithPivotAssumption,
  type GetBlockByHashWithPivotAssumptionParameters,
  type GetBlockByHashWithPivotAssumptionReturnType,
} from "../../actions/public/getBlockByHashWithPivotAssumption";
import {
  getDepositList,
  type GetDepositListParameters,
  type GetDepositListReturnType,
} from "../../actions/public/getDepositList";
import {
  getVoteList,
  type GetVoteListParameters,
  type GetVoteListReturnType,
} from "../../actions/public/getVoteList";
import {
  getSupplyInfo,
  type GetSupplyInfoReturnType,
} from "../../actions/public/getSupplyInfo";
import {
  getAccountPendingInfo,
  type GetAccountPendingInfoParameters,
  type GetAccountPendingInfoReturnType,
} from "../../actions/public/getAccountPendingInfo";
import {
  getAccountPendingTransactions,
  type GetAccountPendingTransactionsParameters,
  type GetAccountPendingTransactionsReturnType,
} from "../../actions/public/getAccountPendingTransactions";

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
   * @param args {@link GetBlockParameters}
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
   * Returns a transaction receipt, identified by the corresponding transaction hash.
   * - JSON-RPC Method: [`cfx_sendRawTransaction`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_sendrawtransaction)
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
  };
}
