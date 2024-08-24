import type { DecodeEventLogErrorType, FormatLogErrorType, Hash } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { ChainIdNotFoundError } from '../../errors/chain.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Abi, AbiEvent, ExtractAbiEvent } from '../../types/abitype.js'
import type { Chain } from '../../types/chain.js'
import type { Filter, FilterType } from '../../types/filter.js'
import type { Log } from '../../types/log.js'
import type { RpcLog } from '../../types/rpc.js'
import { parseEventLogs } from '../../utils/abi/parseEventLogs.js'
import { formatLog } from '../../utils/formatters/log.js'

export type GetFilterChangesParameters<
  TFilterType extends FilterType = FilterType,
  TAbi extends Abi | readonly unknown[] | undefined = undefined,
  TEventName extends string | undefined = undefined,
  TStrict extends boolean | undefined = undefined,
> = {
  filter: Filter<TFilterType, TAbi, TEventName, any, TStrict>
}

export type GetFilterChangesReturnType<
  TFilterType extends FilterType = FilterType,
  TAbi extends Abi | readonly unknown[] | undefined = undefined,
  TEventName extends string | undefined = undefined,
  TStrict extends boolean | undefined = undefined,
  _AbiEvent extends AbiEvent | undefined = TAbi extends Abi
    ? TEventName extends string
      ? ExtractAbiEvent<TAbi, TEventName>
      : undefined
    : undefined,
> = TFilterType extends 'event'
  ? Log<bigint, number, _AbiEvent, TStrict, TAbi, TEventName>[]
  : Hash[]

export type GetFilterChangesErrorType =
  | RequestErrorType
  | DecodeEventLogErrorType
  | FormatLogErrorType
  | ErrorType

export async function getFilterChanges<
  TChain extends Chain | undefined,
  TFilterType extends FilterType,
  const TAbi extends Abi | readonly unknown[] | undefined,
  TEventName extends string | undefined,
  TStrict extends boolean | undefined = undefined,
>(
  client: Client<Transport, TChain>,
  {
    filter,
  }: GetFilterChangesParameters<TFilterType, TAbi, TEventName, TStrict>,
): Promise<GetFilterChangesReturnType<TFilterType, TAbi, TEventName, TStrict>> {
  const strict = 'strict' in filter && filter.strict
  // TODO: update this
  if (typeof client.chain === 'undefined' || !('id' in client.chain)) {
    throw new ChainIdNotFoundError()
  }
  const logs = await filter.request({
    method: 'cfx_getFilterChanges',
    params: [filter.id],
  })

  if (typeof logs[0] === 'string')
    return logs as GetFilterChangesReturnType<
      TFilterType,
      TAbi,
      TEventName,
      TStrict
    >

  const formattedLogs = logs.map((log) => formatLog(log as RpcLog))
  if (!('abi' in filter) || !filter.abi)
    return formattedLogs as GetFilterChangesReturnType<
      TFilterType,
      TAbi,
      TEventName,
      TStrict
    >
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict,
    networkId: client.chain.id,
  }) as unknown as GetFilterChangesReturnType<
    TFilterType,
    TAbi,
    TEventName,
    TStrict
  >
}
