import {
  BaseError,
  BaseErrorType,
  FeeCapTooHighError,
  FeeCapTooHighErrorType,
  TipAboveFeeCapError,
  TipAboveFeeCapErrorType,
  TransactionSerializableEIP1559,
} from "viem";
import { IsAddressErrorType, isAddress } from "../address/isAddress.js";
import { ErrorType } from "../../errors/utils.js";
import {
  InvalidAddressError,
  InvalidAddressErrorType,
} from "../errors/address.js";
import {
  InvalidChainIdError,
  InvalidChainIdErrorType,
} from "../errors/chain.js";
import {
  TransactionSerializableEIP2930,
  TransactionSerializableLegacy,
} from "../../types/transaction.js";

export type AssertTransactionEIP4844ErrorType =
  | AssertTransactionEIP1559ErrorType
  | InvalidVersionedHashSizeErrorType
  | InvalidVersionedHashVersionErrorType
  | ErrorType;

export type AssertTransactionEIP1559ErrorType =
  | BaseErrorType
  | IsAddressErrorType
  | InvalidAddressErrorType
  | InvalidChainIdErrorType
  | FeeCapTooHighErrorType
  | TipAboveFeeCapErrorType
  | ErrorType;

export function assertTransactionEIP1559(
  transaction: TransactionSerializableEIP1559
) {
  const { chainId, maxPriorityFeePerGas, maxFeePerGas, to } = transaction;
  if (chainId <= 0) throw new InvalidChainIdError({ chainId });
  if (to && !isAddress(to)) throw new InvalidAddressError({ address: to });
  if (maxFeePerGas && maxFeePerGas > 2n ** 256n - 1n)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (
    maxPriorityFeePerGas &&
    maxFeePerGas &&
    maxPriorityFeePerGas > maxFeePerGas
  )
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}

export type AssertTransactionEIP2930ErrorType =
  | BaseErrorType
  | IsAddressErrorType
  | InvalidAddressErrorType
  | InvalidChainIdErrorType
  | FeeCapTooHighErrorType
  | ErrorType;

export function assertTransactionEIP2930(
  transaction: TransactionSerializableEIP2930
) {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } =
    transaction;
  if (chainId <= 0) throw new InvalidChainIdError({ chainId });
  if (to && !isAddress(to)) throw new InvalidAddressError({ address: to });
  if (maxPriorityFeePerGas || maxFeePerGas)
    throw new BaseError(
      "`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute."
    );
  if (gasPrice && gasPrice > 2n ** 256n - 1n)
    throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}

export type AssertTransactionLegacyErrorType =
  | BaseErrorType
  | IsAddressErrorType
  | InvalidAddressErrorType
  | InvalidChainIdErrorType
  | FeeCapTooHighErrorType
  | ErrorType;

export function assertTransactionLegacy(
  transaction: TransactionSerializableLegacy
) {
  const {
    chainId,
    maxPriorityFeePerGas,
    gasPrice,
    maxFeePerGas,
    to,
    accessList,
  } = transaction;
  if (to && !isAddress(to)) throw new InvalidAddressError({ address: to });
  if (typeof chainId !== "undefined" && chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (maxPriorityFeePerGas || maxFeePerGas)
    throw new BaseError(
      "`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute."
    );
  if (gasPrice && gasPrice > 2n ** 256n - 1n)
    throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
  if (accessList)
    throw new BaseError(
      "`accessList` is not a valid Legacy Transaction attribute."
    );
}
