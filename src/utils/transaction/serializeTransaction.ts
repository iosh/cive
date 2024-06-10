import {
  AssertTransactionLegacyErrorType,
  GetTransationTypeErrorType as GetTransactionTypeErrorType,
  InvalidLegacyVErrorType,
  Signature,
  ToHexErrorType,
  ToRlpErrorType,
  toHex,
  toRlp,
} from "viem";
import {
  TransactionSerializable,
  TransactionSerializableGeneric,
  TransactionSerializableLegacy,
  TransactionSerialized,
  TransactionSerializedLegacy,
  TransactionType,
} from "../../types/transaction.js";
import { OneOf } from "../../types/utils.js";
import {
  GetTransactionType,
  getTransactionType,
} from "./getTransactionType.js";
import { ErrorType } from "../../errors/utils.js";
import { SignatureLegacy } from "../../types/misc.js";
import { assertTransactionLegacy } from "./assertTransaction.js";
import { base32AddressToHex } from "../address/base32AddressToHex.js";

export type SerializedTransactionReturnType<
  transaction extends TransactionSerializable = TransactionSerializable,
  _transactionSerialized extends TransactionType = GetTransactionType<transaction>
> = TransactionSerialized<_transactionSerialized>;

export type SerializeTransactionFn<
  transaction extends TransactionSerializableGeneric = TransactionSerializable,
  ///
  _transactionType extends TransactionType = never
> = typeof serializeTransaction<
  OneOf<TransactionSerializable | transaction>,
  _transactionType
>;

export type SerializeTransactionErrorType =
  | GetTransactionTypeErrorType
  // | SerializeTransactionEIP1559ErrorType
  // | SerializeTransactionEIP2930ErrorType
  | SerializeTransactionLegacyErrorType
  | ErrorType;

export function serializeTransaction<
  const transaction extends TransactionSerializable,
  ///
  _transactionType extends TransactionType = GetTransactionType<transaction>
>(
  transaction: transaction,
  signature?: Signature | undefined
): SerializedTransactionReturnType<transaction, _transactionType> {
  const type = getTransactionType(transaction) as GetTransactionType;

  // if (type === "eip1559")
  //   return serializeTransactionEIP1559(
  //     transaction as TransactionSerializableEIP1559,
  //     signature
  //   ) as SerializedTransactionReturnType<transaction>;

  // if (type === "eip2930")
  //   return serializeTransactionEIP2930(
  //     transaction as TransactionSerializableEIP2930,
  //     signature
  //   ) as SerializedTransactionReturnType<transaction>;

  return serializeTransactionLegacy(
    transaction as TransactionSerializableLegacy,
    signature as SignatureLegacy
  ) as SerializedTransactionReturnType<transaction>;
}

type SerializeTransactionLegacyErrorType =
  | AssertTransactionLegacyErrorType
  | InvalidLegacyVErrorType
  | ToHexErrorType
  | ToRlpErrorType
  | ErrorType;

function serializeTransactionLegacy(
  transaction: TransactionSerializableLegacy,
  signature?: SignatureLegacy | undefined
): TransactionSerializedLegacy {
  const {
    chainId = 1,
    gas,
    data,
    nonce,
    to,
    value,
    gasPrice,
    storageLimit,
    epochHeight,
  } = transaction;

  assertTransactionLegacy(transaction);

  let serializedTransaction = [
    nonce ? toHex(nonce) : "0x",
    gasPrice ? toHex(gasPrice) : "0x",
    gas ? toHex(gas) : "0x",
    to ? base32AddressToHex({ address: to }) : "0x",
    value ? toHex(value) : "0x",
    storageLimit ? toHex(storageLimit) : "0x",
    epochHeight ? toHex(epochHeight) : "0x",
  ];

  if (signature) {
    return toRlp([
      [...serializedTransaction, toHex(chainId), data ?? "0x"],
      toHex(signature.v),
      signature.r,
      signature.s,
    ]) as TransactionSerializedLegacy;
  } else {
    return toRlp([
      ...serializedTransaction,
      toHex(chainId),
      data ?? "0x",
    ]) as TransactionSerializedLegacy;
  }
}
