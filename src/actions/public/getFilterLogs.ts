import type { Abi, AbiEvent, ExtractAbiEvent } from 'abitype'
import type {
  DecodeEventLogErrorType,
  FormatLogErrorType,
  Transport,
} from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Filter } from '../../types/filter.js'
import type { Log } from '../../types/log.js'
import { formatLog } from '../../utils/formatters/log.js'

import type { Chain } from '../../types/chain.js'
import { parseEventLogs } from '../../utils/abi/parseEventLogs.js'
export type GetFilterLogsParameters<
  TAbi extends Abi | readonly unknown[] | undefined = undefined,
  TEventName extends string | undefined = undefined,
  TStrict extends boolean | undefined = undefined,
> = {
  filter: Filter<'event', TAbi, TEventName, any, TStrict>
}
export type GetFilterLogsReturnType<
  TAbi extends Abi | readonly unknown[] | undefined = undefined,
  TEventName extends string | undefined = undefined,
  TStrict extends boolean | undefined = undefined,
  _AbiEvent extends AbiEvent | undefined = TAbi extends Abi
    ? TEventName extends string
      ? ExtractAbiEvent<TAbi, TEventName>
      : undefined
    : undefined,
> = Log<bigint, number, _AbiEvent, TStrict, TAbi, TEventName>[]

export type GetFilterLogsErrorType =
  | RequestErrorType
  | DecodeEventLogErrorType
  | FormatLogErrorType
  | ErrorType

export async function getFilterLogs<
  TChain extends Chain | undefined,
  const TAbi extends Abi | readonly unknown[] | undefined,
  TEventName extends string | undefined,
  TStrict extends boolean | undefined = undefined,
>(
  _client: Client<Transport, TChain>,
  { filter }: GetFilterLogsParameters<TAbi, TEventName, TStrict>,
): Promise<GetFilterLogsReturnType<TAbi, TEventName, TStrict>> {
  const strict = filter.strict ?? false

  const logs = await filter.request({
    method: 'cfx_getFilterLogs',
    params: [filter.id],
  })

  const formattedLogs = logs.map((log) => formatLog(log))
  if (!filter.abi)
    return formattedLogs as GetFilterLogsReturnType<TAbi, TEventName, TStrict>
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict,
  }) as unknown as GetFilterLogsReturnType<TAbi, TEventName, TStrict>
}
