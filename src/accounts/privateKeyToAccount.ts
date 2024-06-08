import { secp256k1 } from "@noble/curves/secp256k1";
import { toHex, type Hex, type PrivateKeyAccount } from "viem";
import { publicKeyToAddress } from "viem/accounts";
import { hexAddressToBase32 } from "../utils/address/hexAddressToBase32.js";

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount(
  privateKey: Hex,
  networkId: number
): PrivateKeyAccount {
  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false));
  const hexAddress = publicKeyToAddress(publicKey);
  const base32Address = hexAddressToBase32({ hexAddress, networkId });
  const account = toAccount({
    address: base32Address,
    async experimental_signAuthMessage(parameters) {
      return signAuthMessage({ ...parameters, privateKey });
    },
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
