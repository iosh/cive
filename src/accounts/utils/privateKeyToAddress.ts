import { secp256k1 } from "@noble/curves/secp256k1";
import type { ErrorType } from "../../errors/utils.js";
import {
  type PublicKeyToAddressErrorType,
  publicKeyToAddress,
} from "./publicKeyToAddress.js";
import { bytesToHex, type BytesToHexErrorType, type Hex } from "viem";
import { Address, AddressType } from "../types.js";

export type PrivateKeyToAddressErrorType =
  | BytesToHexErrorType
  | PublicKeyToAddressErrorType
  | ErrorType;

export type PrivateKeyToAddressParameters = {
  privateKey: Hex;
  networkId: number;
  addressType?: AddressType | undefined;
  verbose?: boolean | undefined;
};

export function privateKeyToAddress<
  TNetworkId extends number = number,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined
>({
  privateKey,
  networkId,
  addressType = "user",
  verbose = false,
}: PrivateKeyToAddressParameters) {
  const publicKey = bytesToHex(
    secp256k1.getPublicKey(privateKey.slice(2), false)
  );
  return publicKeyToAddress({
    publicKey,
    networkId,
    addressType,
    verbose,
  }) as Address<TNetworkId, TAddressType, TVerbose>;
}
