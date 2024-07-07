import { type Transport, numberToHex } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Chain } from '../../types/chain.js'
import type { TransactionReceipt } from '../../types/transaction.js'
import { formatTransactionReceipts } from '../../utils/formatters/transactionReceipt.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'

export type GetEpochReceiptsParameters = {
  includeTxReceipts?: boolean
} & (
  | {
      epochTag: EpochTag
      epochNumber?: never
    }
  | {
      epochTag?: never
      epochNumber: EpochNumber
    }
)

export type GetEpochReceiptsReturnType = TransactionReceipt[][]

export async function getEpochReceipts<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  args: GetEpochReceiptsParameters,
): Promise<GetEpochReceiptsReturnType> {
  const epoch =
    'epochTag' in args ? args.epochTag : numberToHex(args.epochNumber)
  const { includeTxReceipts = false } = args
  const result = await client.request({
    method: 'cfx_getEpochReceipts',
    params: [epoch, includeTxReceipts],
  })
  if (!result) return []
  return formatTransactionReceipts(result)
}
