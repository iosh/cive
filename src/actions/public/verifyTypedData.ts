import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { TypedData } from '../../types/abitype.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { ByteArray, Hex, Signature } from '../../types/misc.js'
import type { TypedDataDefinition } from '../../types/typedData.js'
import {
  hashTypedData,
  type HashTypedDataErrorType,
} from '../../utils/signature/hashTypedData.js'
import {
  verifyHash,
  type VerifyHashErrorType,
  type VerifyHashParameters,
} from './verifyHash.js'

export type VerifyTypedDataParameters<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | 'EIP712Domain' = keyof typedData,
> = Omit<VerifyHashParameters, 'hash' | 'epochTag' | 'epochNumber'> &
  (
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
  ) &
  TypedDataDefinition<typedData, primaryType> & {
    address: Address

    signature: Hex | ByteArray | Signature
  }

export type VerifyTypedDataReturnType = boolean

export type VerifyTypedDataErrorType =
  | HashTypedDataErrorType
  | VerifyHashErrorType
  | ErrorType

export async function verifyTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | 'EIP712Domain',
  chain extends Chain | undefined,
>(
  client: Client<Transport, chain>,
  parameters: VerifyTypedDataParameters<typedData, primaryType>,
): Promise<VerifyTypedDataReturnType> {
  const {
    address,
    factory,
    factoryData,
    signature,
    message,
    primaryType,
    types,
    domain,
    ...callRequest
  } = parameters as VerifyTypedDataParameters
  const hash = hashTypedData({ message, primaryType, types, domain })
  return verifyHash(client, {
    address,
    factory: factory!,
    factoryData: factoryData!,
    hash,
    signature,
    ...callRequest,
  })
}
