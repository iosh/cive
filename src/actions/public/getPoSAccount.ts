import { numberToHex } from 'viem/utils'
import type { HexAddress } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type { PoSAccount } from '../../types/pos.js'
import { formatPoSAccount } from '../../utils/formatters/pos.js'

export type GetPoSAccountParameters = {
  address: HexAddress
  blockNumber?: bigint
}

export type GetPoSAccountReturnType = PoSAccount

export async function getPoSAccount<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, blockNumber }: GetPoSAccountParameters,
): Promise<GetPoSAccountReturnType> {
  const _blockNumber = blockNumber ? numberToHex(blockNumber) : undefined
  const result = await client.request({
    method: 'pos_getAccount',
    params: [address, _blockNumber],
  })
  return formatPoSAccount(result)
}
