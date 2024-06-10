import type { HDKey } from "@scure/bip32";

import { type ToHexErrorType, toHex } from "viem/utils";

import type { ErrorType } from "../errors/utils.js";

import type { AddressType, HDAccount, HDOptions } from "./types.js";
import type { PrivateKeyToAccountErrorType } from "viem/accounts";
import { privateKeyToAccount } from "./privateKeyToAccount.js";

export type HDKeyToAccountErrorType =
  | PrivateKeyToAccountErrorType
  | ToHexErrorType
  | ErrorType;

/**
 * @description Creates an Account from a HD Key.
 *
 * @returns A HD Account.
 */
export function hdKeyToAccount(
  hdKey_: HDKey,
  networkId: number,
  {
    accountIndex = 0,
    addressIndex = 0,
    changeIndex = 0,
    path,
    addressType = "user",
    verbose = false,
  }: HDOptions & {
    addressType?: AddressType | undefined;
    verbose?: boolean | undefined;
  } = {}
): HDAccount {
  // default Conflux path-503
  const hdKey = hdKey_.derive(
    path || `m/44'/503'/${accountIndex}'/${changeIndex}/${addressIndex}`
  );
  const account = privateKeyToAccount({
    privateKey: toHex(hdKey.privateKey!),
    networkId,
    addressType,
    verbose,
  });
  return {
    ...account,
    getHdKey: () => hdKey,
    source: "hd",
  };
}
