import { Hash, Hex } from "viem";
import { Address } from "../accounts/types.js";

export type TractCallAction<TQuantity = bigint> = {
  from: Address;
  to: Address;
  value: TQuantity;
  gas: TQuantity;
  input: Hex;
  callType: "call" | "callCode" | "delegateCall" | "staticCall";
};

export type TractCreateAction<TQuantity = bigint> = {
  from: Address;
  value: TQuantity;
  gas: TQuantity;
  init: Hex;
  createType: "create" | "create2";
};

export type TractCallResultActon<TQuantity = bigint> = {
  outcome: "success" | "reverted" | "fail";
  gasLeft: TQuantity;
  returnData: Hex;
};

export type TractCreateResultAction<TQuantity = bigint> = {
  outcome: "success" | "reverted" | "fail";
  addr: Address;
  gasLeft: TQuantity;
  returnData: Hex;
};
export type TractInternalTransferActionAction = {
  from: Address;
  fromPocket: Hex;
  fromSpace: Hex;
  to: Address;
  toPocket: Hex;
  toSpace: Hex;
  value: Hex;
};

export type TractActions<TQuantity = bigint> =
  | TractCallAction<TQuantity>
  | TractCreateAction<TQuantity>
  | TractCallResultActon<TQuantity>
  | TractCreateResultAction<TQuantity>
  | TractInternalTransferActionAction;

export type Tract<TQuantity = bigint> = {
  action: TractActions;
  valid: boolean;
  epochHash: Hash;
  epochNumber: TQuantity;
  blockHash: Hash;
  transactionPosition: TQuantity;
  transactionHash: Hash;
};

export type transactionTraces<TQuantity = bigint> = {
  transactionHash: Hash;
  transactionPosition: TQuantity;
  traces: Tract[];
};
export type TraceBlock<TQuantity = bigint> = {
  blockHash: Hash;
  epochHash: Hash;
  epochNumber: TQuantity;
  transactionTraces: transactionTraces<TQuantity>[];
};
