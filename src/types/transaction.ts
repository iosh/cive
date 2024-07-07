import type { Hash, Hex, OneOf, Signature } from 'viem'
import type { Address } from '../accounts/types.js'
import type { FeeValuesEIP1559, FeeValuesLegacy } from './fee.js'
import type { Log } from './log.js'
import type { Branded, ExactPartial, IsNever } from './utils.js'

export type AccessList = { address: Address; storageKeys: Hex[] }[]
export type TransactionType = 'legacy' | 'eip1559' | 'eip2930' | (string & {})

export type TransactionReceipt<
  TQuantity = bigint,
  TIndex = number,
  TOutcomeStatus = 'success' | 'failed' | 'skipped',
  TType = TransactionType,
> = {
  /**
   * hash of the given transaction.
   */
  transactionHash: Hash
  /**
   * transaction index within the block.
   */
  index: TQuantity
  /**
   *  hash of the block where this transaction was in and got executed.
   */
  blockHash: Hex

  /**
   * epoch number of the block where this transaction was in and got executed.
   */
  epochNumber: TQuantity

  from: Address
  to: Address
  /**
   * gas used for executing the transaction.
   */
  gasUsed: TQuantity
  /**
   *  gas charged to the sender's account. If the provided gas (gas limit) is larger than the gas used, at most 1/4 of it is refunded.
   */
  gasFee: TQuantity

  /**
   *  true if this transaction's gas fee was covered by the sponsor.
   */
  gasCoveredBySponsor: boolean
  /**
   * the amount of storage collateral this transaction required.
   */
  storageCollateralized: TQuantity

  /**
   * true if this transaction's storage collateral was covered by the sponsor.
   */
  storageCoveredBySponsor: boolean
  /**
   * array of storage change objects, each specifying an address and the corresponding amount of storage collateral released,
   */
  storageReleased: {
    address: Address
    collaterals: TQuantity
  }[]

  /**
   * address of the contract created. null when it is not a contract deployment transaction.
   */
  contractCreated: Address | null

  /**
   * hash of the state root after the execution of the corresponding block. 0 if the state root is not available.
   */
  stateRoot: Hash
  /**
   * the outcome status code. 0x0 means success. 0x1 means failed. 0x2 means skipped
   */
  outcomeStatus: TOutcomeStatus
  /**
   * bloom filter for light clients to quickly retrieve related logs.
   */
  logsBloom: Hex
  /**
   * array of log objects that this transaction generated,
   */
  log: Log<TQuantity, TIndex>[]
  /**
   * tx exec fail message, if transaction exec success this will be null.
   */
  txExecErrorMsg: string | null
  /** Transaction type */
  type: TType

  burntGasFee: TQuantity

  /** Pre-London, it is equal to the transaction's gasPrice. Post-London, it is equal to the actual gas price paid for inclusion. */
  effectiveGasPrice: TQuantity

  space?: 'native'
}

export type TransactionBase<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
> = {
  /** Transaction sender */
  from: Address
  /** Transaction recipient or `null` if deploying a contract */
  to: Address | null
  /** Value in wei sent with this transaction */
  value: TQuantity
  /** Unique number identifying this transaction */
  nonce: TIndex
  /** optional field to include arbitrary data */
  data: Hash
  /** Gas provided for transaction execution */
  gas: TQuantity
  /** Hash of this transaction */
  hash: Hash
  /**the maximum amount of storage space that can be consumed by the transaction. */
  storageLimit: TQuantity

  /**the epoch number of the blockchain, which is used to sets an expiration time for the transaction */
  epochHeight: TPending extends true ? null : TQuantity

  /** Hash of block containing this transaction or `null` if pending */
  blockHash: TPending extends true ? null : Hash

  /** ECDSA signature r */
  r: Hex
  /** ECDSA signature s */
  s: Hex
  /** ECDSA recovery ID */
  v: TQuantity

  /** Index of this transaction in the block or `null` if pending */
  transactionIndex: TPending extends true ? null : TIndex
}
export type TransactionLegacy<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
  TType = 'legacy',
> = Omit<TransactionBase<TQuantity, TIndex, TPending>, 'yParity'> &
  FeeValuesLegacy<TQuantity> & {
    contractCreated: Address | null
    status: TQuantity | null
    /** EIP-2930 Access List. */
    accessList?: never | undefined
    /** Chain ID that this transaction is valid on. */
    chainId?: TIndex | undefined
    yParity?: never | undefined
    type: TType
  }
export type TransactionEIP2930<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
  TType = 'eip2930',
> = TransactionBase<TQuantity, TIndex, TPending> &
  FeeValuesLegacy<TQuantity> & {
    contractCreated: Address | null
    status: TQuantity | null
    /** EIP-2930 Access List. */
    accessList: AccessList
    /** Chain ID that this transaction is valid on. */
    chainId: TIndex
    type: TType
  }
export type TransactionEIP1559<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
  TType = 'eip1559',
> = TransactionBase<TQuantity, TIndex, TPending> &
  FeeValuesEIP1559<TQuantity> & {
    contractCreated: Address | null
    status: TQuantity | null
    /** EIP-2930 Access List. */
    accessList: AccessList
    /** Chain ID that this transaction is valid on. */
    chainId: TIndex
    type: TType
  }
export type Transaction<
  TQuantity = bigint,
  TIndex = number,
  TPending extends boolean = boolean,
> = OneOf<
  | TransactionLegacy<TQuantity, TIndex, TPending>
  | TransactionEIP2930<TQuantity, TIndex, TPending>
  | TransactionEIP1559<TQuantity, TIndex, TPending>
>

export type TransactionRequestBase<TQuantity = bigint, TIndex = number> = {
  /** Transaction sender */
  from: Address
  /** Transaction recipient */
  to?: Address | null | undefined
  /** Gas provided for transaction execution */
  gas?: bigint | undefined

  /** Value in wei sent with this transaction */
  value?: TQuantity | undefined

  /** Contract code or a hashed method call with encoded args */
  data?: Hex | undefined

  /** Unique number identifying this transaction */
  nonce?: TIndex | undefined
  /**the maximum amount of storage space that can be consumed by the transaction. */
  storageLimit?: TQuantity | undefined
  /** the epoch number of the blockchain, which is used to sets an expiration time for the transaction */
  epochHeight?: TQuantity | undefined
}

export type TransactionRequestLegacy<
  TQuantity = bigint,
  TIndex = number,
  TTransactionType = 'legacy',
> = TransactionRequestBase<TQuantity, TIndex> &
  ExactPartial<FeeValuesLegacy<TQuantity>> & {
    accessList?: never | undefined
    type?: TTransactionType | undefined
  }
export type TransactionRequestEIP2930<
  TQuantity = bigint,
  TIndex = number,
  TTransactionType = 'eip2930',
> = TransactionRequestBase<TQuantity, TIndex> &
  ExactPartial<FeeValuesLegacy<TQuantity>> & {
    accessList?: AccessList | undefined
    type?: TTransactionType | undefined
  }
export type TransactionRequestEIP1559<
  TQuantity = bigint,
  TIndex = number,
  TTransactionType = 'eip1559',
> = TransactionRequestBase<TQuantity, TIndex> &
  ExactPartial<FeeValuesEIP1559<TQuantity>> & {
    accessList?: AccessList | undefined
    type?: TTransactionType | undefined
  }

export type TransactionRequestGeneric<
  TQuantity = bigint,
  TIndex = number,
> = TransactionRequestBase<TQuantity, TIndex> & {
  accessList?: AccessList | undefined
  gasPrice?: TQuantity | undefined
  maxFeePerBlobGas?: TQuantity | undefined
  maxFeePerGas?: TQuantity | undefined
  maxPriorityFeePerGas?: TQuantity | undefined
  type?: string | undefined
}

export type TransactionRequest<TQuantity = bigint, TIndex = number> = OneOf<
  | TransactionRequestLegacy<TQuantity, TIndex>
  | TransactionRequestEIP2930<TQuantity, TIndex>
  | TransactionRequestEIP1559<TQuantity, TIndex>
>

export type TransactionSerializedEIP1559 = `0x02${string}`
export type TransactionSerializedEIP2930 = `0x01${string}`
export type TransactionSerializedLegacy = Branded<`0x${string}`, 'legacy'>
export type TransactionSerializedGeneric = `0x${string}`
export type TransactionSerialized<
  TType extends TransactionType = TransactionType,
  result =
    | (TType extends 'eip1559' ? TransactionSerializedEIP1559 : never)
    | (TType extends 'eip2930' ? TransactionSerializedEIP2930 : never)
    | (TType extends 'legacy' ? TransactionSerializedLegacy : never),
> = IsNever<result> extends true ? TransactionSerializedGeneric : result

export type TransactionSerializableBase<
  TQuantity = bigint,
  TIndex = number,
> = Omit<TransactionRequestBase<TQuantity, TIndex>, 'from'> &
  ExactPartial<Signature>

export type TransactionSerializableLegacy<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  ExactPartial<FeeValuesLegacy<TQuantity>> & {
    accessList?: undefined
    chainId?: number | undefined
    type?: 'legacy' | undefined
  }
export type TransactionSerializableEIP2930<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  ExactPartial<FeeValuesLegacy<TQuantity>> & {
    accessList?: AccessList | undefined
    chainId: number
    type?: 'eip2930' | undefined
    yParity?: number | undefined
  }
export type TransactionSerializableEIP1559<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  ExactPartial<FeeValuesEIP1559<TQuantity>> & {
    accessList?: AccessList | undefined
    chainId: number
    type?: 'eip1559' | undefined
    yParity?: number | undefined
  }

export type TransactionSerializableGeneric<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> & {
  accessList?: AccessList | undefined
  chainId?: number | undefined
  gasPrice?: TQuantity | undefined
  maxFeePerBlobGas?: TQuantity | undefined
  maxFeePerGas?: TQuantity | undefined
  maxPriorityFeePerGas?: TQuantity | undefined
  type?: string | undefined
}

export type TransactionSerializable<
  TQuantity = bigint,
  TIndex = number,
> = OneOf<
  | TransactionSerializableLegacy<TQuantity, TIndex>
  | TransactionSerializableEIP2930<TQuantity, TIndex>
  | TransactionSerializableEIP1559<TQuantity, TIndex>
>
