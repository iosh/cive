import type { Address } from "abitype";
import type { FeeValuesLegacy, Hash, Hex } from "viem";
import type { ExactPartial } from "./utils";

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
