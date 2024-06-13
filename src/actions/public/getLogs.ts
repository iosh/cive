import { AbiEvent } from "abitype";
import { EpochNumber, EpochTag } from "../../types/block.js";
import {
  DecodeEventLogErrorType,
  EncodeEventTopicsErrorType,
  EncodeEventTopicsParameters,
  FormatLogErrorType,
  Hash,
  LogTopic,
  MaybeAbiEventName,
  MaybeExtractEventArgsFromAbi,
  NumberToHexErrorType,
  Transport,
  encodeEventTopics,
  numberToHex,
} from "viem";
import { Address } from "../../accounts/types.js";
import { Log } from "../../types/log.js";
import { RequestErrorType } from "viem/utils";
import { ErrorType } from "../../errors/utils.js";
import { Client } from "../../clients/createClient.js";
import { RpcLog } from "../../types/rpc.js";
import { formatLog } from "../../utils/formatters/log.js";
import { parseEventLogs } from "../../utils/abi/parseEventLogs.js";
import { Chain } from "../../types/chain.js";

export type GetLogsParameters<
  TAbiEvent extends AbiEvent | undefined = undefined,
  TAbiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
  TStrict extends boolean | undefined = undefined,
  TFromEpoch extends EpochNumber | EpochTag | undefined = undefined,
  TToEpoch extends EpochNumber | EpochTag | undefined = undefined,
  _EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>
> = {
  /** Address or list of addresses from which logs originated */
  address?: Address | Address[] | undefined;
  fromBlock?: bigint | undefined;
  toBlock?: bigint | undefined;
} & (
  | {
      event: TAbiEvent;
      events?: never | undefined;
      args?: MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName> | undefined;
      /**
       * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
       * @default false
       */
      strict?: TStrict | undefined;
    }
  | {
      event?: never | undefined;
      events: TAbiEvents;
      args?: never | undefined;
      /**
       * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
       * @default false
       */
      strict?: TStrict | undefined;
    }
  | {
      event?: never | undefined;
      events?: never | undefined;
      args?: never | undefined;
      strict?: never | undefined;
    }
) &
  (
    | {
        /**
         * @default latest_checkpoint
         */
        fromEpoch?: TFromEpoch | EpochNumber | EpochTag | undefined;
        /**
         * @default latest_checkpoint
         */
        toEpoch?: TToEpoch | EpochNumber | EpochTag | undefined;

        blockHashes?: never | undefined;
      }
    | {
        fromEpoch?: never | undefined;

        toEpoch?: never | undefined;

        blockHashes?: Hash[];
      }
  );

export type GetLogsReturnType<
  TAbiEvent extends AbiEvent | undefined = undefined,
  TAbiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
  TStrict extends boolean | undefined = undefined,
  _EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>
> = Log<bigint, number, TAbiEvent, TStrict, TAbiEvents, _EventName>[];
export type GetLogsErrorType =
  | DecodeEventLogErrorType
  | EncodeEventTopicsErrorType
  | FormatLogErrorType
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType;

export async function getLogs<
  TChain extends Chain | undefined,
  const TAbiEvent extends AbiEvent | undefined = undefined,
  const TAbiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
  TStrict extends boolean | undefined = undefined
>(
  client: Client<Transport, TChain>,
  {
    fromEpoch,
    toEpoch,
    fromBlock,
    toBlock,
    blockHashes,
    address,
    args,
    event,
    events: events_,
    strict: strict_,
  }: GetLogsParameters<TAbiEvent, TAbiEvents, TStrict> = {}
): Promise<GetLogsReturnType<TAbiEvent, TAbiEvents, TStrict>> {
  const strict = strict_ ?? false;

  const events = events_ ?? (event ? [event] : undefined);

  let topics: LogTopic[] = [];
  if (events) {
    topics = [
      (events as AbiEvent[]).flatMap((event) =>
        encodeEventTopics({
          abi: [event],
          eventName: (event as AbiEvent).name,
          args,
        } as EncodeEventTopicsParameters)
      ),
    ];
    if (event) topics = topics[0] as LogTopic[];
  }

  const fromBlock_ =
    typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock;
  const toBlock_ = typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock;
  let logs: RpcLog[];

  if (blockHashes) {
    logs = await client.request({
      method: "cfx_getLogs",
      params: [
        {
          address,
          topics,
          blockHashes,
          fromBlock: fromBlock_,
          toBlock: toBlock_,
        },
      ],
    });
  } else {
    const fromEpoch_ =
      typeof fromEpoch === "bigint" ? numberToHex(fromEpoch) : fromEpoch;
    const toEpoch_ =
      typeof toEpoch === "bigint" ? numberToHex(toEpoch) : toEpoch;

    logs = await client.request({
      method: "cfx_getLogs",
      params: [
        {
          fromEpoch: fromEpoch_,
          toEpoch: toEpoch_,
          fromBlock: fromBlock_,
          toBlock: toBlock_,
          topics,
        },
      ],
    });
  }

  const formattedLogs = logs.map((log) => formatLog(log));

  if (!events)
    return formattedLogs as GetLogsReturnType<TAbiEvent, TAbiEvents, TStrict>;
  return parseEventLogs({
    abi: events,
    logs: formattedLogs,
    strict,
  }) as unknown as GetLogsReturnType<TAbiEvent, TAbiEvents, TStrict>;
}
