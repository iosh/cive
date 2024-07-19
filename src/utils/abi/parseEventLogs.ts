import {
  AbiEventSignatureNotFoundError,
  type DecodeEventLogErrorType,
  DecodeLogDataMismatch,
  DecodeLogTopicsMismatch,
  decodeEventLog,
} from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import type { Abi } from '../../types/abitype.js'
import type { ContractEventName } from '../../types/contract.js'
import type { Log } from '../../types/log.js'
import type { RpcLog } from '../../types/rpc.js'

export type ParseEventLogsParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends
    | ContractEventName<abi>
    | ContractEventName<abi>[]
    | undefined = ContractEventName<abi>,
  strict extends boolean | undefined = boolean | undefined,
> = {
  /** Contract ABI. */
  abi: abi
  /** Contract event. */
  eventName?:
    | eventName
    | ContractEventName<abi>
    | ContractEventName<abi>[]
    | undefined
  /** List of logs. */
  logs: (Log | RpcLog)[]
  strict?: strict | boolean | undefined
}

export type ParseEventLogsReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends
    | ContractEventName<abi>
    | ContractEventName<abi>[]
    | undefined = ContractEventName<abi>,
  strict extends boolean | undefined = boolean | undefined,
  ///
  derivedEventName extends
    | ContractEventName<abi>
    | undefined = eventName extends ContractEventName<abi>[]
    ? eventName[number]
    : eventName,
> = Log<bigint, number, undefined, strict, abi, derivedEventName>[]

export type ParseEventLogsErrorType = DecodeEventLogErrorType | ErrorType

export function parseEventLogs<
  abi extends Abi | readonly unknown[],
  strict extends boolean | undefined = true,
  eventName extends
    | ContractEventName<abi>
    | ContractEventName<abi>[]
    | undefined = undefined,
>({
  abi,
  eventName,
  logs,
  strict = true,
}: ParseEventLogsParameters<abi, eventName, strict>): ParseEventLogsReturnType<
  abi,
  eventName,
  strict
> {
  return logs
    .map((log) => {
      try {
        const event = decodeEventLog({
          ...log,
          abi,
          strict,
        })
        if (eventName && !eventName.includes(event.eventName!)) return null
        return { ...event, ...log }
      } catch (err) {
        let eventName: string | undefined
        let isUnnamed: boolean | undefined

        if (err instanceof AbiEventSignatureNotFoundError) return null
        if (
          err instanceof DecodeLogDataMismatch ||
          err instanceof DecodeLogTopicsMismatch
        ) {
          // If strict mode is on, and log data/topics do not match event definition, skip.
          if (strict) return null
          eventName = err.abiItem.name
          isUnnamed = err.abiItem.inputs?.some((x) => !('name' in x && x.name))
        }

        // Set args to empty if there is an error decoding (e.g. indexed/non-indexed params mismatch).
        return { ...log, args: isUnnamed ? [] : {}, eventName }
      }
    })
    .filter(Boolean) as unknown as ParseEventLogsReturnType<
    abi,
    eventName,
    strict
  >
}
