import type { CreateClientErrorType, RpcSchema, Transport } from 'viem'

import type { Register } from 'abitype'
import type { Prettify } from 'viem/chains'
import type { Account, Address } from '../accounts/types.js'
import type { ErrorType } from '../errors/utils.js'
import type { ParseAccount } from '../types/account.js'
import type { Chain } from '../types/chain.js'
import type { PublicRpcSchema } from '../types/eip1193.js'
import { type Client, type ClientConfig, createClient } from './createClient.js'
import { type PublicActions, publicActions } from './decorators/public.js'

export type PublicClientConfig<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  Pick<
    ClientConfig<transport, chain, accountOrAddress, rpcSchema>,
    | 'batch'
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

export type PublicClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  Client<
    transport,
    chain,
    accountOrAddress,
    rpcSchema extends RpcSchema
      ? [...PublicRpcSchema, ...rpcSchema]
      : PublicRpcSchema,
    PublicActions<transport, chain>
  >
>

export type CreatePublicClientErrorType = CreateClientErrorType | ErrorType

/**
 * Creates a Public Client with a given [Transport](https://viem.sh/docs/clients/intro) configured for a [Chain](https://viem.sh/docs/clients/chains).
 *
 * - Docs: https://viem.sh/docs/clients/public
 *
 * A Public Client is an interface to "public" [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/) methods such as retrieving block numbers, transactions, reading from smart contracts, etc through [Public Actions](/docs/actions/public/introduction).
 *
 * @param config - {@link PublicClientConfig}
 * @returns A Public Client. {@link PublicClient}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 */
export function createPublicClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
>(
  parameters: PublicClientConfig<transport, chain, accountOrAddress, rpcSchema>,
): PublicClient<transport, chain, ParseAccount<accountOrAddress>, rpcSchema> {
  const { key = 'public', name = 'Public Client' } = parameters
  const client = createClient({
    ...parameters,
    key,
    name,
    type: 'publicClient',
  })
  return client.extend(publicActions) as any
}
