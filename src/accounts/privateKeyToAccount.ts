import { secp256k1 } from '@noble/curves/secp256k1'
import { type Hex, toHex } from 'viem'
import { toAccount } from './toAccount.js'
import type { PrivateKeyAccount } from './types.js'
import { publicKeyToAddress } from './utils/publicKeyToAddress.js'
import { signMessage } from './utils/signMessage.js'
import { signTransaction } from './utils/signTransaction.js'
import { signTypedData } from './utils/signTypedData.js'

export type PrivateKeyToAccountParameters<
  TNetworkId extends number = number,
  TVerbose extends boolean | undefined = undefined,
> = {
  networkId: TNetworkId
  verbose?: TVerbose | undefined
}

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount<
  TNetworkId extends number = number,
  TVerbose extends boolean | undefined = undefined,
>(
  privateKey: Hex,
  {
    networkId,
    verbose = false,
  }: PrivateKeyToAccountParameters<TNetworkId, TVerbose>,
): PrivateKeyAccount {
  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false))
  const address = publicKeyToAddress({
    publicKey,
    networkId,
    verbose,
  })
  const account = toAccount({
    address: address,

    async signMessage({ message }) {
      return signMessage({ message, privateKey })
    },
    async signTransaction(transaction, { serializer } = {}) {
      return signTransaction({ privateKey, transaction, serializer })
    },
    async signTypedData(typedData) {
      return signTypedData({ ...typedData, privateKey })
    },
  })

  return {
    ...account,
    publicKey,
    source: 'privateKey',
  } as PrivateKeyAccount
}
