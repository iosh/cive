import type { Abi, AbiStateMutability } from '../../types/abitype.js'

import type { ErrorType } from '../../errors/utils.js'
import type {
  ContractFunctionArgs,
  ContractFunctionName,
} from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type { IsNarrowable, UnionEvaluate } from '../../types/utils.js'

import {
  type DecodeAbiParametersErrorType,
  decodeAbiParameters,
} from './decodeAbiParameters.js'
import {
  AbiFunctionSignatureNotFoundError,
  slice,
  toFunctionSelector,
  type SliceErrorType,
  type ToFunctionSelectorErrorType,
} from 'viem'
import { formatAbiItem, type FormatAbiItemErrorType } from 'viem/utils'

export type DecodeFunctionDataParameters<
  abi extends Abi | readonly unknown[] = Abi,
> = {
  abi: abi
  data: Hex
} & {
  /**
   * need update. this should be only pass by decode address type
   */
  networkId: number
}

export type DecodeFunctionDataReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  ///
  allFunctionNames extends
    ContractFunctionName<abi> = ContractFunctionName<abi>,
> = IsNarrowable<abi, Abi> extends true
  ? UnionEvaluate<
      {
        [functionName in allFunctionNames]: {
          args: ContractFunctionArgs<abi, AbiStateMutability, functionName>
          functionName: functionName
        }
      }[allFunctionNames]
    >
  : {
      args: readonly unknown[] | undefined
      functionName: string
    }

export type DecodeFunctionDataErrorType =
  | AbiFunctionSignatureNotFoundError
  | DecodeAbiParametersErrorType
  | FormatAbiItemErrorType
  | ToFunctionSelectorErrorType
  | SliceErrorType
  | ErrorType

export function decodeFunctionData<const abi extends Abi | readonly unknown[]>(
  parameters: DecodeFunctionDataParameters<abi>,
) {
  const { abi, data, networkId } = parameters as DecodeFunctionDataParameters
  const signature = slice(data, 0, 4)
  const description = abi.find(
    (x) =>
      x.type === 'function' &&
      signature === toFunctionSelector(formatAbiItem(x)),
  )
  if (!description)
    throw new AbiFunctionSignatureNotFoundError(signature, {
      docsPath: '/docs/contract/decodeFunctionData',
    })
  return {
    functionName: (description as { name: string }).name,
    args: ('inputs' in description &&
    description.inputs &&
    description.inputs.length > 0
      ? decodeAbiParameters(description.inputs, slice(data, 4), networkId)
      : undefined) as readonly unknown[] | undefined,
  } as DecodeFunctionDataReturnType<abi>
}