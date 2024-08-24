import {
  type Hash,
  type NumberToHexErrorType,
  TransactionNotFoundError,
} from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { Prettify } from '../../types/utils.js'
import {
  type FormattedTransaction,
  formatTransaction,
} from '../../utils/formatters/transaction.js'

export type GetTransactionParameters = {
  hash: Hash
}

export type GetTransactionReturnType<TChain extends Chain | undefined> =
  Prettify<FormattedTransaction<TChain, 'latest_state'>>

export type GetTransactionErrorType =
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType

export async function getTransaction<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { hash }: GetTransactionParameters,
): Promise<GetTransactionReturnType<TChain>> {
  const transaction = await client.request({
    method: 'cfx_getTransactionByHash',
    params: [hash],
  })

  if (!transaction) {
    throw new TransactionNotFoundError({
      hash,
    })
  }

  const format =
    client.chain?.formatters?.transaction?.format || formatTransaction

  return format(transaction)
}
