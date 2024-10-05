import { AbiDecodingZeroDataError } from 'viem'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { multicall3Abi } from '../../constants/abis.js'
import { RawContractError } from '../../errors/contract.js'
import {
  type GetContractErrorReturnType,
  getContractError,
} from '../../errors/getContractError.js'
import type { ErrorType } from '../../errors/utils.js'
import type { AbiStateMutability, Narrow } from '../../types/abitype.js'
import { BaseError } from '../../types/abitype/errors.js'
import type { Chain } from '../../types/chain.js'
import type { ContractFunctionParameters } from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type {
  MulticallContracts,
  MulticallResults,
} from '../../types/multicall.js'
import {
  type GetChainContractAddressErrorType,
  getChainContractAddress,
} from '../../utils/chain/getChainContractAddress.js'
import { getAction } from '../../utils/getAction.js'
import {
  type DecodeFunctionResultErrorType,
  type EncodeFunctionDataErrorType,
  decodeFunctionResult,
  encodeFunctionData,
} from '../../utils/index.js'
import type { CallParameters } from './call.js'
import { type ReadContractErrorType, readContract } from './readContract.js'
export type MulticallParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  options extends {
    optional?: boolean
    properties?: Record<string, any>
  } = {},
> = Pick<CallParameters, 'epochNumber' | 'epochTag' | 'storageLimit'> & {
  allowFailure?: allowFailure | boolean | undefined
  batchSize?: number | undefined
  contracts: MulticallContracts<
    Narrow<contracts>,
    { mutability: AbiStateMutability } & options
  >
  multicallAddress?: Address | undefined
}

export type MulticallReturnType<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  options extends {
    error?: Error
  } = { error: Error },
> = MulticallResults<
  Narrow<contracts>,
  allowFailure,
  { mutability: AbiStateMutability } & options
>

export type MulticallErrorType =
  | GetChainContractAddressErrorType
  | ReadContractErrorType
  | GetContractErrorReturnType<
      EncodeFunctionDataErrorType | DecodeFunctionResultErrorType
    >
  | ErrorType

export async function multicall<
  const contracts extends readonly unknown[],
  chain extends Chain | undefined,
  allowFailure extends boolean = true,
>(
  client: Client<Transport, chain>,
  parameters: MulticallParameters<contracts, allowFailure>,
): Promise<MulticallReturnType<contracts, allowFailure>> {
  const {
    allowFailure = true,
    batchSize: batchSize_,
    epochNumber,
    epochTag,
    multicallAddress: multicallAddress_,
  } = parameters
  const contracts = parameters.contracts as ContractFunctionParameters[]

  const batchSize =
    batchSize_ ??
    ((typeof client.batch?.multicall === 'object' &&
      client.batch.multicall.batchSize) ||
      1_024)

  let multicallAddress = multicallAddress_
  if (!multicallAddress) {
    if (!client.chain)
      throw new Error(
        'client chain not configured. multicallAddress is required.',
      )

    multicallAddress = getChainContractAddress({
      epochNumber,
      chain: client.chain,
      contract: 'multicall3',
    })
  }

  type Aggregate3Calls = {
    allowFailure: boolean
    callData: Hex
    target: Address
  }[]

  const chunkedCalls: Aggregate3Calls[] = [[]]
  let currentChunk = 0
  let currentChunkSize = 0
  for (let i = 0; i < contracts.length; i++) {
    const { abi, address, args, functionName } = contracts[i]
    try {
      const callData = encodeFunctionData({ abi, args, functionName })

      currentChunkSize += (callData.length - 2) / 2
      // Check to see if we need to create a new chunk.
      if (
        // Check if batching is enabled.
        batchSize > 0 &&
        // Check if the current size of the batch exceeds the size limit.
        currentChunkSize > batchSize &&
        // Check if the current chunk is not already empty.
        chunkedCalls[currentChunk].length > 0
      ) {
        currentChunk++
        currentChunkSize = (callData.length - 2) / 2
        chunkedCalls[currentChunk] = []
      }

      chunkedCalls[currentChunk] = [
        ...chunkedCalls[currentChunk],
        {
          allowFailure: true,
          callData,
          target: address,
        },
      ]
    } catch (err) {
      const error = getContractError(err as BaseError, {
        abi,
        address,
        args,
        docsPath: '/docs/contract/multicall',
        functionName,
      })
      if (!allowFailure) throw error
      chunkedCalls[currentChunk] = [
        ...chunkedCalls[currentChunk],
        {
          allowFailure: true,
          callData: '0x' as Hex,
          target: address,
        },
      ]
    }
  }

  const aggregate3Results = await Promise.allSettled(
    chunkedCalls.map((calls) =>
      getAction(
        client,
        readContract,
        'readContract',
      )({
        abi: multicall3Abi,
        address: multicallAddress!,
        args: [calls],
        epochNumber,
        epochTag,
        functionName: 'aggregate3',
      }),
    ),
  )

  const results = []
  for (let i = 0; i < aggregate3Results.length; i++) {
    const result = aggregate3Results[i]

    // If an error occurred in a `readContract` invocation (ie. network error),
    // then append the failure reason to each contract result.
    if (result.status === 'rejected') {
      if (!allowFailure) throw result.reason
      for (let j = 0; j < chunkedCalls[i].length; j++) {
        results.push({
          status: 'failure',
          error: result.reason,
          result: undefined,
        })
      }
      continue
    }

    // If the `readContract` call was successful, then decode the results.
    const aggregate3Result = result.value
    for (let j = 0; j < aggregate3Result.length; j++) {
      // Extract the response from `readContract`
      const { returnData, success } = aggregate3Result[j]

      // Extract the request call data from the original call.
      const { callData } = chunkedCalls[i][j]

      // Extract the contract config for this call from the `contracts` argument
      // for decoding.
      const { abi, address, functionName, args } = contracts[
        results.length
      ] as ContractFunctionParameters

      try {
        if (callData === '0x') throw new AbiDecodingZeroDataError()
        if (!success) throw new RawContractError({ data: returnData })
        const result = decodeFunctionResult({
          abi,
          args,
          data: returnData,
          functionName,
          networkId: client.chain!.id,
        })
        results.push(allowFailure ? { result, status: 'success' } : result)
      } catch (err) {
        const error = getContractError(err as BaseError, {
          abi,
          address,
          args,
          docsPath: '/docs/contract/multicall',
          functionName,
        })
        if (!allowFailure) throw error
        results.push({ error, result: undefined, status: 'failure' })
      }
    }
  }

  if (results.length !== contracts.length)
    throw new BaseError('multicall results mismatch')
  return results as MulticallReturnType<contracts, allowFailure>
}
