import type { Hex } from "viem";
import type { Address } from "../accounts/types";

// see:https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_getaccount
export type ChainAccount<TQuantity = bigint> = {
    address: Address;
    balance: TQuantity;
    nonce: TQuantity;
    codeHash: Hex;
    stakingBalance: TQuantity;
    collateralForStorage: TQuantity;
    accumulatedInterestReturn: TQuantity;
    admin: Address;
  };
  