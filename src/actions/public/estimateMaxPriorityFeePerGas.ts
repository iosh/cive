import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'

export type EstimateMaxPriorityFeePerGasReturnType = bigint

export async function estimateMaxPriorityFeePerGas<
  chain extends Chain | undefined,
>(
  client: Client<Transport, chain>,
): Promise<EstimateMaxPriorityFeePerGasReturnType> {
  const maxPriorityFeePerGasHex = await client.request({
    method: 'cfx_maxPriorityFeePerGas',
  })
  return BigInt(maxPriorityFeePerGasHex)
}
