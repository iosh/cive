import type { Address } from "abitype";
import type { Hash } from "viem";

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
    Parameters: [block: EpochTag | RpcEpochNumber, includeTransactions?: boolean];
    ReturnType: Block | null;
  }
];

export type WalletRpcSchema = [];
