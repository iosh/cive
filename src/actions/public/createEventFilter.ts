import type {
  EncodeEventTopicsErrorType,
  Hash,
  Hex,
  NumberToHexErrorType,
} from 'viem'
import { encodeEventTopics, numberToHex } from 'viem/utils'
import type { RequestErrorType } from 'viem/utils'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { AbiEvent } from '../../types/abitype.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type {
  MaybeAbiEventName,
  MaybeExtractEventArgsFromAbi,
} from '../../types/contract.js'
import type { Filter } from '../../types/filter.js'
import type { LogTopic } from '../../types/misc.js'
import type { Prettify } from '../../types/utils.js'
import type { EncodeEventTopicsParameters } from '../../utils/abi/encodeEventTopics.js'
import { createFilterRequestScope } from '../../utils/filters/createFilterRequestScope.js'

export type CreateEventFilterParameters<
  TAbiEvent extends AbiEvent | undefined = undefined,
  TAbiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
  TStrict extends boolean | undefined = undefined,
  _EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
  _Args extends
    | MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName>
    | undefined = undefined,
> = {
  address?: Address | Address[] | undefined
  fromBlock?: bigint | undefined
  toBlock?: bigint | undefined
  /**
   * @default latest_checkpoint
   */
  fromEpoch?: EpochNumber | EpochTag | undefined
  /**
   * @default latest_checkpoint
   */
  toEpoch?: EpochNumber | EpochTag | undefined

  blockHashes?: Hash[] | undefined
} & (MaybeExtractEventArgsFromAbi<
  TAbiEvents,
  _EventName
> extends infer TEventFilterArgs
  ?
      | {
          args:
            | TEventFilterArgs
            | (_Args extends TEventFilterArgs ? _Args : never)
          event: TAbiEvent
          events?: never | undefined
          /**
           * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
           * @default false
           */
          strict?: TStrict | undefined
        }
      | {
          args?: never | undefined
          event?: TAbiEvent | undefined
          events?: never | undefined
          /**
           * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
           * @default false
           */
          strict?: TStrict | undefined
        }
      | {
          args?: never | undefined
          event?: never | undefined
          events: TAbiEvents | undefined
          /**
           * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
           * @default false
           */
          strict?: TStrict | undefined
        }
      | {
          args?: never | undefined
          event?: never | undefined
          events?: never | undefined
          strict?: never | undefined
        }
  : {
      args?: never | undefined
      event?: never | undefined
      events?: never | undefined
      strict?: never | undefined
    })

export type CreateEventFilterReturnType<
  TAbiEvent extends AbiEvent | undefined = undefined,
  TAbiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
  TStrict extends boolean | undefined = undefined,
  TFromEpoch extends EpochNumber | EpochTag | undefined = undefined,
  TToEpoch extends EpochNumber | EpochTag | undefined = undefined,
  _EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
  _Args extends
    | MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName>
    | undefined = undefined,
> = Prettify<
  Filter<'event', TAbiEvents, _EventName, _Args, TStrict, TFromEpoch, TToEpoch>
>
export type CreateEventFilterErrorType =
  | EncodeEventTopicsErrorType
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType

export async function createEventFilter<
  TChain extends Chain | undefined,
  const TAbiEvent extends AbiEvent | undefined = undefined,
  const TAbiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
  TStrict extends boolean | undefined = undefined,
  TFromEpoch extends EpochNumber | EpochTag | undefined = undefined,
  TToEpoch extends EpochNumber | EpochTag | undefined = undefined,
  _EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
  _Args extends
    | MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName>
    | undefined = undefined,
>(
  client: Client<Transport, TChain>,
  {
    address,
    args,
    event,
    events: events_,
    fromBlock,
    strict,
    toBlock,
    fromEpoch,
    toEpoch,
    blockHashes,
  }: CreateEventFilterParameters<
    TAbiEvent,
    TAbiEvents,
    TStrict,
    _EventName,
    _Args
  > = {} as any,
): Promise<
  CreateEventFilterReturnType<
    TAbiEvent,
    TAbiEvents,
    TStrict,
    TFromEpoch,
    TToEpoch,
    _EventName,
    _Args
  >
> {
  const events = events_ ?? (event ? [event] : undefined)

  const getRequest = createFilterRequestScope(client, {
    method: 'cfx_newFilter',
  })

  let topics: LogTopic[] = []

  if (events) {
    const encoded = (events as AbiEvent[]).flatMap((event) =>
      encodeEventTopics({
        abi: [event],
        eventName: (event as AbiEvent).name,
        args,
      } as EncodeEventTopicsParameters),
    )
    // TODO: Clean up type casting
    topics = [encoded as LogTopic]
    if (event) topics = topics[0] as LogTopic[]
  }

  const fromBlock_ =
    typeof fromBlock === 'bigint' ? numberToHex(fromBlock) : fromBlock
  const toBlock_ = typeof toBlock === 'bigint' ? numberToHex(toBlock) : toBlock

  let id: Hex
  if (blockHashes) {
    id = await client.request({
      method: 'cfx_newFilter',
      params: [
        {
          fromBlock: fromBlock_,
          toBlock: toBlock_,
          blockHashes,
          address,
          ...(topics.length ? { topics } : {}),
        },
      ],
    })
  } else {
    const fromEpoch_ =
      typeof fromEpoch === 'bigint' ? numberToHex(fromEpoch) : fromEpoch
    const toEpoch_ =
      typeof toEpoch === 'bigint' ? numberToHex(toEpoch) : toEpoch

    id = await client.request({
      method: 'cfx_newFilter',
      params: [
        {
          fromEpoch: fromEpoch_,
          toEpoch: toEpoch_,
          fromBlock: fromBlock_,
          toBlock: toBlock_,

          address,
          ...(topics.length ? { topics } : {}),
        },
      ],
    })
  }

  return {
    abi: events,
    args,
    eventName: event ? (event as AbiEvent).name : undefined,
    fromBlock,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    toBlock,
    type: 'event',
  } as unknown as CreateEventFilterReturnType<
    TAbiEvent,
    TAbiEvents,
    TStrict,
    TFromEpoch,
    TToEpoch,
    _EventName,
    _Args
  >
}
