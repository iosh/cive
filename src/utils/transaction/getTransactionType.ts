import {
  type FeeValuesEIP1559,
  InvalidSerializableTransactionError,
  type InvalidSerializableTransactionErrorType,
} from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import type { FeeValuesLegacy } from '../../types/fee.js'
import type {
  TransactionRequestEIP1559,
  TransactionRequestEIP2930,
  TransactionRequestGeneric,
  TransactionRequestLegacy,
  TransactionSerializableEIP1559,
  TransactionSerializableEIP2930,
  TransactionSerializableGeneric,
  TransactionSerializableLegacy,
} from '../../types/transaction.js'
import type {
  Assign,
  ExactPartial,
  IsNever,
  OneOf,
  ValueOf,
} from '../../types/utils.js'
export type GetTransactionType<
  transaction extends OneOf<
    TransactionSerializableGeneric | TransactionRequestGeneric
  > = TransactionSerializableGeneric,
  result =
    | (transaction extends
        | MatchKeys<TransactionSerializableLegacy, transaction>
        | MatchKeys<TransactionRequestLegacy, transaction>
        | LegacyProperties
        ? 'legacy'
        : never)
    | (transaction extends
        | MatchKeys<TransactionSerializableEIP1559, transaction>
        | MatchKeys<TransactionRequestEIP1559, transaction>
        | EIP1559Properties
        ? 'eip1559'
        : never)
    | (transaction extends
        | MatchKeys<TransactionSerializableEIP2930, transaction>
        | MatchKeys<TransactionRequestEIP2930, transaction>
        | EIP2930Properties
        ? 'eip2930'
        : never)
    | (transaction['type'] extends TransactionSerializableGeneric['type']
        ? Extract<transaction['type'], string>
        : never),
> = IsNever<keyof transaction> extends true
  ? string
  : IsNever<result> extends false
    ? result
    : string

export type GetTransactionTypeErrorType =
  | InvalidSerializableTransactionErrorType
  | ErrorType

export function getTransactionType<
  const transaction extends OneOf<
    TransactionSerializableGeneric | TransactionRequestGeneric
  >,
>(transaction: transaction): GetTransactionType<transaction> {
  if (transaction.type)
    return transaction.type as GetTransactionType<transaction>

  if (
    typeof transaction.maxFeePerGas !== 'undefined' ||
    typeof transaction.maxPriorityFeePerGas !== 'undefined'
  ) {
    return 'eip1559' as any
  }

  if (typeof transaction.gasPrice !== 'undefined') {
    if (typeof transaction.accessList !== 'undefined') return 'eip2930' as any
    return 'legacy' as any
  }

  throw new InvalidSerializableTransactionError({ transaction })
}

////////////////////////////////////////////////////////////////////////////////////////////
// Types

type MatchKeys<T extends object, U extends object> = ValueOf<
  Required<{
    [K in keyof U]: K extends keyof T ? K : undefined
  }>
> extends string
  ? T
  : never

type BaseProperties = {
  accessList?: undefined
  authorizationList?: undefined
  blobs?: undefined
  blobVersionedHashes?: undefined
  gasPrice?: undefined
  maxFeePerBlobGas?: undefined
  maxFeePerGas?: undefined
  maxPriorityFeePerGas?: undefined
  sidecars?: undefined
}

type LegacyProperties = Assign<BaseProperties, FeeValuesLegacy>
type EIP1559Properties = Assign<
  BaseProperties,
  OneOf<
    | {
        maxFeePerGas: FeeValuesEIP1559['maxFeePerGas']
      }
    | {
        maxPriorityFeePerGas: FeeValuesEIP1559['maxPriorityFeePerGas']
      },
    FeeValuesEIP1559
  > & {
    accessList?: TransactionSerializableEIP2930['accessList'] | undefined
  }
>
type EIP2930Properties = Assign<
  BaseProperties,
  ExactPartial<FeeValuesLegacy> & {
    accessList: TransactionSerializableEIP2930['accessList']
  }
>
