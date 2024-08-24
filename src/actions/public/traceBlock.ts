import type { Hash } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { BlockNotFoundError } from '../../errors/block.js'
import type { Chain } from '../../types/chain.js'
import type { TraceBlock } from '../../types/tract.js'
import { formatTraceBlock } from '../../utils/formatters/tract.js'

export type TraceBlockParameters = {
  blockHash: Hash
}

export type TraceBlockReturnType = TraceBlock | null

export async function traceBlock<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { blockHash }: TraceBlockParameters,
): Promise<TraceBlockReturnType> {
  const result = await client.request({
    method: 'trace_block',
    params: [blockHash],
  })

  if (!result) throw new BlockNotFoundError({ blockHash })

  return formatTraceBlock(result)
}
