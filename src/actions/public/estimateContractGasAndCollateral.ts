import type { EstimateGasErrorType, Transport } from 'viem'
import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import {
  type GetContractErrorReturnType,
  getContractError,
} from '../../errors/getContractError.js'
import type { Abi } from '../../types/abitype.js'
import type { BaseError } from '../../types/abitype/errors.js'
import type { Chain } from '../../types/chain.js'
import type {
  ContractFunctionArgs,
  ContractFunctionName,
  ContractFunctionParameters,
  GetValue,
} from '../../types/contract.js'
import type { UnionOmit } from '../../types/utils.js'
import { getAction } from '../../utils/getAction.js'
import {
  type EncodeFunctionDataErrorType,
  type EncodeFunctionDataParameters,
  type ParseAccountErrorType,
  encodeFunctionData,
  parseAccount,
} from '../../utils/index.js'
import {
  type EstimateGasAndCollateralParameters,
  type EstimateGasAndCollateralReturnType,
  estimateGasAndCollateral,
} from './estimateGasAndCollateral.js'

export type EstimateContractGasAndCollateralParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  > = ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  > = ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
  chain extends Chain | undefined = Chain | undefined,
> = ContractFunctionParameters<
  abi,
  'nonpayable' | 'payable',
  functionName,
  args
> &
  UnionOmit<
    EstimateGasAndCollateralParameters<chain>,
    'data' | 'to' | 'value'
  > &
  GetValue<
    abi,
    functionName,
    EstimateGasAndCollateralParameters<chain> extends EstimateGasAndCollateralParameters
      ? EstimateGasAndCollateralParameters<chain>['value']
      : EstimateGasAndCollateralParameters['value']
  >

export type EstimateContractGasAndCollateralReturnType =
  EstimateGasAndCollateralReturnType

export type EstimateContractGasAndCollateralErrorType =
  GetContractErrorReturnType<
    EncodeFunctionDataErrorType | EstimateGasErrorType | ParseAccountErrorType
  >

export async function estimateContractGasAndCollateral<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: EstimateContractGasAndCollateralParameters<
    abi,
    functionName,
    args,
    chain
  >,
): Promise<EstimateContractGasAndCollateralReturnType> {
  const { abi, address, args, functionName, ...request } =
    parameters as EstimateContractGasAndCollateralParameters
  const data = encodeFunctionData({
    abi,
    args,
    functionName,
  } as EncodeFunctionDataParameters)
  try {
    const gas = await getAction(
      client,
      estimateGasAndCollateral,
      'estimateGasAndCollateral',
    )({
      data,
      to: address,
      ...request,
    } as unknown as EstimateGasAndCollateralParameters)
    return gas
  } catch (error) {
    const account = request.account ? parseAccount(request.account) : undefined
    throw getContractError(error as BaseError, {
      abi,
      address,
      args,
      docsPath: '/docs/contract/estimateContractGas',
      functionName,
      sender: account?.address,
    })
  }
}
