import type {
  AbiEventParametersToPrimitiveTypes,
  GetEventArgs,
  Hash,
  Hex,
} from "viem";
import type { Address } from "../accounts/types.js";
import { Abi, AbiEvent, ExtractAbiEvent, ExtractAbiEventNames } from "abitype";

export type Log<
  TQuantity = bigint,
  TIndex = number,
  TAbiEvent extends AbiEvent | undefined = undefined,
  TStrict extends boolean | undefined = undefined,
  TAbi extends Abi | readonly unknown[] | undefined = TAbiEvent extends AbiEvent
    ? [TAbiEvent]
    : undefined,
  TEventName extends string | undefined = TAbiEvent extends AbiEvent
    ? TAbiEvent["name"]
    : undefined
> = {
  address: Address;
  topics: Hex[];
  data: Hex;
  blockHash: Hex;
  epochNumber: TQuantity;
  transactionHash: Hash;
  transactionIndex: TQuantity;
  logIndex: TIndex;
  transactionLogIndex: TQuantity;
} & GetInferredLogValues<TAbiEvent, TAbi, TEventName, TStrict>;

type Topics<
  THead extends AbiEvent["inputs"],
  TBase = [Hex]
> = THead extends readonly [
  infer _Head,
  ...infer Tail extends AbiEvent["inputs"]
]
  ? _Head extends { indexed: true }
    ? [Hex, ...Topics<Tail>]
    : Topics<Tail>
  : TBase;

type GetTopics<
  TAbiEvent extends AbiEvent | undefined = undefined,
  TAbi extends Abi | readonly unknown[] = [TAbiEvent],
  TEventName extends string | undefined = TAbiEvent extends AbiEvent
    ? TAbiEvent["name"]
    : undefined,
  _AbiEvent extends AbiEvent | undefined = TAbi extends Abi
    ? TEventName extends string
      ? ExtractAbiEvent<TAbi, TEventName>
      : undefined
    : undefined,
  _Args = _AbiEvent extends AbiEvent
    ? AbiEventParametersToPrimitiveTypes<_AbiEvent["inputs"]>
    : never,
  _FailedToParseArgs =
    | ([_Args] extends [never] ? true : false)
    | (readonly unknown[] extends _Args ? true : false)
> = true extends _FailedToParseArgs
  ? [Hex, ...Hex[]] | []
  : TAbiEvent extends AbiEvent
  ? Topics<TAbiEvent["inputs"]>
  : _AbiEvent extends AbiEvent
  ? Topics<_AbiEvent["inputs"]>
  : [Hex, ...Hex[]] | [];

type GetInferredLogValues<
  TAbiEvent extends AbiEvent | undefined = undefined,
  TAbi extends Abi | readonly unknown[] | undefined = TAbiEvent extends AbiEvent
    ? [TAbiEvent]
    : undefined,
  TEventName extends string | undefined = TAbiEvent extends AbiEvent
    ? TAbiEvent["name"]
    : undefined,
  TStrict extends boolean | undefined = undefined,
  _EventNames extends string = TAbi extends Abi
    ? Abi extends TAbi
      ? string
      : ExtractAbiEventNames<TAbi>
    : string
> = TAbi extends Abi
  ? TEventName extends string
    ? {
        args: GetEventArgs<
          TAbi,
          TEventName,
          {
            EnableUnion: false;
            IndexedOnly: false;
            Required: TStrict extends boolean ? TStrict : false;
          }
        >;
        /** The event name decoded from `topics`. */
        eventName: TEventName;
        /** List of order-dependent topics */
        topics: GetTopics<TAbiEvent, TAbi, TEventName>;
      }
    : {
        [TName in _EventNames]: {
          args: GetEventArgs<
            TAbi,
            TName,
            {
              EnableUnion: false;
              IndexedOnly: false;
              Required: TStrict extends boolean ? TStrict : false;
            }
          >;
          /** The event name decoded from `topics`. */
          eventName: TName;
          /** List of order-dependent topics */
          topics: GetTopics<TAbiEvent, TAbi, TName>;
        };
      }[_EventNames]
  : {
      topics: [Hex, ...Hex[]] | [];
    };
