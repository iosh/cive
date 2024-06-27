import type { RpcTrace, RpcTraceBlock } from '../../types/rpc.js'
import type { TraceBlock } from '../../types/tract.js'
import type { ExactPartial } from '../../types/utils.js'

export function formatTract(
  trace: ExactPartial<RpcTrace>,
): TraceBlock['transactionTraces'][number]['traces'][number] {
  const result = {
    ...trace,
    epochNumber: trace?.epochNumber ? BigInt(trace.epochNumber) : undefined,
    transactionPosition: trace?.transactionPosition
      ? BigInt(trace.transactionPosition)
      : undefined,
  } as TraceBlock['transactionTraces'][number]['traces'][number]

  if ('value' in result.action) {
    result.action.value = BigInt(result.action.value)
  }

  if ('gas' in result.action) {
    result.action.gas = BigInt(result.action.gas)
  }
  if ('gasLeft' in result.action) {
    result.action.gasLeft = BigInt(result.action.gasLeft)
  }

  return result
}

export function formatTransactionTraces(
  transactionTraces: ExactPartial<RpcTraceBlock['transactionTraces'][number]>,
): TraceBlock['transactionTraces'][number] {
  const result = {
    ...transactionTraces,
    transactionPosition: transactionTraces?.transactionPosition
      ? BigInt(transactionTraces.transactionPosition)
      : undefined,
    traces: transactionTraces?.traces
      ? transactionTraces.traces.map(formatTract)
      : undefined,
  } as TraceBlock['transactionTraces'][number]

  return result
}

export function formatTraceBlock(
  block: ExactPartial<RpcTraceBlock>,
): TraceBlock {
  const result = {
    ...block,
    epochNumber: block?.epochNumber ? BigInt(block.epochNumber) : undefined,
    transactionTraces: block?.transactionTraces
      ? block.transactionTraces.map(formatTransactionTraces)
      : undefined,
  } as TraceBlock

  return result
}
