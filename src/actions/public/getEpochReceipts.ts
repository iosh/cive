import { numberToHex } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { TransactionReceipt } from '../../types/transaction.js'
import { formatTransactionReceipts } from '../../utils/formatters/transactionReceipt.js'

export type GetEpochReceiptsParameters = {
  includeTxReceipts?: boolean
} & (
  | {
      /**
       * @default 'latest_state'
       */
      epochTag?:
        | Exclude<EpochTag, 'latest_finalized' | 'latest_mined'>
        | undefined
      epochNumber?: never | undefined
    }
  | {
      epochTag?: never | undefined
      epochNumber?: EpochNumber | undefined
    }
)
export type GetEpochReceiptsReturnType = TransactionReceipt[][]

export async function getEpochReceipts<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    epochNumber,
    includeTxReceipts = false,
    epochTag = 'latest_state',
  }: GetEpochReceiptsParameters = {},
): Promise<GetEpochReceiptsReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined
  const result = await client.request({
    method: 'cfx_getEpochReceipts',
    params: [_epochNumber || epochTag, includeTxReceipts],
  })
  if (!result) return []
  return formatTransactionReceipts(result)
}
