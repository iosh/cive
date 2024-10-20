import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type {
  ByteArray,
  Hex,
  SignableMessage,
  Signature,
} from '../../types/misc.js'
import type { Prettify } from '../../types/utils.js'
import { type HashMessageErrorType, hashMessage } from '../../utils/index.js'
import {
  type VerifyHashErrorType,
  type VerifyHashParameters,
  verifyHash,
} from './verifyHash.js'

export type VerifyMessageParameters = Prettify<
  Omit<VerifyHashParameters, 'hash' | 'epochTag' | 'epochNumber'> &
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
    ) & {
      address: Address
      message: SignableMessage
      signature: Hex | ByteArray | Signature
    }
>

export type VerifyMessageReturnType = boolean

export type VerifyMessageErrorType =
  | HashMessageErrorType
  | VerifyHashErrorType
  | ErrorType

export async function verifyMessage<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  {
    address,
    message,
    factory,
    factoryData,
    signature,
    ...callRequest
  }: VerifyMessageParameters,
): Promise<VerifyMessageReturnType> {
  const hash = hashMessage(message)
  return verifyHash(client, {
    address,
    factory: factory!,
    factoryData: factoryData!,
    hash,
    signature,
    ...callRequest,
  })
}
