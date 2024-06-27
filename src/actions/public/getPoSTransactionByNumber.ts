import { type Transport, numberToHex } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Chain } from '../../types/chain.js'
import type { PoSTransaction } from '../../types/pos.js'
import { formatPoSTransaction } from '../../utils/formatters/pos.js'

export type GetPoSTransactionParameters = {
  transactionNumber: bigint
}

export type GetPoSTransactionReturnType = PoSTransaction | null

export async function getPoSTransactionByNumber<
  TChain extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  { transactionNumber }: GetPoSTransactionParameters,
): Promise<GetPoSTransactionReturnType> {
  const result = await client.request({
    method: 'pos_getTransactionByNumber',
    params: [numberToHex(transactionNumber)],
  })

  if (!result) return null

  return formatPoSTransaction(result)
}
