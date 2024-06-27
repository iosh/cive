import type { Hash, Transport } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Chain } from '../../types/chain.js'
import type { Trace } from '../../types/tract.js'
import { formatTract } from '../../utils/formatters/tract.js'

export type TraceTransactionParameters = {
  transactionHash: Hash
}

export type TraceTransactionReturnType = Trace

export async function traceTransaction<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { transactionHash }: TraceTransactionParameters,
): Promise<TraceTransactionReturnType> {
  const result = await client.request({
    method: 'trace_transaction',
    params: [transactionHash],
  })

  return formatTract(result)
}
