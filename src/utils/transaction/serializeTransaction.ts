import {
  type AssertTransactionLegacyErrorType,
  type ConcatHexErrorType,

  type GetTransactionTypeErrorType,

  type InvalidLegacyVErrorType,
  type ToHexErrorType,
  type ToRlpErrorType,
  concatHex,
  toHex,
  toRlp,
} from 'viem'
import {
  rlpTransaction1559Type,
  rlpTransaction2930Type,
} from '../../constants/transaction.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Signature, SignatureLegacy } from '../../types/misc.js'
import type {
  TransactionSerializable,
  TransactionSerializableEIP1559,
  TransactionSerializableEIP2930,
  TransactionSerializableGeneric,
  TransactionSerializableLegacy,
  TransactionSerialized,
  TransactionSerializedEIP1559,
  TransactionSerializedEIP2930,
  TransactionSerializedLegacy,
  TransactionType,
} from '../../types/transaction.js'
import type { OneOf } from '../../types/utils.js'
import { base32AddressToHex } from '../address/base32AddressToHex.js'
import {
  type AssertTransactionEIP1559ErrorType,
  type AssertTransactionEIP2930ErrorType,
  assertTransactionEIP1559,
  assertTransactionEIP2930,
  assertTransactionLegacy,
} from './assertTransaction.js'
import {
  type GetTransactionType,
  getTransactionType,
} from './getTransactionType.js'
import {
  type SerializeAccessListErrorType,
  serializeAccessList,
} from './serializeAccessList.js'

export type SerializedTransactionReturnType<
  transaction extends TransactionSerializable = TransactionSerializable,
  _transactionSerialized extends
    TransactionType = GetTransactionType<transaction>,
> = TransactionSerialized<_transactionSerialized>

export type SerializeTransactionFn<
  transaction extends TransactionSerializableGeneric = TransactionSerializable,
  ///
  _transactionType extends TransactionType = never,
> = typeof serializeTransaction<
  OneOf<TransactionSerializable | transaction>,
  _transactionType
>

export type SerializeTransactionErrorType =
  | GetTransactionTypeErrorType
  | SerializeTransactionEIP1559ErrorType
  | SerializeTransactionEIP2930ErrorType
  | SerializeTransactionLegacyErrorType
  | ErrorType

export function serializeTransaction<
  const transaction extends TransactionSerializable,
  ///
  _transactionType extends TransactionType = GetTransactionType<transaction>,
>(
  transaction: transaction,
  signature?: Signature | undefined,
): SerializedTransactionReturnType<transaction, _transactionType> {
  const type = getTransactionType(transaction) as GetTransactionType

  if (type === 'eip1559')
    return serializeTransactionEIP1559(
      transaction as TransactionSerializableEIP1559,
      signature,
    ) as SerializedTransactionReturnType<transaction>

  if (type === 'eip2930')
    return serializeTransactionEIP2930(
      transaction as TransactionSerializableEIP2930,
      signature,
    ) as SerializedTransactionReturnType<transaction>

  return serializeTransactionLegacy(
    transaction as TransactionSerializableLegacy,
    signature as SignatureLegacy,
  ) as SerializedTransactionReturnType<transaction>
}

type SerializeTransactionEIP1559ErrorType =
  | AssertTransactionEIP1559ErrorType
  | ConcatHexErrorType
  | InvalidLegacyVErrorType
  | ToHexErrorType
  | ToRlpErrorType
  | SerializeAccessListErrorType
  | ErrorType

function serializeTransactionEIP1559(
  transaction: TransactionSerializableEIP1559,
  signature?: Signature | undefined,
): TransactionSerializedEIP1559 {
  const {
    chainId,
    gas,
    nonce,
    to,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    accessList,
    data,
    storageLimit,
    epochHeight,
  } = transaction

  assertTransactionEIP1559(transaction)
  const serializedAccessList = serializeAccessList(accessList)
  const toHexAddress = to ? base32AddressToHex({ address: to }) : undefined

  //[nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, storageLimit, epochHeight, chainId, data, accessList]
  const serializedTransaction = [
    nonce ? toHex(nonce) : '0x',
    maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x',
    maxFeePerGas ? toHex(maxFeePerGas) : '0x',
    gas ? toHex(gas) : '0x',
    toHexAddress ?? '0x',
    value ? toHex(value) : '0x',
    storageLimit ? toHex(storageLimit) : '0x',
    epochHeight ? toHex(epochHeight) : '0x',
    toHex(chainId),
    data ?? '0x',
    serializedAccessList,
  ]

  if (signature) {
    return concatHex([
      rlpTransaction1559Type,
      toRlp([
        serializedTransaction,
        signature.v ? toHex(signature.v) : '0x',
        signature.r,
        signature.s,
      ]),
    ]) as TransactionSerializedEIP1559
  }

  return concatHex([
    rlpTransaction1559Type,
    toRlp(serializedTransaction),
  ]) as TransactionSerializedEIP1559
}

type SerializeTransactionEIP2930ErrorType =
  | AssertTransactionEIP2930ErrorType
  | ConcatHexErrorType
  | InvalidLegacyVErrorType
  | ToHexErrorType
  | ToRlpErrorType
  | SerializeAccessListErrorType
  | ErrorType

function serializeTransactionEIP2930(
  transaction: TransactionSerializableEIP2930,
  signature?: Signature | undefined,
): TransactionSerializedEIP2930 {
  const {
    chainId,
    gas,
    data,
    nonce,
    to,
    value,
    accessList,
    gasPrice,
    storageLimit,
    epochHeight,
  } = transaction

  assertTransactionEIP2930(transaction)
  const toHexAddress = to ? base32AddressToHex({ address: to }) : undefined
  const serializedAccessList = serializeAccessList(accessList)

  const serializedTransaction = [
    nonce ? toHex(nonce) : '0x',
    gasPrice ? toHex(gasPrice) : '0x',
    gas ? toHex(gas) : '0x',
    toHexAddress ?? '0x',
    value ? toHex(value) : '0x',
    storageLimit ? toHex(storageLimit) : '0x',
    epochHeight ? toHex(epochHeight) : '0x',
    toHex(chainId),
    data ?? '0x',
    serializedAccessList,
  ]

  if (signature) {
    return concatHex([
      rlpTransaction2930Type,
      toRlp([
        serializedTransaction,
        signature.v ? toHex(signature.v) : '0x',
        signature.r,
        signature.s,
      ]),
    ]) as TransactionSerializedEIP2930
  }

  return concatHex([
    rlpTransaction2930Type,
    toRlp(serializedTransaction),
  ]) as TransactionSerializedEIP2930
}

type SerializeTransactionLegacyErrorType =
  | AssertTransactionLegacyErrorType
  | InvalidLegacyVErrorType
  | ToHexErrorType
  | ToRlpErrorType
  | ErrorType

function serializeTransactionLegacy(
  transaction: TransactionSerializableLegacy,
  signature?: SignatureLegacy | undefined,
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
  } = transaction

  assertTransactionLegacy(transaction)

  const serializedTransaction = [
    nonce ? toHex(nonce) : '0x',
    gasPrice ? toHex(gasPrice) : '0x',
    gas ? toHex(gas) : '0x',
    to ? base32AddressToHex({ address: to }) : '0x',
    value ? toHex(value) : '0x',
    storageLimit ? toHex(storageLimit) : '0x',
    epochHeight ? toHex(epochHeight) : '0x',
  ]

  if (signature) {
    return toRlp([
      [...serializedTransaction, toHex(chainId), data ?? '0x'],
      signature.v ? toHex(signature.v) : '0x',
      signature.r,
      signature.s,
    ]) as TransactionSerializedLegacy
  }
  return toRlp([
    ...serializedTransaction,
    toHex(chainId),
    data ?? '0x',
  ]) as TransactionSerializedLegacy
}
