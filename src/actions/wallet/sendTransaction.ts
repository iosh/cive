import type {
  AssertCurrentChainErrorType,
  AssertRequestErrorType,
  BaseError,
  GetChainIdErrorType,
  Hash,
  PrepareTransactionRequestErrorType,
  SendRawTransactionErrorType,
} from 'viem'
import type { SignTransactionErrorType } from 'viem/accounts'

import { type RequestErrorType, extract } from 'viem/utils'
import {
  type ParseAccountErrorType,
  parseAccount,
} from '../../accounts/index.js'
import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { AccountNotFoundError } from '../../errors/account.js'
import type { ErrorType } from '../../errors/utils.js'
import type { GetAccountParameter } from '../../types/account.js'
import type {
  Chain,
  DeriveChain,
  GetChainParameter,
} from '../../types/chain.js'
import type { TransactionRequest } from '../../types/transaction.js'
import type { UnionOmit } from '../../types/utils.js'
import { assertCurrentChain } from '../../utils/chain/assertCurrentChain.js'
import {
  type GetTransactionErrorReturnType,
  getTransactionError,
} from '../../utils/errors/getTransactionError.js'
import {
  type FormattedTransactionRequest,
  formatTransactionRequest,
} from '../../utils/formatters/transactionRequest.js'
import { getAction } from '../../utils/getAction.js'
import { assertRequest } from '../../utils/transaction/assertRequest.js'
import { getStatus } from '../public/getStatus.js'
import {
  defaultParameters,
  prepareTransactionRequest,
} from './prepareTransactionRequest.js'
import { sendRawTransaction } from './sendRawTransaction.js'

export type SendTransactionRequest<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  ///
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = UnionOmit<FormattedTransactionRequest<_derivedChain>, 'from'>

export type SendTransactionParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  request extends SendTransactionRequest<
    chain,
    chainOverride
  > = SendTransactionRequest<chain, chainOverride>,
> = request &
  GetAccountParameter<account> &
  GetChainParameter<chain, chainOverride>

export type SendTransactionReturnType = Hash

export type SendTransactionErrorType =
  | ParseAccountErrorType
  | GetTransactionErrorReturnType<
      | AssertCurrentChainErrorType
      | AssertRequestErrorType
      | GetChainIdErrorType
      | PrepareTransactionRequestErrorType
      | SendRawTransactionErrorType
      | SignTransactionErrorType
      | RequestErrorType
    >
  | ErrorType

export async function sendTransaction<
  chain extends Chain | undefined,
  account extends Account | undefined,
  const request extends SendTransactionRequest<chain, chainOverride>,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SendTransactionParameters<chain, account, chainOverride, request>,
): Promise<SendTransactionReturnType> {
  const {
    account: account_ = client.account,
    chain = client.chain,
    accessList,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,

    nonce,
    to,
    value,
    storageLimit,
    epochHeight,
    ...rest
  } = parameters

  if (!account_) {
    throw new AccountNotFoundError({
      docsPath: '/docs/actions/wallet/sendTransaction',
    })
  }

  const account = parseAccount(account_)

  try {
    assertRequest(parameters)

    let chainId: number | undefined

    if (chain !== null) {
      const nodeStatus = await getAction(client, getStatus, 'getStatus')({})
      chainId = nodeStatus.chainId
      assertCurrentChain({
        currentChainId: chainId,
        chain,
      })
    }

    if (account.type === 'local') {
      // Prepare the request for signing (assign appropriate fees, etc.)
      const request = await getAction(
        client,
        prepareTransactionRequest,
        'prepareTransactionRequest',
      )({
        account,
        accessList,
        chain,
        chainId,
        data,
        gas,
        gasPrice,
        storageLimit,
        epochHeight,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        parameters: [...defaultParameters],
        to,
        value,
        ...rest,
      } as any)

      const serializer = chain?.serializers?.transaction
      const serializedTransaction = (await account.signTransaction(request, {
        serializer,
      })) as Hash
      return await getAction(
        client,
        sendRawTransaction,
        'sendRawTransaction',
      )({
        serializedTransaction,
      })
    }

    const chainFormat = client.chain?.formatters?.transactionRequest?.format
    const format = chainFormat || formatTransactionRequest

    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      accessList,
      data,
      from: account.address,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value,
    } as TransactionRequest)
    return await client.request(
      {
        method: 'cfx_sendTransaction',
        params: [request],
      },
      { retryCount: 0 },
    )
  } catch (err) {
    throw getTransactionError(err as BaseError, {
      ...parameters,
      account,
      chain: parameters.chain || undefined,
    })
  }
}
