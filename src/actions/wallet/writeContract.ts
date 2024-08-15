import type { Abi } from '../../types/abitype.js'

import type { Transport } from 'viem'
import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { GetAccountParameter } from '../../types/account.js'
import type {
  Chain,
  DeriveChain,
  GetChainParameter,
} from '../../types/chain.js'
import type {
  ContractFunctionArgs,
  ContractFunctionName,
  ContractFunctionParameters,
  GetValue,
} from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type { Prettify, UnionEvaluate, UnionOmit } from '../../types/utils.js'
import {
  type EncodeFunctionDataErrorType,
  type EncodeFunctionDataParameters,
  encodeFunctionData,
} from '../../utils/abi/encodeFunctionData.js'
import type { FormattedTransactionRequest } from '../../utils/formatters/transactionRequest.js'
import { getAction } from '../../utils/getAction.js'
import type { GetMutabilityAwareValue } from '../public/simulateContract.js'
import {
  type SendTransactionErrorType,
  type SendTransactionReturnType,
  sendTransaction,
} from './sendTransaction.js'

export type WriteContractParameters<
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
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  ///
  allFunctionNames = ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = ContractFunctionParameters<
  abi,
  'nonpayable' | 'payable',
  functionName,
  args,
  false,
  allFunctionNames
> &
  GetChainParameter<chain, chainOverride> &
  Prettify<
    GetAccountParameter<account> &
      GetMutabilityAwareValue<
        abi,
        'nonpayable' | 'payable',
        functionName,
        FormattedTransactionRequest<derivedChain>['value'],
        args
      > & {
        /** Data to append to the end of the calldata. Useful for adding a ["domain" tag](https://opensea.notion.site/opensea/Seaport-Order-Attributions-ec2d69bf455041a5baa490941aad307f). */
        dataSuffix?: Hex | undefined
      }
  > &
  UnionEvaluate<
    UnionOmit<
      FormattedTransactionRequest<derivedChain>,
      'data' | 'from' | 'to' | 'value'
    >
  >

export type WriteContractReturnType = SendTransactionReturnType

export type WriteContractErrorType =
  | EncodeFunctionDataErrorType
  | SendTransactionErrorType
  | ErrorType

export async function writeContract<
  chain extends Chain | undefined,
  account extends Account | undefined,
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  >,
  chainOverride extends Chain | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: WriteContractParameters<
    abi,
    functionName,
    args,
    chain,
    account,
    chainOverride
  >,
): Promise<WriteContractReturnType> {
  const { abi, address, args, dataSuffix, functionName, ...request } =
    parameters as WriteContractParameters
  const data = encodeFunctionData({
    abi,
    args,
    functionName,
  } as EncodeFunctionDataParameters)
  return getAction(
    client,
    sendTransaction,
    'sendTransaction',
  )({
    data: `${data}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
    to: address,
    ...request,
  })
}
