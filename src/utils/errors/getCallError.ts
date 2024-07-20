import {
  type BaseError,
  type CallExecutionErrorType,
  UnknownNodeError,
} from 'viem'
import type { CallParameters } from '../../actions/public/call.js'

import {
  type GetNodeErrorParameters,
  type GetNodeErrorReturnType,
  getNodeError,
} from 'viem/utils'
import { CallExecutionError } from '../../errors/contract.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'

export type GetCallErrorReturnType<cause = ErrorType> = Omit<
  CallExecutionErrorType,
  'cause'
> & {
  cause: cause | GetNodeErrorReturnType
}

export function getCallError<err extends ErrorType<string>>(
  err: err,
  {
    docsPath,
    ...args
  }: CallParameters & {
    chain?: Chain | undefined
    docsPath?: string | undefined
  },
): GetCallErrorReturnType<err> {
  const cause = (() => {
    const cause = getNodeError(
      err as {} as BaseError,
      args as GetNodeErrorParameters,
    )
    if (cause instanceof UnknownNodeError) return err as {} as BaseError
    return cause
  })()
  return new CallExecutionError(cause, {
    docsPath,
    ...args,
  }) as GetCallErrorReturnType<err>
}
