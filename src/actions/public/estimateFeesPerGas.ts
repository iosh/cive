import {
  BaseFeeScalarError,
  type BaseFeeScalarErrorType,
  Eip1559FeesNotSupportedError,
  type Eip1559FeesNotSupportedErrorType,
  type EstimateMaxPriorityFeePerGasErrorType,
} from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Block } from '../../types/block.js'
import type {
  Chain,
  ChainEstimateFeesPerGasFnParameters,
  ChainFeesFnParameters,
  GetChainParameter,
} from '../../types/chain.js'
import type {
  FeeValuesEIP1559,
  FeeValuesLegacy,
  FeeValuesType,
} from '../../types/fee.js'
import { getAction } from '../../utils/getAction.js'
import type { PrepareTransactionRequestParameters } from '../wallet/prepareTransactionRequest.js'
import { estimateMaxPriorityFeePerGas } from './estimateMaxPriorityFeePerGas.js'
import { getBlock } from './getBlock.js'
import { type GetGaspriceErrorType, getGasPrice } from './getGasPrice.js'

export type EstimateFeesPerGasParameters<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  type extends FeeValuesType = FeeValuesType,
> = {
  /**
   * The type of fee values to return.
   *
   * - `legacy`: Returns the legacy gas price.
   * - `eip1559`: Returns the max fee per gas and max priority fee per gas.
   *
   * @default 'eip1559'
   */
  type?: type | FeeValuesType | undefined
} & GetChainParameter<chain, chainOverride>

export type EstimateFeesPerGasReturnType<
  type extends FeeValuesType = FeeValuesType,
> =
  | (type extends 'legacy' ? FeeValuesLegacy : never)
  | (type extends 'eip1559' ? FeeValuesEIP1559 : never)

export type EstimateFeesPerGasErrorType =
  | BaseFeeScalarErrorType
  | EstimateMaxPriorityFeePerGasErrorType
  | GetGaspriceErrorType
  | Eip1559FeesNotSupportedErrorType
  | ErrorType

export async function estimateFeesPerGas<
  chain extends Chain | undefined,
  chainOverride extends Chain | undefined,
  type extends FeeValuesType = 'eip1559',
>(
  client: Client<Transport, chain>,
  args?: EstimateFeesPerGasParameters<chain, chainOverride, type> | undefined,
): Promise<EstimateFeesPerGasReturnType<type>> {
  return internal_estimateFeesPerGas(client, args as any)
}

export async function internal_estimateFeesPerGas<
  chain extends Chain | undefined,
  chainOverride extends Chain | undefined,
  type extends FeeValuesType = 'eip1559',
>(
  client: Client<Transport, chain>,
  args: EstimateFeesPerGasParameters<chain, chainOverride, type> & {
    block?: Block | undefined
    request?: PrepareTransactionRequestParameters | undefined
  },
): Promise<EstimateFeesPerGasReturnType<type>> {
  const {
    block: block_,
    chain = client.chain,
    request,
    type = 'eip1559',
  } = args || {}

  const baseFeeMultiplier = await (async () => {
    if (typeof chain?.fees?.baseFeeMultiplier === 'function')
      return chain.fees.baseFeeMultiplier({
        block: block_ as Block,
        client,
        request,
      } as ChainFeesFnParameters)
    return chain?.fees?.baseFeeMultiplier ?? 1
  })()
  if (baseFeeMultiplier < 1) throw new BaseFeeScalarError()

  const decimals = baseFeeMultiplier.toString().split('.')[1]?.length ?? 0
  const denominator = 10 ** decimals
  const multiply = (base: bigint) =>
    (base * BigInt(Math.ceil(baseFeeMultiplier * denominator))) /
    BigInt(denominator)

  const block = block_
    ? block_
    : await getAction(client, getBlock, 'getBlock')({})

  if (typeof chain?.fees?.estimateFeesPerGas === 'function') {
    const fees = (await chain.fees.estimateFeesPerGas({
      block: block_ as Block,
      client,
      multiply,
      request,
      type,
    } as ChainEstimateFeesPerGasFnParameters)) as unknown as EstimateFeesPerGasReturnType<type>

    if (fees !== null) return fees
  }

  if (type === 'eip1559') {
    if (typeof block.baseFeePerGas !== 'bigint')
      throw new Eip1559FeesNotSupportedError()

    const maxPriorityFeePerGas =
      typeof request?.maxPriorityFeePerGas === 'bigint'
        ? request.maxPriorityFeePerGas
        : await getAction(
            client,
            estimateMaxPriorityFeePerGas,
            'estimateMaxPriorityFeePerGas',
          )({})

    const baseFeePerGas = multiply(block.baseFeePerGas)
    const maxFeePerGas =
      request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas

    return {
      maxFeePerGas,
      maxPriorityFeePerGas,
    } as EstimateFeesPerGasReturnType<type>
  }

  const gasPrice =
    request?.gasPrice ??
    multiply(await getAction(client, getGasPrice, 'getGasPrice')({}))
  return {
    gasPrice,
  } as EstimateFeesPerGasReturnType<type>
}
