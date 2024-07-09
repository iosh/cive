import { type Transport, numberToHex } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { Chain } from '../../types/chain.js'
import type { PoSCommittee } from '../../types/pos.js'
import { formatPoSCommittee } from '../../utils/formatters/pos.js'

export type GetPosCommitteeParameters = {
  blockNumber?: bigint
}

export type GetPosCommitteeReturnType = PoSCommittee

export async function getPosCommittee<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { blockNumber }: GetPosCommitteeParameters = {},
): Promise<GetPosCommitteeReturnType> {
  const result = await client.request({
    method: 'pos_getCommittee',
    params: blockNumber ? [numberToHex(blockNumber)] : [],
  })
  return formatPoSCommittee(result)
}
