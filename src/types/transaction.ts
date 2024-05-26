import type { FeeValuesLegacy, Hash, Hex } from "viem";
import type { ExactPartial } from "./utils.js";
import type { Log } from "./log.js";
import type { Address } from "../accounts/types.js";

export type TransactionReceipt<
  TQuantity = bigint,
  TIndex = number,
  TOutcomeStatus = "success" | "failed" | "skipped"
> = {
  /**
   * hash of the given transaction.
   */
  transactionHash: Hash;
  /**
   * transaction index within the block.
   */
  index: TQuantity;
  /**
   *  hash of the block where this transaction was in and got executed.
   */
  blockHash: Hex;

  /**
   * epoch number of the block where this transaction was in and got executed.
   */
  epochNumber: TQuantity;

  from: Address;
  to: Address;
  /**
   * gas used for executing the transaction.
   */
  gasUsed: TQuantity;
  /**
   *  gas charged to the sender's account. If the provided gas (gas limit) is larger than the gas used, at most 1/4 of it is refunded.
   */
  gasFee: TQuantity;

  /**
   *  true if this transaction's gas fee was covered by the sponsor.
   */
  gasCoveredBySponsor: boolean;
  /**
   * the amount of storage collateral this transaction required.
   */
  storageCollateralized: TQuantity;

  /**
   * true if this transaction's storage collateral was covered by the sponsor.
   */
  storageCoveredBySponsor: boolean;
  /**
   * array of storage change objects, each specifying an address and the corresponding amount of storage collateral released,
   */
  storageReleased: {
    address: Address;
    collaterals: TQuantity;
  }[];

  /**
   * address of the contract created. null when it is not a contract deployment transaction.
   */
  contractCreated: Address | null;

  /**
   * hash of the state root after the execution of the corresponding block. 0 if the state root is not available.
   */
  stateRoot: Hash;
  /**
   * the outcome status code. 0x0 means success. 0x1 means failed. 0x2 means skipped
   */
  outcomeStatus: TOutcomeStatus;
  /**
   * bloom filter for light clients to quickly retrieve related logs.
   */
  logsBloom: Hex;
  /**
   * array of log objects that this transaction generated,
   */
  log: Log<TQuantity>[];
  /**
   * tx exec fail message, if transaction exec success this will be null.
   */
  txExecErrorMsg: string | null;
};

export type TransactionBase<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean
> = {
  /** Transaction sender */
  from: Address;
  /** Transaction recipient or `null` if deploying a contract */
  to: Address | null;
  /** Value in wei sent with this transaction */
  value: TQuantity;
  /** Unique number identifying this transaction */
  nonce: TIndex;
  /** optional field to include arbitrary data */
  data: Hash;
  /** Gas provided for transaction execution */
  gas: TQuantity;
  /** Hash of this transaction */
  hash: Hash;
  /**the maximum amount of storage space that can be consumed by the transaction. */
  storageLimit: TQuantity;

  /**the epoch number of the blockchain, which is used to sets an expiration time for the transaction */
  epochHeight: TPending extends true ? null : TQuantity;

  /** Hash of block containing this transaction or `null` if pending */
  blockHash: TPending extends true ? null : Hash;

  /** ECDSA signature r */
  r: Hex;
  /** ECDSA signature s */
  s: Hex;
  /** ECDSA recovery ID */
  v: TQuantity;

  /** Index of this transaction in the block or `null` if pending */
  transactionIndex: TPending extends true ? null : TIndex;
};
export type TransactionLegacy<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean
  // TType = "legacy"
> = Omit<TransactionBase<TQuantity, TIndex, TPending>, "yParity"> &
  FeeValuesLegacy<TQuantity> & {
    // /** EIP-2930 Access List. */
    // accessList?: never | undefined;
    // blobVersionedHashes?: never | undefined;
    /** Chain ID that this transaction is valid on. */
    chainId?: TIndex | undefined;
    // yParity?: never | undefined;
    // type: TType;
    contractCreated: Address | null;
    status: TQuantity | null;
  };

export type Transaction<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean
> = TransactionLegacy<TQuantity, TIndex, TPending>;

export type TransactionRequestBase<TQuantity = bigint, TIndex = number> = {
  /** Transaction sender */
  from: Address;
  /** Transaction recipient */
  to?: Address | null | undefined;
  /** Gas provided for transaction execution */
  gas?: TQuantity | undefined;

  /** Value in wei sent with this transaction */
  value?: TQuantity | undefined;

  /** Contract code or a hashed method call with encoded args */
  data?: Hex | undefined;

  /** Unique number identifying this transaction */
  nonce?: TIndex | undefined;
};

export type TransactionRequestLegacy<
  TQuantity = bigint,
  TIndex = number,
  TTransactionType = "legacy"
> = TransactionRequestBase<TQuantity, TIndex> &
  ExactPartial<FeeValuesLegacy<TQuantity>>;
