import { secp256k1 } from "@noble/curves/secp256k1";
import { toHex, type Hex } from "viem";
import { publicKeyToAddress } from "viem/accounts";
import { hexAddressToBase32 } from "../utils/address/hexAddressToBase32.js";
import { toAccount } from "./toAccount.js";
import { PrivateKeyAccount } from "./types.js";

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount<TNetworkId extends number = number>(
  privateKey: Hex,
  networkId: TNetworkId
): PrivateKeyAccount {
  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false));
  const hexAddress = publicKeyToAddress(publicKey);
  const base32Address = hexAddressToBase32<TNetworkId>({
    hexAddress,
    networkId,
  });
  const account = toAccount({
    address: base32Address,

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
