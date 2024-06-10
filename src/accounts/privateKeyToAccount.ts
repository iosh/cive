import { secp256k1 } from "@noble/curves/secp256k1";
import { toHex, type Hex } from "viem";
import { signMessage, signTypedData } from "viem/accounts";
import { toAccount } from "./toAccount.js";
import { AddressType, PrivateKeyAccount } from "./types.js";
import { publicKeyToAddress } from "./utils/publicKeyToAddress.js";

export type PrivateKeyToAccountParameters<
  TChainId extends number = number,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined
> = {
  privateKey: Hex;
  chainId: TChainId;
  addressType?: TAddressType | undefined;
  verbose?: TVerbose | undefined;
};

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount<
  TChainId extends number = number,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined
>({
  privateKey,
  chainId: chainId,
  addressType = "user",
  verbose = false,
}: PrivateKeyToAccountParameters<
  TChainId,
  TAddressType,
  TVerbose
>): PrivateKeyAccount {
  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false));
  const address = publicKeyToAddress({
    publicKey,
    chainId: chainId,
    addressType,
    verbose,
  });
  const account = toAccount({
    address: address,

    async signMessage({ message }) {
      return signMessage({ message, privateKey });
    },
    async signTransaction(transaction, { serializer } = {}) {
      return signTransaction({ privateKey, transaction, serializer });
    },
    async signTypedData(typedData) {
      return signTypedData({ ...typedData, privateKey });
    },
  });

  return {
    ...account,
    publicKey,
    source: "privateKey",
  } as PrivateKeyAccount;
}
