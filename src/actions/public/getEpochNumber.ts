import type { Transport } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'

export type GetEpochNumberParameters<
  TEpochTag extends EpochTag = 'latest_mined',
> = {
  tag?: TEpochTag
}

export type GetEpochNumberReturnType = bigint

export async function getEpochNumber<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { tag = 'latest_mined' }: GetEpochNumberParameters = {},
): Promise<GetEpochNumberReturnType> {
  const epochNumber = await client.request({
    method: 'cfx_epochNumber',
    params: [tag],
  })

  return BigInt(epochNumber)
}
