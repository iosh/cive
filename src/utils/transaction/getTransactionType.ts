import {
  InvalidSerializableTransactionError,
  type FeeValuesEIP1559,
  type InvalidSerializableTransactionErrorType,
} from "viem";
import type { FeeValuesLegacy } from "../../types/fee.js";
import type {
  TransactionRequestGeneric,
  TransactionRequestLegacy,
  TransactionSerializableGeneric,
  TransactionSerializableLegacy,
  TransactionSerializableEIP1559,
  TransactionRequestEIP1559,
  TransactionRequestEIP2930,
  TransactionSerializableEIP2930,
} from "../../types/transaction.js";
import type {
  Assign,
  ExactPartial,
  IsNever,
  OneOf,
  Opaque,
} from "../../types/utils.js";
import { ErrorType } from "../../errors/utils.js";

type BaseProperties = {
  accessList?: undefined;
  gasPrice?: undefined;
  maxFeePerBlobGas?: undefined;
  maxFeePerGas?: undefined;
  maxPriorityFeePerGas?: undefined;
};

type LegacyProperties = Assign<BaseProperties, FeeValuesLegacy>;

type EIP1559Properties = Assign<
  BaseProperties,
  OneOf<
    | {
        maxFeePerGas: FeeValuesEIP1559["maxFeePerGas"];
      }
    | {
        maxPriorityFeePerGas: FeeValuesEIP1559["maxPriorityFeePerGas"];
      },
    FeeValuesEIP1559
  > & {
    accessList?: TransactionSerializableEIP1559["accessList"] | undefined;
  }
>;
type EIP2930Properties = Assign<
  BaseProperties,
  ExactPartial<FeeValuesLegacy> & {
    accessList: TransactionSerializableEIP2930["accessList"];
  }
>;

export type GetTransactionType<
  transaction extends OneOf<
    TransactionSerializableGeneric | TransactionRequestGeneric
  > = TransactionSerializableGeneric,
  result =
    | (transaction extends
        | Opaque<TransactionSerializableLegacy, transaction>
        | Opaque<TransactionRequestLegacy, transaction>
        | LegacyProperties
        ? "legacy"
        : never)
    | (transaction extends
        | Opaque<TransactionSerializableEIP1559, transaction>
        | Opaque<TransactionRequestEIP1559, transaction>
        | EIP1559Properties
        ? "eip1559"
        : never)
    | (transaction extends
        | Opaque<TransactionSerializableEIP2930, transaction>
        | Opaque<TransactionRequestEIP2930, transaction>
        | EIP2930Properties
        ? "eip2930"
        : never)
    | (transaction["type"] extends string ? transaction["type"] : never)
> = IsNever<result> extends false ? result : string;

export type GetTransitionTypeErrorType =
  | InvalidSerializableTransactionErrorType
  | ErrorType;

export function getTransactionType<
  const transaction extends OneOf<
    TransactionSerializableGeneric | TransactionRequestGeneric
  >
>(transaction: transaction): GetTransactionType<transaction> {
  if (transaction.type)
    return transaction.type as GetTransactionType<transaction>;

  if (
    typeof transaction.maxFeePerGas !== "undefined" ||
    typeof transaction.maxPriorityFeePerGas !== "undefined"
  ) {
    return "eip1559" as any;
  }

  if (typeof transaction.gasPrice !== "undefined") {
    if (typeof transaction.accessList !== "undefined") return "eip2930" as any;
    return "legacy" as any;
  }

  throw new InvalidSerializableTransactionError({ transaction });
}
