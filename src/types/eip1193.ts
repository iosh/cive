import type { Address } from "abitype";
import type { Hash } from "viem";
import type { Quantity } from "./rpc";

import type { RpcEpochNumber, RpcTransaction as Transaction } from "./rpc";
import type { Block, EpochNumber, EpochTag } from "./block";
export type EIP1474Methods = [...PublicRpcSchema, ...WalletRpcSchema];
export type PublicRpcSchema = [
  /**
   * @description Returns information about a transaction, identified by its hash.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#json-rpc-methods
   */
  {
    Method: "cfx_getTransactionByHash";
    Parameters: [hash: Hash];
    ReturnType: Transaction | null;
  },
  /**
   * @description Returns information about a block, identified by its hash.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockbyhash
   */
  {
    Method: "cfx_getBlockByHash";
    Parameters: [hash: Hash, includeTransactions?: boolean];
    ReturnType: Block | null;
  },
  /**
   * @description Returns information about a block, identified by its epoch number.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblockbyepochnumber
   */
  {
    Method: "cfx_getBlockByEpochNumber";
    Parameters: [
      block: EpochTag | RpcEpochNumber,
      includeTransactions?: boolean
    ];
    ReturnType: Block | null;
  },

  /**
   * @description Returns the hash of the best block.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getbestblockhash
   */

  {
    Method: "cfx_getBestBlockHash";
    Parameters: undefined;
    ReturnType: Hash;
  },
  /**
   * @description Returns the epoch number corresponding to the given tag.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_epochnumber
   */
  {
    Method: "cfx_epochNumber";
    Parameters: [EpochTag];
    ReturnType: Quantity;
  },
  /**
   * @description Returns the current price per gas in Drip.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_gasprice
   */
  {
    Method: "cfx_gasPrice";
    Parameters: undefined;
    ReturnType: Quantity;
  },

  /**
   * @description Returns the block hashes in the specified epoch.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getblocksbyepoch
   */
  {
    Method: "cfx_getBlocksByEpoch";
    Parameters: [epoch: RpcEpochNumber | EpochTag];
    ReturnType: Hash[];
  },

  /**
   * @description Returns the balance of the given account, identified by its address.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getbalance
   */
  {
    Method: "cfx_getBalance";
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber];
    ReturnType: Quantity;
  }
];

export type WalletRpcSchema = [];
