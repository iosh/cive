import { Hash, Hex } from "viem";
import { Address } from "../accounts/types.js";

export type TraceCallAction<TQuantity = bigint> = {
  from: Address;
  to: Address;
  value: TQuantity;
  gas: TQuantity;
  input: Hex;
  callType: "call" | "callCode" | "delegateCall" | "staticCall";
};

export type TraceCreateAction<TQuantity = bigint> = {
  from: Address;
  value: TQuantity;
  gas: TQuantity;
  init: Hex;
  createType: "create" | "create2";
};

export type TraceCallResultActon<TQuantity = bigint> = {
  outcome: "success" | "reverted" | "fail";
  gasLeft: TQuantity;
  returnData: Hex;
};

export type TraceCreateResultAction<TQuantity = bigint> = {
  outcome: "success" | "reverted" | "fail";
  addr: Address;
  gasLeft: TQuantity;
  returnData: Hex;
};
export type TraceInternalTransferActionAction = {
  from: Address;
  fromPocket: Hex;
  fromSpace: Hex;
  to: Address;
  toPocket: Hex;
  toSpace: Hex;
  value: Hex;
};

export type TraceActions<TQuantity = bigint> =
  | TraceCallAction<TQuantity>
  | TraceCreateAction<TQuantity>
  | TraceCallResultActon<TQuantity>
  | TraceCreateResultAction<TQuantity>
  | TraceInternalTransferActionAction;

export type Trace<TQuantity = bigint> = {
  action: TraceActions;
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
  traces: Trace<TQuantity>[];
};
export type TraceBlock<TQuantity = bigint> = {
  blockHash: Hash;
  epochHash: Hash;
  epochNumber: TQuantity;
  transactionTraces: transactionTraces<TQuantity>[];
};

export type TraceEpoch<TQuantity = bigint> = {
  cfx_traces: Trace<TQuantity>;
  eth_traces: {};
  mirror_address_map: {};
};
