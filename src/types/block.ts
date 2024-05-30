import type { Hash, Hex } from "viem";
import type { Transaction } from "./transaction.js";
import type { Address } from "../accounts/types.js";

export type Block<
  TQuantity = bigint,
  TIncludeTransactions extends boolean = boolean,
  TEpochTag extends EpochTag = EpochTag,
  TTransaction = Transaction<
    bigint,
    number,
    TEpochTag extends "latest_mined" ? true : false
  >
> = {
  /**
   * if the weight of the block is adaptive under the GHAST rule.
   */
  adaptive: boolean;
  /**
   * if 0, then this block does not blame any blocks on its parent path. If it is n > 0, then this block blames its n predecessors on its parent path, e.g. when n = 1, then the block blames its parent but not its parent's parent.
   */
  blame: TQuantity;

  /**
   *  the hash of the logs bloom after deferred execution at the block's epoch (assuming it is the pivot block).
   */
  deferredLogsBloomHash: Hash;

  /**
   * the Merkle root of the receipts after deferred execution at the block's epoch (assuming it is the pivot block).
   */
  deferredReceiptsRoot: Hash;

  /**
   * the PoW difficulty of this block.
   */
  difficulty: TQuantity;
  /**
   * the number of the epoch containing this block in the node's view of the ledger. null when the epoch number is not determined (e.g. the block is not in the best block's past set).
   */
  epochNumber: TQuantity;

  /**
   *  the maximum gas allowed in this block.
   */
  gasLimit: TQuantity;
  /**
   * the total gas used in this block. null when the block is pending.
   */
  gasUsed: TEpochTag extends "latest_mined" ?   null :TQuantity;

  /**
   *  hash of the block.
   */
  hash: TEpochTag extends "latest_mined" ?  null : Hash;

  /**
   *  the height of the block.
   */
  height: TQuantity;
  /**
   * the address of the beneficiary to whom the mining rewards were given.
   */
  miner: Address;

  /**
   *  hash of the generated proof-of-work.
   */
  nonce: TEpochTag extends "latest_mined" ?  null :Hex;

  /**
   * hash of the parent block.
   */
  parentHash: Hash;

  /**
   * the PoW quality. null when the block is pending.
   */
  powQuality: TEpochTag extends "latest_mined" ?  null:Hash;
  /**
   *  array of referee block hashes.
   */
  refereeHashes: Hash[];
  /**
   *  the size of this block in bytes, excluding the block header.
   */
  size: TQuantity;
  /**
   * the unix timestamp for when the block was created.
   */
  timestamp: TQuantity;
  /**
   * array of transaction objects, or 32-byte transaction hashes, depending on the second parameter.
   */
  transactions: Hash[];
  /**
   *  the Merkle root of the transactions in this block
   */
  transactionsRoot: Hash;
  /**
   * customized information. Note from v2.0 custom's type has changed from array of number array to array of hex string.
   */
  custom: Hex[];

  /**
   *  the number of this block's total order in the tree-graph. null when the order is not determined. Added from Conflux-rust v1.1.5
   */
  blockNumber: TQuantity;
  /**
   * the hash of the PoS newest committed block. Added from Conflux-rust v2.0.0
   */
  posReference: Hash;

  /** Base fee per gas */
  baseFeePerGas: TQuantity | null
};

export type EpochTag =
  | "earliest"
  | "latest_checkpoint"
  | "latest_finalized"
  | "latest_confirmed"
  | "latest_state"
  | "latest_mined";

export type EpochNumber<TQuantity = bigint> = TQuantity;
