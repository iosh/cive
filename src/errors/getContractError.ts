import { AbiDecodingZeroDataError, BaseError, InternalRpcError } from 'viem'
import type { Address } from '../accounts/types.js'
import type { Abi } from '../types/abitype.js'
import {
  ContractFunctionExecutionError,
  type ContractFunctionExecutionErrorType,
  ContractFunctionRevertedError,
  type ContractFunctionRevertedErrorType,
  ContractFunctionZeroDataError,
  type ContractFunctionZeroDataErrorType,
  RawContractError,
} from './contract.js'
import type { ErrorType } from './utils.js'

const EXECUTION_REVERTED_ERROR_CODE = 3

export type GetContractErrorReturnType<cause = ErrorType> = Omit<
  ContractFunctionExecutionErrorType,
  'cause'
> & {
  cause:
    | cause
    | ContractFunctionZeroDataErrorType
    | ContractFunctionRevertedErrorType
}

export function getContractError<err extends ErrorType<string>>(
  err: err,
  {
    abi,
    address,
    args,
    docsPath,
    functionName,
    sender,
  }: {
    abi: Abi
    args: any
    address?: Address | undefined
    docsPath?: string | undefined
    functionName: string
    sender?: Address | undefined
  },
): GetContractErrorReturnType {
  const { code, data, message, shortMessage } = (
    err instanceof RawContractError
      ? err
      : err instanceof BaseError
        ? err.walk((err) => 'data' in (err as Error)) || err.walk()
        : {}
  ) as RawContractError

  const cause = (() => {
    if (err instanceof AbiDecodingZeroDataError)
      return new ContractFunctionZeroDataError({ functionName })
    if (
      [EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) &&
      (data || message || shortMessage)
    ) {
      return new ContractFunctionRevertedError({
        abi,
        data: typeof data === 'object' ? data.data : data,
        functionName,
        message: shortMessage ?? message,
      })
    }
    return err
  })()

  return new ContractFunctionExecutionError(cause as BaseError, {
    abi,
    args,
    contractAddress: address,
    docsPath,
    functionName,
    sender,
  }) as GetContractErrorReturnType
}
