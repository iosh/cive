import type { Abi } from 'abitype'

import type { ContractConstructorArgs } from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'

import {
  AbiConstructorNotFoundError,
  type AbiConstructorNotFoundErrorType,
  AbiConstructorParamsNotFoundError,
  type AbiConstructorParamsNotFoundErrorType,
} from 'viem'
import type { ErrorType } from '../../errors/utils.js'
import {
  type DecodeAbiParametersErrorType,
  decodeAbiParameters,
} from './decodeAbiParameters.js'

const docsPath = '/docs/contract/decodeDeployData'

export type DecodeDeployDataParameters<
  abi extends Abi | readonly unknown[] = Abi,
> = {
  abi: abi
  bytecode: Hex
  data: Hex
}

export type DecodeDeployDataReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  ///
  allArgs = ContractConstructorArgs<abi>,
> = {
  bytecode: Hex
  args: allArgs
}

export type DecodeDeployDataErrorType =
  | AbiConstructorNotFoundErrorType
  | AbiConstructorParamsNotFoundErrorType
  | DecodeAbiParametersErrorType
  | ErrorType

export function decodeDeployData<const abi extends Abi | readonly unknown[]>(
  parameters: DecodeDeployDataParameters<abi> & {
    /**
     * need update. this should be only pass by decode address type
     */
    networkId: number
  },
): DecodeDeployDataReturnType<abi> {
  const { abi, bytecode, data, networkId } =
    parameters as DecodeDeployDataParameters & { networkId: number }
  if (data === bytecode) return { bytecode } as DecodeDeployDataReturnType<abi>

  const description = abi.find((x) => 'type' in x && x.type === 'constructor')
  if (!description) throw new AbiConstructorNotFoundError({ docsPath })
  if (!('inputs' in description))
    throw new AbiConstructorParamsNotFoundError({ docsPath })
  if (!description.inputs || description.inputs.length === 0)
    throw new AbiConstructorParamsNotFoundError({ docsPath })

  const args = decodeAbiParameters(
    description.inputs,
    `0x${data.replace(bytecode, '')}`,
    networkId,
  )
  return { args, bytecode } as unknown as DecodeDeployDataReturnType<abi>
}
