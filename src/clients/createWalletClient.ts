import type { RpcSchema, Transport } from 'viem'

import type { Account, Address } from '../accounts/types.js'
import type { ErrorType } from '../errors/utils.js'
import type { ParseAccount } from '../types/account.js'

import type { Chain } from '../types/chain.js'
import type { WalletRpcSchema } from '../types/eip1193.js'
import type { Prettify } from '../types/utils.js'
import {
  type Client,
  type ClientConfig,
  type CreateClientErrorType,
  createClient,
} from './createClient.js'
import { type WalletActions, walletActions } from './decorators/wallet.js'

export type WalletClientConfig<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  Pick<
    ClientConfig<transport, chain, accountOrAddress, rpcSchema>,
    | 'account'
    | 'cacheTime'
    | 'ccipRead'
    | 'chain'
    | 'key'
    | 'name'
    | 'pollingInterval'
    | 'rpcSchema'
    | 'transport'
  >
>

export type WalletClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  Client<
    transport,
    chain,
    account,
    rpcSchema extends RpcSchema
      ? [...WalletRpcSchema, ...rpcSchema]
      : WalletRpcSchema,
    WalletActions<chain, account>
  >
>

export type CreateWalletClientErrorType = CreateClientErrorType | ErrorType

export function createWalletClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
>(
  parameters: WalletClientConfig<transport, chain, accountOrAddress, rpcSchema>,
): WalletClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema>

export function createWalletClient(
  parameters: WalletClientConfig,
): WalletClient {
  const { key = 'wallet', name = 'Wallet Client', transport } = parameters
  const client = createClient({
    ...parameters,
    key,
    name,
    transport,
    type: 'walletClient',
  })
  return client.extend(walletActions)
}
