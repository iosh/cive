import type { CreateClientErrorType, RpcSchema, Transport } from 'viem'
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
