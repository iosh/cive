import { Abi, AbiEvent, ExtractAbiEvent } from "abitype";
import { Filter, FilterType } from "../../types/filter.js";
import { Log } from "../../types/log.js";
import {
  DecodeEventLogErrorType,
  FormatLogErrorType,
  Hash,
  Transport,
} from "viem";
import { RequestErrorType } from "viem/utils";
import { ErrorType } from "../../errors/utils.js";
import { Client } from "../../clients/createClient.js";
import { formatLog } from "../../utils/formatters/log.js";
import { RpcLog } from "../../types/rpc.js";
import { parseEventLogs } from "../../utils/abi/parseEventLogs.js";
import { Chain } from "../../types/chain.js";

export type GetFilterChangesParameters<
  TFilterType extends FilterType = FilterType,
  TAbi extends Abi | readonly unknown[] | undefined = undefined,
  TEventName extends string | undefined = undefined,
  TStrict extends boolean | undefined = undefined
> = {
  filter: Filter<TFilterType, TAbi, TEventName, any, TStrict>;
};

export type GetFilterChangesReturnType<
  TFilterType extends FilterType = FilterType,
  TAbi extends Abi | readonly unknown[] | undefined = undefined,
  TEventName extends string | undefined = undefined,
  TStrict extends boolean | undefined = undefined,
  _AbiEvent extends AbiEvent | undefined = TAbi extends Abi
    ? TEventName extends string
      ? ExtractAbiEvent<TAbi, TEventName>
      : undefined
    : undefined
> = TFilterType extends "event"
  ? Log<bigint, number, _AbiEvent, TStrict, TAbi, TEventName>[]
  : Hash[];

export type GetFilterChangesErrorType =
  | RequestErrorType
  | DecodeEventLogErrorType
  | FormatLogErrorType
  | ErrorType;

export async function getFilterChanges<
  TChain extends Chain | undefined,
  TFilterType extends FilterType,
  const TAbi extends Abi | readonly unknown[] | undefined,
  TEventName extends string | undefined,
  TStrict extends boolean | undefined = undefined
>(
  _: Client<Transport, TChain>,
  { filter }: GetFilterChangesParameters<TFilterType, TAbi, TEventName, TStrict>
): Promise<GetFilterChangesReturnType<TFilterType, TAbi, TEventName, TStrict>> {
  const strict = "strict" in filter && filter.strict;

  const logs = await filter.request({
    method: "cfx_getFilterChanges",
    params: [filter.id],
  });

  if (typeof logs[0] === "string")
    return logs as GetFilterChangesReturnType<
      TFilterType,
      TAbi,
      TEventName,
      TStrict
    >;

  const formattedLogs = logs.map((log) => formatLog(log as RpcLog));
  if (!("abi" in filter) || !filter.abi)
    return formattedLogs as GetFilterChangesReturnType<
      TFilterType,
      TAbi,
      TEventName,
      TStrict
    >;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict,
  }) as unknown as GetFilterChangesReturnType<
    TFilterType,
    TAbi,
    TEventName,
    TStrict
  >;
}
