import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import { withCache } from '../../utils/promise/withCache.js'

export type GetEpochNumberParameters<TEpochTag extends EpochTag = EpochTag> = {
  epochTag?: Exclude<TEpochTag, 'latest_confirmed'>
  cacheTime?: number | undefined
}

export type GetEpochNumberReturnType = bigint

const cacheKey = (id: string, tag: string) => `blockNumber.${id}.${tag}`
export async function getEpochNumber<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    epochTag = 'latest_mined',
    cacheTime = client.cacheTime,
  }: GetEpochNumberParameters = {},
): Promise<GetEpochNumberReturnType> {
  const epochNumberHex = await withCache(
    () =>
      client.request({
        method: 'cfx_epochNumber',
        params: [epochTag],
      }),
    { cacheKey: cacheKey(client.uid, epochTag), cacheTime },
  )

  return BigInt(epochNumberHex)
}
