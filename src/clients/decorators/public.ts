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
  };
}
