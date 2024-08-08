import {
  type DecodeEventLogErrorType,
  type EncodeEventTopicsErrorType,
  type FormatLogErrorType,
  type Hash,
  type NumberToHexErrorType,
  type Transport,
  numberToHex,
} from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import { ChainIdNotFoundError } from '../../errors/chain.js'
import type { ErrorType } from '../../errors/utils.js'
import type { AbiEvent } from '../../types/abitype.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type {
  MaybeAbiEventName,
  MaybeExtractEventArgsFromAbi,
} from '../../types/contract.js'
import type { Log } from '../../types/log.js'
import type { LogTopic } from '../../types/misc.js'
import {
  type EncodeEventTopicsParameters,
  encodeEventTopics,
} from '../../utils/abi/encodeEventTopics.js'
import { parseEventLogs } from '../../utils/abi/parseEventLogs.js'
import { formatLog } from '../../utils/formatters/log.js'

export type GetLogsParameters<
  TAbiEvent extends AbiEvent | undefined = undefined,
  TAbiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
  TStrict extends boolean | undefined = undefined,
  _EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
> = {
  /** Address or list of addresses from which logs originated */
  address?: Address | Address[] | undefined
  fromBlock?: bigint | undefined
  toBlock?: bigint | undefined
} & (
  | {
      event: TAbiEvent
      events?: never | undefined
      args?: MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName> | undefined
      /**
       * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
       * @default false
       */
      strict?: TStrict | undefined
    }
  | {
      event?: never | undefined
      events: TAbiEvents
      args?: never | undefined
      /**
       * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
       * @default false
       */
      strict?: TStrict | undefined
    }
  | {
      event?: never | undefined
      events?: never | undefined
      args?: never | undefined
      strict?: never | undefined
    }
) &
  (
    | {
        /**
         * @default latest_checkpoint
         */
        fromEpoch?:
          | EpochNumber
          | Exclude<EpochTag, 'latest_finalized' | 'latest_mined'>
        /**
         * @default latest_state
         */
        toEpoch?:
          | EpochNumber
          | Exclude<EpochTag, 'latest_finalized' | 'latest_mined'>

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

export type GetLogsReturnType<
  TAbiEvent extends AbiEvent | undefined = undefined,
  TAbiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
  TStrict extends boolean | undefined = undefined,
  _EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
> = Log<bigint, number, TAbiEvent, TStrict, TAbiEvents, _EventName>[]
export type GetLogsErrorType =
  | DecodeEventLogErrorType
  | EncodeEventTopicsErrorType
  | FormatLogErrorType
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType

export async function getLogs<
  TChain extends Chain | undefined,
  const TAbiEvent extends AbiEvent | undefined = undefined,
  const TAbiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
  TStrict extends boolean | undefined = undefined,
>(
  client: Client<Transport, TChain>,
  {
    fromEpoch = 'latest_checkpoint',
    toEpoch = 'latest_state',
    fromBlock,
    toBlock,
    blockHashes,
    address,
    args,
    event,
    events: events_,
    strict: strict_,
  }: GetLogsParameters<TAbiEvent, TAbiEvents, TStrict> = {},
): Promise<GetLogsReturnType<TAbiEvent, TAbiEvents, TStrict>> {
  const strict = strict_ ?? false

  const events = events_ ?? (event ? [event] : undefined)
  // TODO: update this
  if (typeof client.chain === 'undefined' || !('id' in client.chain)) {
    throw new ChainIdNotFoundError()
  }
  let topics: LogTopic[] = []
  if (events) {
    const encoded = (events as AbiEvent[]).flatMap((event) =>
      encodeEventTopics({
        abi: [event],
        eventName: (event as AbiEvent).name,
        args: events_ ? undefined : args,
      } as EncodeEventTopicsParameters),
    )
    topics = [encoded as LogTopic]
    if (event) topics = topics[0] as LogTopic[]
  }

  const _fromEpoch = fromBlock ? undefined : fromEpoch
  const _toEpoch = toBlock ? undefined : toEpoch

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

  const logs = await client.request({
    method: 'cfx_getLogs',
    params: [params],
  })

  const formattedLogs = logs.map((log) => formatLog(log))

  if (!events)
    return formattedLogs as GetLogsReturnType<TAbiEvent, TAbiEvents, TStrict>
  return parseEventLogs({
    abi: events,
    logs: formattedLogs,
    strict,
    networkId: client.chain.id,
  }) as unknown as GetLogsReturnType<TAbiEvent, TAbiEvents, TStrict>
}
