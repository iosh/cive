import type { BaseError } from 'viem'
import {
  type ParseAccountErrorType,
  parseAccount,
} from '../../accounts/index.js'
import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { ChainIdNotFoundError } from '../../errors/chain.js'
import {
  type GetContractErrorReturnType,
  getContractError,
} from '../../errors/getContractError.js'
import type { ErrorType } from '../../errors/utils.js'
import type {
  Abi,
  AbiFunction,
  AbiStateMutability,
  Address,
} from '../../types/abitype.js'
import type { ParseAccount } from '../../types/account.js'
import type { Chain, DeriveChain } from '../../types/chain.js'
import type {
  ContractFunctionArgs,
  ContractFunctionName,
  ContractFunctionParameters,
  ContractFunctionReturnType,
  ExtractAbiFunctionForArgs,
} from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type { TransactionRequest } from '../../types/transaction.js'
import type {
  IsNarrowable,
  Prettify,
  UnionEvaluate,
  UnionOmit,
} from '../../types/utils.js'
import { getAction } from '../../utils/getAction.js'
import {
  type DecodeFunctionResultErrorType,
  type EncodeFunctionDataErrorType,
  decodeFunctionResult,
  encodeFunctionData,
} from '../../utils/index.js'
import type { WriteContractParameters } from '../wallet/writeContract.js'
import { type CallErrorType, type CallParameters, call } from './call.js'

export type GetMutabilityAwareValue<
  abi extends Abi | readonly unknown[],
  mutability extends AbiStateMutability = AbiStateMutability,
  functionName extends ContractFunctionName<
    abi,
    mutability
  > = ContractFunctionName<abi, mutability>,
  valueType = TransactionRequest['value'],
  args extends ContractFunctionArgs<
    abi,
    mutability,
    functionName
  > = ContractFunctionArgs<abi, mutability, functionName>,
  abiFunction extends AbiFunction = abi extends Abi
    ? ExtractAbiFunctionForArgs<abi, mutability, functionName, args>
    : AbiFunction,
  _Narrowable extends boolean = IsNarrowable<abi, Abi>,
> = _Narrowable extends true
  ? abiFunction['stateMutability'] extends 'payable'
    ? { value?: NoInfer<valueType> | undefined }
    : abiFunction['payable'] extends true
      ? { value?: NoInfer<valueType> | undefined }
      : { value?: undefined }
  : { value?: NoInfer<valueType> | undefined }

export type SimulateContractParameters<
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
  chainOverride extends Chain | undefined = Chain | undefined,
  accountOverride extends Account | Address | undefined = undefined,
  ///
  derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = {
  account?: accountOverride | undefined
  chain?: chainOverride | undefined
  /** Data to append to the end of the calldata. Useful for adding a ["domain" tag](https://opensea.notion.site/opensea/Seaport-Order-Attributions-ec2d69bf455041a5baa490941aad307f). */
  dataSuffix?: Hex | undefined
} & ContractFunctionParameters<
  abi,
  'nonpayable' | 'payable',
  functionName,
  args
> &
  UnionOmit<
    CallParameters<derivedChain>,
    'account' | 'batch' | 'to' | 'data' | 'value'
  > &
  GetMutabilityAwareValue<
    abi,
    'nonpayable' | 'payable',
    functionName,
    CallParameters<derivedChain> extends CallParameters
      ? CallParameters<derivedChain>['value']
      : CallParameters['value'],
    args
  >

export type SimulateContractReturnType<
  out abi extends Abi | readonly unknown[] = Abi,
  in out functionName extends ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  > = ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  in out args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  > = ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
  /** @ts-expect-error cast variance */
  out chain extends Chain | undefined = Chain | undefined,
  out account extends Account | undefined = Account | undefined,
  out chainOverride extends Chain | undefined = Chain | undefined,
  out accountOverride extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
  ///
  in out minimizedAbi extends Abi = readonly [
    ExtractAbiFunctionForArgs<
      abi extends Abi ? abi : Abi,
      'nonpayable' | 'payable',
      functionName,
      args
    >,
  ],
  out resolvedAccount extends Account | undefined = accountOverride extends
    | Account
    | Address
    ? ParseAccount<accountOverride>
    : account,
> = {
  result: ContractFunctionReturnType<
    minimizedAbi,
    'nonpayable' | 'payable',
    functionName,
    args
  >
  request: Prettify<
    UnionEvaluate<
      UnionOmit<
        WriteContractParameters<
          minimizedAbi,
          functionName,
          args,
          chain,
          undefined,
          chainOverride
        >,
        'account' | 'abi' | 'args' | 'chain' | 'functionName'
      >
    > &
      ContractFunctionParameters<
        minimizedAbi,
        'nonpayable' | 'payable',
        functionName,
        args
      > & {
        chain: DeriveChain<chain, chainOverride>
      } & (resolvedAccount extends Account
        ? { account: resolvedAccount }
        : { account?: undefined })
  >
}

export type SimulateContractErrorType =
  | ParseAccountErrorType
  | EncodeFunctionDataErrorType
  | GetContractErrorReturnType<CallErrorType | DecodeFunctionResultErrorType>
  | ErrorType

export async function simulateContract<
  chain extends Chain | undefined,
  account extends Account | undefined,
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  const args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  >,
  chainOverride extends Chain | undefined = undefined,
  accountOverride extends Account | Address | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SimulateContractParameters<
    abi,
    functionName,
    args,
    chain,
    chainOverride,
    accountOverride
  >,
): Promise<
  SimulateContractReturnType<
    abi,
    functionName,
    args,
    chain,
    account,
    chainOverride,
    accountOverride
  >
> {
  const { abi, address, args, dataSuffix, functionName, ...callRequest } =
    parameters as SimulateContractParameters

  const account = callRequest.account
    ? parseAccount(callRequest.account)
    : client.account
  const calldata = encodeFunctionData({ abi, args, functionName })
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
      batch: false,
      data: `${calldata}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
      to: address,
      ...callRequest,
      account,
    })
    const result = decodeFunctionResult({
      networkId: client.chain.id,
      abi,
      args,
      functionName,
      data: data || '0x',
    })
    const minimizedAbi = abi.filter(
      (abiItem) =>
        'name' in abiItem && abiItem.name === parameters.functionName,
    )
    return {
      result,
      request: {
        abi: minimizedAbi,
        address,
        args,
        dataSuffix,
        functionName,
        ...callRequest,
        account,
      },
    } as unknown as SimulateContractReturnType<
      abi,
      functionName,
      args,
      chain,
      account,
      chainOverride,
      accountOverride
    >
  } catch (error) {
    throw getContractError(error as BaseError, {
      abi,
      address,
      args,
      docsPath: '/docs/contract/simulateContract',
      functionName,
      sender: account?.address,
    })
  }
}
