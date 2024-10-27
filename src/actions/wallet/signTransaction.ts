import { type NumberToHexErrorType, numberToHex } from 'viem'
import type { RequestErrorType } from 'viem/utils'
import {
  type Account,
  type ParseAccountErrorType,
  parseAccount,
} from '../../accounts/index.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { AccountNotFoundError } from '../../errors/account.js'
import type { ErrorType } from '../../errors/utils.js'
import type { GetAccountParameter } from '../../types/account.js'
import type { Chain, GetChainParameter } from '../../types/chain.js'
import type { RpcTransactionRequest } from '../../types/rpc.js'
import type {
  TransactionRequest,
  TransactionSerializable,
  TransactionSerialized,
} from '../../types/transaction.js'
import type { UnionOmit } from '../../types/utils.js'
import {
  type AssertCurrentChainErrorType,
  assertCurrentChain,
} from '../../utils/chain/assertCurrentChain.js'
import {
  type FormattedTransactionRequest,
  formatTransactionRequest,
} from '../../utils/formatters/transactionRequest.js'
import { getAction } from '../../utils/getAction.js'
import {
  type AssertRequestErrorType,
  assertRequest,
} from '../../utils/transaction/assertRequest.js'
import type { GetTransactionType } from '../../utils/transaction/getTransactionType.js'
import { type GetChainIdErrorType, getChainId } from '../public/getChainId.js'
export type SignTransactionRequest<
  chain extends Chain | undefined = Chain | undefined,
> = UnionOmit<FormattedTransactionRequest<chain>, 'from'>

export type SignTransactionParameters<
  chain extends Chain | undefined,
  account extends Account | undefined,
  request extends SignTransactionRequest<chain> = SignTransactionRequest<chain>,
> = request & GetAccountParameter<account> & GetChainParameter<chain>

export type SignTransactionReturnType<
  request extends SignTransactionRequest = SignTransactionRequest,
> = TransactionSerialized<GetTransactionType<request>>

export type SignTransactionErrorType =
  | ParseAccountErrorType
  | AssertRequestErrorType
  | GetChainIdErrorType
  | AssertCurrentChainErrorType
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType

export async function signTransaction<
  chain extends Chain | undefined,
  account extends Account | undefined,
  const request extends
    SignTransactionRequest<chain> = SignTransactionRequest<chain>,
>(
  client: Client<Transport, chain, account>,
  parameters: SignTransactionParameters<chain, account, request>,
): Promise<SignTransactionReturnType<request>> {
  const {
    account: account_ = client.account,
    chain = client.chain,
    ...transaction
  } = parameters

  if (!account_)
    throw new AccountNotFoundError({
      docsPath: '/docs/actions/wallet/signTransaction',
    })
  const account = parseAccount(account_)

  assertRequest({
    account,
    ...parameters,
  })

  const chainId = await getAction(client, getChainId, 'getChainId')({})
  if (chain !== null)
    assertCurrentChain({
      currentChainId: chainId,
      chain,
    })

  const formatters = chain?.formatters || client.chain?.formatters
  const format =
    formatters?.transactionRequest?.format || formatTransactionRequest

  if (account.type === 'local') {
    return account.signTransaction(
      {
        ...transaction,
        chainId,
      } as TransactionSerializable,
      { serializer: client.chain?.serializers?.transaction },
    ) as Promise<SignTransactionReturnType<request>>
  }

  return await client.request(
    {
      method: 'cfx_signTransaction',
      params: [
        {
          ...format(transaction as unknown as TransactionRequest),
          chainId: numberToHex(chainId),
          from: account.address,
        } as unknown as RpcTransactionRequest,
      ],
    },
    { retryCount: 0 },
  )
}
