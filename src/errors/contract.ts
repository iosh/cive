import type { Abi, Address } from '../types/abitype.js'

import { parseAccount } from '../accounts/utils/parseAccount.js'
import type { CallParameters } from '../actions/public/call.js'

import {
  AbiErrorSignatureNotFoundError,
  BaseError,
  type DecodeErrorResultReturnType,
  decodeErrorResult,
  getAbiItem,
} from 'viem'
import { formatAbiItem, formatAbiItemWithArgs } from 'viem/utils'
import { panicReasons } from '../constants/solidity.js'
import type { Chain } from '../types/chain.js'
import type { Hex } from '../types/misc.js'
import { formatCFX } from '../utils/unit/formatCFX.js'
import { formatGDrip } from '../utils/unit/formatGDrip.js'
import { prettyPrint } from './transaction.js'

export type CallExecutionErrorType = CallExecutionError & {
  name: 'CallExecutionError'
}
export class CallExecutionError extends BaseError {
  override cause: BaseError

  override name = 'CallExecutionError'

  constructor(
    cause: BaseError,
    {
      account: account_,
      docsPath,
      chain,
      data,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value,
    }: CallParameters & {
      chain?: Chain | undefined
      docsPath?: string | undefined
    },
  ) {
    const account = account_ ? parseAccount(account_) : undefined
    const prettyArgs = prettyPrint({
      from: account?.address,
      to,
      value:
        typeof value !== 'undefined' &&
        `${formatCFX(value)} ${chain?.nativeCurrency?.symbol || 'CFX'}`,
      data,
      gas,
      gasPrice:
        typeof gasPrice !== 'undefined' && `${formatGDrip(gasPrice)} gdrip`,
      maxFeePerGas:
        typeof maxFeePerGas !== 'undefined' &&
        `${formatGDrip(maxFeePerGas)} gdrip`,
      maxPriorityFeePerGas:
        typeof maxPriorityFeePerGas !== 'undefined' &&
        `${formatGDrip(maxPriorityFeePerGas)} gdrip`,
      nonce,
    })

    super(cause.shortMessage, {
      cause,
      docsPath,
      metaMessages: [
        ...(cause.metaMessages ? [...cause.metaMessages, ' '] : []),
        'Raw Call Arguments:',
        prettyArgs,
      ].filter(Boolean) as string[],
    })
    this.cause = cause
  }
}

export type ContractFunctionExecutionErrorType =
  ContractFunctionExecutionError & {
    name: 'ContractFunctionExecutionError'
  }
export class ContractFunctionExecutionError extends BaseError {
  abi: Abi
  args?: unknown[] | undefined
  override cause: BaseError
  contractAddress?: Address | undefined
  formattedArgs?: string | undefined
  functionName: string
  sender?: Address | undefined

  override name = 'ContractFunctionExecutionError'

  constructor(
    cause: BaseError,
    {
      abi,
      args,
      contractAddress,
      docsPath,
      functionName,
      sender,
    }: {
      abi: Abi
      args?: any | undefined
      contractAddress?: Address | undefined
      docsPath?: string | undefined
      functionName: string
      sender?: Address | undefined
    },
  ) {
    const abiItem = getAbiItem({ abi, args, name: functionName })
    const formattedArgs = abiItem
      ? formatAbiItemWithArgs({
          abiItem,
          args,
          includeFunctionName: false,
          includeName: false,
        })
      : undefined
    const functionWithParams = abiItem
      ? formatAbiItem(abiItem, { includeName: true })
      : undefined

    const prettyArgs = prettyPrint({
      address: contractAddress && contractAddress,
      function: functionWithParams,
      args:
        formattedArgs &&
        formattedArgs !== '()' &&
        `${[...Array(functionName?.length ?? 0).keys()]
          .map(() => ' ')
          .join('')}${formattedArgs}`,
      sender,
    })

    super(
      cause.shortMessage ||
        `An unknown error occurred while executing the contract function "${functionName}".`,
      {
        cause,
        docsPath,
        metaMessages: [
          ...(cause.metaMessages ? [...cause.metaMessages, ' '] : []),
          'Contract Call:',
          prettyArgs,
        ].filter(Boolean) as string[],
      },
    )
    this.abi = abi
    this.args = args
    this.cause = cause
    this.contractAddress = contractAddress
    this.functionName = functionName
    this.sender = sender
  }
}

export type ContractFunctionRevertedErrorType =
  ContractFunctionRevertedError & {
    name: 'ContractFunctionRevertedError'
  }
export class ContractFunctionRevertedError extends BaseError {
  override name = 'ContractFunctionRevertedError'

  data?: DecodeErrorResultReturnType | undefined
  reason?: string | undefined
  signature?: Hex | undefined

  constructor({
    abi,
    data,
    functionName,
    message,
  }: {
    abi: Abi
    data?: Hex | undefined
    functionName: string
    message?: string | undefined
  }) {
    let cause: Error | undefined
    let decodedData: DecodeErrorResultReturnType | undefined = undefined
    let metaMessages: string[] | undefined
    let reason: string | undefined
    if (data && data !== '0x') {
      try {
        decodedData = decodeErrorResult({ abi, data })
        const { abiItem, errorName, args: errorArgs } = decodedData
        if (errorName === 'Error') {
          reason = (errorArgs as [string])[0]
        } else if (errorName === 'Panic') {
          const [firstArg] = errorArgs as [number]
          reason = panicReasons[firstArg as keyof typeof panicReasons]
        } else {
          const errorWithParams = abiItem
            ? formatAbiItem(abiItem, { includeName: true })
            : undefined
          const formattedArgs =
            abiItem && errorArgs
              ? formatAbiItemWithArgs({
                  abiItem,
                  args: errorArgs,
                  includeFunctionName: false,
                  includeName: false,
                })
              : undefined

          metaMessages = [
            errorWithParams ? `Error: ${errorWithParams}` : '',
            formattedArgs && formattedArgs !== '()'
              ? `       ${[...Array(errorName?.length ?? 0).keys()]
                  .map(() => ' ')
                  .join('')}${formattedArgs}`
              : '',
          ]
        }
      } catch (err) {
        cause = err as Error
      }
    } else if (message) reason = message

    let signature: Hex | undefined
    if (cause instanceof AbiErrorSignatureNotFoundError) {
      signature = cause.signature
      metaMessages = [
        `Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
        'Make sure you are using the correct ABI and that the error exists on it.',
        `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`,
      ]
    }

    super(
      (reason && reason !== 'execution reverted') || signature
        ? [
            `The contract function "${functionName}" reverted with the following ${
              signature ? 'signature' : 'reason'
            }:`,
            reason || signature,
          ].join('\n')
        : `The contract function "${functionName}" reverted.`,
      {
        cause,
        metaMessages,
      },
    )

    this.data = decodedData
    this.reason = reason
    this.signature = signature
  }
}

export type ContractFunctionZeroDataErrorType =
  ContractFunctionZeroDataError & {
    name: 'ContractFunctionZeroDataError'
  }
export class ContractFunctionZeroDataError extends BaseError {
  override name = 'ContractFunctionZeroDataError'
  constructor({ functionName }: { functionName: string }) {
    super(`The contract function "${functionName}" returned no data ("0x").`, {
      metaMessages: [
        'This could be due to any of the following:',
        `  - The contract does not have the function "${functionName}",`,
        '  - The parameters passed to the contract function may be invalid, or',
        '  - The address is not a contract.',
      ],
    })
  }
}

export type CounterfactualDeploymentFailedErrorType =
  CounterfactualDeploymentFailedError & {
    name: 'CounterfactualDeploymentFailedError'
  }
export class CounterfactualDeploymentFailedError extends BaseError {
  override name = 'CounterfactualDeploymentFailedError'
  constructor({ factory }: { factory?: Address | undefined }) {
    super(
      `Deployment for counterfactual contract call failed${
        factory ? ` for factory "${factory}".` : ''
      }`,
      {
        metaMessages: [
          'Please ensure:',
          '- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).',
          '- The `factoryData` is a valid encoded function call for contract deployment function on the factory.',
        ],
      },
    )
  }
}

export type RawContractErrorType = RawContractError & {
  name: 'RawContractError'
}
export class RawContractError extends BaseError {
  code = 3
  override name = 'RawContractError'

  data?: Hex | { data?: Hex | undefined } | undefined

  constructor({
    data,
    message,
  }: {
    data?: Hex | { data?: Hex | undefined } | undefined
    message?: string | undefined
  }) {
    super(message || '')
    this.data = data
  }
}
