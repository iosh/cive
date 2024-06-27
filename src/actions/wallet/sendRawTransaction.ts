import type { Hash, Transport } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { TransactionSerializedGeneric } from '../../types/transaction.js'

export type SendRawTransactionParameters = {
  /** The signed serialized tranasction. */
  serializedTransaction: TransactionSerializedGeneric
}

export type SendRawTransactionReturnType = Hash

export type SendRawTransactionErrorType = RequestErrorType | ErrorType

export async function sendRawTransaction<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { serializedTransaction }: SendRawTransactionParameters,
): Promise<SendRawTransactionReturnType> {
  return client.request(
    {
      method: 'cfx_sendRawTransaction',
      params: [serializedTransaction],
    },
    { retryCount: 0 },
  )
}
