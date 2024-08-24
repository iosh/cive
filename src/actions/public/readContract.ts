import type { BaseError, GetContractErrorReturnType } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { ChainIdNotFoundError } from '../../errors/chain.js'
import { getContractError } from '../../errors/getContractError.js'
import type { Abi } from '../../types/abitype.js'
import type { Chain } from '../../types/chain.js'
import type {
  ContractFunctionArgs,
  ContractFunctionName,
  ContractFunctionParameters,
  ContractFunctionReturnType,
} from '../../types/contract.js'
import type { UnionEvaluate } from '../../types/utils.js'
import { getAction } from '../../utils/getAction.js'
import {
  type DecodeFunctionResultErrorType,
  type EncodeFunctionDataErrorType,
  type EncodeFunctionDataParameters,
  decodeFunctionResult,
  encodeFunctionData,
} from '../../utils/index.js'
import { type CallErrorType, type CallParameters, call } from './call.js'

export type ReadContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    'pure' | 'view'
  > = ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<
    abi,
    'pure' | 'view',
    functionName
  > = ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
> = UnionEvaluate<
  Pick<CallParameters, 'account' | 'epochNumber' | 'epochTag'>
> &
  ContractFunctionParameters<abi, 'pure' | 'view', functionName, args, boolean>

export type ReadContractReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    'pure' | 'view'
  > = ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<
    abi,
    'pure' | 'view',
    functionName
  > = ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
> = ContractFunctionReturnType<abi, 'pure' | 'view', functionName, args>

export type ReadContractErrorType = GetContractErrorReturnType<
  CallErrorType | EncodeFunctionDataErrorType | DecodeFunctionResultErrorType
>

export async function readContract<
  chain extends Chain | undefined,
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
  const args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
>(
  client: Client<Transport, chain>,
  parameters: ReadContractParameters<abi, functionName, args>,
): Promise<ReadContractReturnType<abi, functionName, args>> {
  const { abi, address, args, functionName, ...rest } =
    parameters as ReadContractParameters
  const calldata = encodeFunctionData({
    abi,
    args,
    functionName,
  } as EncodeFunctionDataParameters)
  // TODO: update this
  if (typeof client.chain === 'undefined' || !('id' in client.chain)) {
    throw new ChainIdNotFoundError()
  }

  try {
    const { data } = await getAction(
      client,
      call,
      'call',
    )({
      ...(rest as CallParameters),
      data: calldata,
      to: address!,
    })
    return decodeFunctionResult({
      networkId: client.chain.id,
      abi,
      args,
      functionName,
      data: data || '0x',
    }) as ReadContractReturnType<abi, functionName>
  } catch (error) {
    throw getContractError(error as BaseError, {
      abi,
      address,
      args,
      docsPath: '/docs/contract/readContract',
      functionName,
    })
  }
}
