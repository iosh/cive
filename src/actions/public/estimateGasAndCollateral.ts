import { type Transport, numberToHex } from 'viem'
import type { Account, Address } from '../../accounts/types.js'
import { parseAccount } from '../../accounts/utils/parseAccount.js'
import type { Client } from '../../clients/createClient.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import { FeeValues, type GasAndCollateral } from '../../types/fee.js'
import type { TransactionRequest } from '../../types/transaction.js'
import type { UnionOmit } from '../../types/utils.js'
import { formatFee } from '../../utils/formatters/fee.js'
import {
  type FormattedTransactionRequest,
  formatTransactionRequest,
} from '../../utils/formatters/transactionRequest.js'

export type FormattedCall<
  TChain extends Chain | undefined = Chain | undefined,
> = FormattedTransactionRequest<TChain>
export type EstimateGasAndCollateralParameters<
  TChain extends Chain | undefined = Chain | undefined,
> = UnionOmit<FormattedCall<TChain>, 'from'> & {
  account?: Address | Account | undefined
  batch?: boolean | undefined
} & (
    | {
        /**
         * @default 'latest_state'
         */
        epochTag?: EpochTag | undefined
        epochNumber?: never | undefined
      }
    | {
        epochTag?: never | undefined
        epochNumber?: EpochNumber | undefined
      }
  )

export type EstimateGasAndCollateralReturnType = GasAndCollateral

export async function estimateGasAndCollateral<
  TChain extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  args: EstimateGasAndCollateralParameters<TChain>,
): Promise<EstimateGasAndCollateralReturnType> {
  const {
    account: account_ = client.account,
    batch = Boolean(client.batch?.multicall),
    epochNumber,
    epochTag = 'latest_state',
    data,
    gas,
    gasPrice,
    storageLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value,
    ...rest
  } = args
  const account = account_ ? parseAccount(account_) : undefined

  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined
  const epoch = _epochNumber || epochTag

  const chainFormat = client.chain?.formatters?.transactionRequest?.format
  const format = chainFormat || formatTransactionRequest

  const request = format({
    ...rest,
    from: account?.address,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value,
    storageLimit,
  } as TransactionRequest)

  const result = await client.request({
    method: 'cfx_estimateGasAndCollateral',
    params: [request, epoch],
  })

  return formatFee(result)
}
