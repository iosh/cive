import { type Transport, numberToHex } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Chain } from '../../types/chain.js'
import type { PoSCommittee } from '../../types/pos.js'
import { formatPoSCommittee } from '../../utils/formatters/pos.js'

export type GetPoSCommitteeParameters = {
  blockNumber?: bigint
}

export type GetPoSCommitteeReturnType = PoSCommittee

export async function getPoSCommittee<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { blockNumber }: GetPoSCommitteeParameters = {},
): Promise<GetPoSCommitteeReturnType> {
  const result = await client.request({
    method: 'pos_getCommittee',
    params: blockNumber ? [numberToHex(blockNumber)] : [],
  })
  return formatPoSCommittee(result)
}
