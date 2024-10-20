import type { IsHexErrorType, ToHexErrorType } from 'viem'
import {
  bytesToHex,
  isAddressEqual,
  isErc6492Signature,
  isHex,
  recoverAddress,
} from 'viem/utils'
import { serializeSignature } from '../../accounts/index.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { universalSignatureValidatorAbi } from '../../constants/abis.js'
import { universalSignatureValidatorByteCode } from '../../constants/contract.js'
import { CallExecutionError } from '../../errors/contract.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Address } from '../../types/abitype.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { ByteArray, Hex, Signature } from '../../types/misc.js'
import type { OneOf } from '../../types/utils.js'
import { isBytesEqual } from '../../utils/data/isBytesEqual.js'
import { getAction } from '../../utils/getAction.js'
import {
  type EncodeDeployDataErrorType,
  base32AddressToHex,
  encodeDeployData,
  getAddress,
} from '../../utils/index.js'
import { serializeErc6492Signature } from '../../utils/signature/serializeErc6492Signature.js'
import { type CallErrorType, call } from './call.js'

export type VerifyHashParameters = (
  | {
      /**
       * @default 'latest_state'
       */
      epochTag?:
        | Exclude<EpochTag, 'latest_finalized' | 'latest_mined'>
        | undefined
      epochNumber?: never | undefined
    }
  | {
      epochTag?: never | undefined
      epochNumber?: EpochNumber | undefined
    }
) & {
  /**
   * The signed the original message hash address
   */
  address: Address
  /**
   * The message hash
   */
  hash: Hex

  signature: Hex | ByteArray | Signature
} & OneOf<{ factory: Address; factoryData: Hex } | {}>

export type VerifyHashReturnType = boolean

export type VerifyHashErrorType =
  | CallErrorType
  | IsHexErrorType
  | ToHexErrorType
  | EncodeDeployDataErrorType
  | ErrorType

export async function verifyHash<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: VerifyHashParameters,
): Promise<VerifyHashReturnType> {
  const { address, factory, factoryData, hash, signature, ...rest } = parameters
  const signatureHex = (() => {
    if (isHex(signature)) return signature
    if (typeof signature === 'object' && 'r' in signature && 's' in signature)
      return serializeSignature(signature)
    return bytesToHex(signature)
  })()

  const wrappedSignature = await (async () => {
    // If no `factory` or `factoryData` is provided, it is assumed that the
    // address is not a Smart Account, or the Smart Account is already deployed.
    if (!factory && !factoryData) return signatureHex

    // If the signature is already wrapped, return the signature.
    if (isErc6492Signature(signatureHex)) return signatureHex

    // If the Smart Account is not deployed, wrap the signature with a 6492 wrapper
    // to perform counterfactual validation.
    return serializeErc6492Signature({
      address: factory!,
      data: factoryData!,
      signature: signatureHex,
    })
  })()

  try {
    const { data } = await getAction(
      client,
      call,
      'call',
    )({
      data: encodeDeployData({
        abi: universalSignatureValidatorAbi,
        args: [address, hash, wrappedSignature],
        bytecode: universalSignatureValidatorByteCode,
      }),
      ...rest,
    })

    return isBytesEqual(data ?? '0x0', '0x1')
  } catch (error) {
    // Fallback attempt to verify the signature via ECDSA recovery.
    try {
      const verified = isAddressEqual(
        base32AddressToHex({ address: getAddress(address) }),
        await recoverAddress({ hash, signature }),
      )
      if (verified) return true
    } catch {}

    if (error instanceof CallExecutionError) {
      // if the execution fails, the signature was not valid and an internal method inside of the validator reverted
      // this can happen for many reasons, for example if signer can not be recovered from the signature
      // or if the signature has no valid format
      return false
    }

    throw error
  }
}
