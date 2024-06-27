import type { Log } from '../../types/log.js'
import type { RpcLog } from '../../types/rpc.js'
import type { ExactPartial } from '../../types/utils.js'

export function formatLog(
  log: ExactPartial<RpcLog>,
  {
    args,
    eventName,
  }: { args?: unknown | undefined; eventName?: string | undefined } = {},
) {
  return {
    ...log,
    epochNumber: log.epochNumber ? BigInt(log.epochNumber) : null,
    transactionIndex: log.transactionIndex
      ? BigInt(log.transactionIndex)
      : null,
    logIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
    transactionLogIndex: log.transactionIndex
      ? BigInt(log.transactionIndex)
      : null,
    ...(eventName ? { args, eventName } : {}),
  } as Log
}
