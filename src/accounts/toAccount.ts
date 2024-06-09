import {
  type InvalidAddressErrorType,
  type IsAddressErrorType,
  InvalidAddressError,
} from "viem";
import type {
  AccountSource,
  Address,
  CustomSource,
  JsonRpcAccount,
  LocalAccount,
} from "./types.js";
import { isAddress } from "../utils/address/isAddress.js";
import { ErrorType } from "../errors/utils.js";

type GetAccountReturnType<TAccountSource extends AccountSource> =
  | (TAccountSource extends Address ? JsonRpcAccount : never)
  | (TAccountSource extends CustomSource ? LocalAccount : never);

export type ToAccountErrorType =
  | InvalidAddressErrorType
  | IsAddressErrorType
  | ErrorType;

export function toAccount<TAccountSource extends AccountSource>(
  source: TAccountSource
): GetAccountReturnType<TAccountSource> {
  if (typeof source === "string") {
    if (!isAddress(source)) throw new InvalidAddressError({ address: source });
    return {
      address: source,
      type: "json-rpc",
    } as GetAccountReturnType<TAccountSource>;
  }

  if (!isAddress(source.address))
    throw new InvalidAddressError({ address: source.address });
  return {
    address: source.address,
    signMessage: source.signMessage,
    signTransaction: source.signTransaction,
    signTypedData: source.signTypedData,
    source: "custom",
    type: "local",
  } as GetAccountReturnType<TAccountSource>;
}
