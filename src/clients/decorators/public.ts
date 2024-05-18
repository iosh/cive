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
import { getNextNonce, type GetNextNonceParameters, type GetNextNonceReturnType } from "../../actions/public/getNextNonce";

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
   * @param args - {@link GetNextNonceParameters}
   * @returns - integer of the next nonce that should be used by the given address.
   */
  getNextNonce:(args:GetNextNonceParameters) => Promise<GetNextNonceReturnType>
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
    getNextNonce:(args) => getNextNonce(client,args)
  };
}
