import type { HDKey } from "@scure/bip32";

import { type ToHexErrorType, toHex } from "viem/utils";

import type { ErrorType } from "../errors/utils.js";

import type { HDAccount, HDOptions } from "./types.js";

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
  { accountIndex = 0, addressIndex = 0, changeIndex = 0, path }: HDOptions = {}
): HDAccount {
  // default Conflux path-503
  const hdKey = hdKey_.derive(
    path || `m/44'/503'/${accountIndex}'/${changeIndex}/${addressIndex}`
  );
  const account = privateKeyToAccount(toHex(hdKey.privateKey!));
  return {
    ...account,
    getHdKey: () => hdKey,
    source: "hd",
  };
}
