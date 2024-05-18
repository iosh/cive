import type { Address } from "abitype";
import type { ExactPartial, Hash, Hex } from "viem";
import type {
  Quantity,
  RpcFeeValue,
  RpcSponsor,
  RpcTransactionRequest,
} from "./rpc";

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
  },
  /**
   * @description Returns the stacking balance of the given account, identified by its address.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstakingbalance
   */
  {
    Method: "cfx_getStakingBalance";
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber];
    ReturnType: Quantity;
  },
  /**
   * @description Returns the size of the collateral storage of a given address, in bytes.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getcollateralforstorage
   */
  {
    Method: "cfx_getCollateralForStorage";
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber];
    ReturnType: Quantity;
  },
  /**
   * @description Returns the admin of the specified contract.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getadmin
   */
  {
    Method: "cfx_getAdmin";
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber];
    ReturnType: Address | null;
  },
  /**
   * @description Returns the code of the specified contract. If contract not exist will return 0x0
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getcode
   */
  {
    Method: "cfx_getCode";
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber];
    ReturnType: Hex;
  },
  /**
   * @description Returns storage entries from a given contract.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstorageat
   */
  {
    Method: "cfx_getStorageAt";
    Parameters: [
      address: Address,
      storagePosition: Quantity,
      epoch: EpochTag | RpcEpochNumber
    ];
    ReturnType: Hex | null;
  },

  /**
   * @description Returns the storage root of a given contract.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getstorageroot
   */
  {
    Method: "cfx_getStorageRoot";
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber];
    ReturnType: {
      data: Hex | "TOMBSTONE" | null;
      intermediate: Hex | "TOMBSTONE" | null;
      snapshot: Hex | "TOMBSTONE" | null;
    };
  },
  /**
   * @description Returns the sponsor info of a given contract.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getsponsorinfo
   */
  {
    Method: "cfx_getSponsorInfo";
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber];
    ReturnType: RpcSponsor;
  },

  /**
   * @description Returns the next nonce that should be used by the given account when sending a transaction.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getnextnonce
   */
  {
    Method: "cfx_getNextNonce";
    Parameters: [address: Address, epoch: EpochTag | RpcEpochNumber];
    ReturnType: Quantity;
  },
  /**
   * @description Virtually calls a contract, returns the output data. The transaction will not be added to the blockchain. The error message of cfx_call is similar to cfx_estimateGasAndCollateral and error solutions can be found in
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_call
   */
  {
    Method: "cfx_call";
    Parameters:
      | [transaction: ExactPartial<RpcTransactionRequest>]
      | [
          transaction: ExactPartial<RpcTransactionRequest>,
          epoch: EpochTag | RpcEpochNumber
        ];
    ReturnType: Hex;
  },
  /**
   * @description Virtually executes a transaction, returns an estimate for the size of storage collateralized and the gas used by the transaction. The transaction will not be added to the blockchain.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_estimategasandcollateral
   */
  {
    Method: "cfx_estimateGasAndCollateral";
    Parameters:
      | [transaction: RpcTransactionRequest]
      | [transaction: RpcTransactionRequest, epoch: EpochTag | RpcEpochNumber];

    ReturnType: RpcFeeValue;
  }
];

export type WalletRpcSchema = [
  /**
   * @description Sends a signed transaction into the network for processing.
   * @link https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_sendrawtransaction
   */

  {
    Method: "cfx_sendRawTransaction";
    Parameters: [signedTransaction: Hex];
    ReturnType: Hash;
  }
];
