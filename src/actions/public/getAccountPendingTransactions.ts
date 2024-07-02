import { type Transport, numberToHex } from 'viem'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { AccountPendingTransaction } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import { formatAccountPendingTransaction } from '../../utils/formatters/account.js'

export type GetAccountPendingTransactionsParameters = {
  address: Address
  nonce?: number
  limit?: number
}

export type GetAccountPendingTransactionsReturnType = AccountPendingTransaction

export async function getAccountPendingTransactions<
  TChain extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  { address: account, nonce, limit }: GetAccountPendingTransactionsParameters,
): Promise<GetAccountPendingTransactionsReturnType> {
  const _nonce = nonce ? numberToHex(nonce) : undefined
  const _limit = limit ? numberToHex(limit) : undefined
  const result = await client.request({
    method: 'cfx_getAccountPendingTransactions',
    params: [account, _nonce, _limit],
  })
  return formatAccountPendingTransaction(result)
}
