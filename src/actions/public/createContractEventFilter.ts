import type { Abi, Address } from '../../types/abitype.js'

import type { Client } from '../../clients/createClient.js'

import type { ErrorType } from '../../errors/utils.js'

import type { Chain } from '../../types/chain.js'
import type {
  ContractEventName,
  MaybeExtractEventArgsFromAbi,
} from '../../types/contract.js'
import type { Filter } from '../../types/filter.js'
import type { Hash, Hex } from '../../types/misc.js'
import {
  type EncodeEventTopicsErrorType,
  type EncodeEventTopicsParameters,
  encodeEventTopics,
} from '../../utils/abi/encodeEventTopics.js'

import { type Transport, numberToHex } from 'viem'
import type { NumberToHexErrorType, RequestErrorType } from 'viem/utils'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import { createFilterRequestScope } from '../../utils/filters/createFilterRequestScope.js'

export type CreateContractEventFilterParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> | undefined = undefined,
  args extends
    | MaybeExtractEventArgsFromAbi<abi, eventName>
    | undefined = undefined,
  strict extends boolean | undefined = undefined,
> = {
  address?: Address | Address[] | undefined
  abi: abi
  eventName?: eventName | ContractEventName<abi> | undefined

  /**
   * Whether or not the logs must match the indexed/non-indexed arguments in the event ABI item.
   * @default false
   */
  strict?: strict | boolean | undefined
} & (undefined extends eventName
  ? {
      args?: undefined
    }
  : MaybeExtractEventArgsFromAbi<abi, eventName> extends infer eventFilterArgs
    ? {
        args?:
          | eventFilterArgs
          | (args extends eventFilterArgs ? args : never)
          | undefined
      }
    : {
        args?: undefined
      }) &
  (
    | {
        /**
         * @default latest_checkpoint
         */
        fromEpoch?: EpochNumber | EpochTag
        /**
         * @default latest_state
         */
        toEpoch?: EpochNumber | EpochTag

        toBlock?: never | undefined

        fromBlock?: never | undefined

        blockHashes?: never | undefined
      }
    | {
        fromEpoch?: never | undefined

        toEpoch?: never | undefined

        toBlock: EpochNumber

        fromBlock: EpochNumber

        blockHashes?: never | undefined
      }
    | {
        fromEpoch?: never | undefined

        toEpoch?: never | undefined

        toBlock?: never | undefined

        fromBlock?: never | undefined

        blockHashes: Hash[]
      }
  )

export type CreateContractEventFilterReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> | undefined = undefined,
  args extends
    | MaybeExtractEventArgsFromAbi<abi, eventName>
    | undefined = undefined,
  strict extends boolean | undefined = undefined,
  fromBlock extends EpochNumber | EpochTag | undefined = undefined,
  toBlock extends EpochNumber | EpochTag | undefined = undefined,
> = Filter<'event', abi, eventName, args, strict, fromBlock, toBlock>

export type CreateContractEventFilterErrorType =
  | EncodeEventTopicsErrorType
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType

export async function createContractEventFilter<
  chain extends Chain | undefined,
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi> | undefined,
  args extends MaybeExtractEventArgsFromAbi<abi, eventName> | undefined,
  strict extends boolean | undefined = undefined,
>(
  client: Client<Transport, chain>,
  parameters: CreateContractEventFilterParameters<abi, eventName, args, strict>,
): Promise<CreateContractEventFilterReturnType<abi, eventName, args, strict>> {
  const {
    address,
    abi,
    args,
    eventName,
    fromBlock,
    strict,
    toBlock,
    blockHashes,
    fromEpoch = 'latest_checkpoint',
    toEpoch = 'latest_state',
  } = parameters as CreateContractEventFilterParameters

  const _fromEpoch = fromBlock ? undefined : fromEpoch
  const _toEpoch = toBlock ? undefined : toEpoch
  const getRequest = createFilterRequestScope(client, {
    method: 'cfx_newFilter',
  })

  const topics = eventName
    ? encodeEventTopics({
        abi,
        args,
        eventName,
      } as unknown as EncodeEventTopicsParameters)
    : undefined

  const params = blockHashes
    ? {
        blockHashes,
        address,
        topics,
      }
    : {
        fromEpoch:
          typeof _fromEpoch === 'bigint' ? numberToHex(_fromEpoch) : _fromEpoch,
        toEpoch:
          typeof _toEpoch === 'bigint' ? numberToHex(_toEpoch) : _toEpoch,
        fromBlock:
          typeof fromBlock === 'bigint' ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === 'bigint' ? numberToHex(toBlock) : toBlock,
        address,
        topics,
      }

  const id: Hex = await client.request({
    method: 'cfx_newFilter',
    params: [params],
  })

  return {
    abi,
    args,
    eventName,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    type: 'event',
  } as unknown as CreateContractEventFilterReturnType<
    abi,
    eventName,
    args,
    strict
  >
}
