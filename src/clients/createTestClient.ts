import type { Account, Address } from '../accounts/types.js'
import type { ErrorType } from '../errors/utils.js'
import type { ParseAccount } from '../types/account.js'
import type { Chain } from '../types/chain.js'
import type { RpcSchema, TestRpcSchema } from '../types/eip1193.js'
import type { Prettify } from '../types/utils.js'
import {
  type Client,
  type ClientConfig,
  type CreateClientErrorType,
  createClient,
} from './createClient.js'
import { type TestActions, testActions } from './decorators/test.js'
import type { Transport } from './transports/createTransport.js'

export type TestClientConfig<
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
    | 'chain'
    | 'key'
    | 'name'
    | 'pollingInterval'
    | 'rpcSchema'
    | 'transport'
  >
>

export type TestClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  includeActions extends boolean = true,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  Client<
    transport,
    chain,
    account,
    rpcSchema extends RpcSchema
      ? [...TestRpcSchema, ...rpcSchema]
      : TestRpcSchema,
    includeActions extends true ? TestActions : Record<string, unknown>
  >
>

export type CreateTestClientErrorType = CreateClientErrorType | ErrorType

export function createTestClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
>(
  parameters: TestClientConfig<transport, chain, accountOrAddress, rpcSchema>,
): TestClient<transport, chain, ParseAccount<accountOrAddress>, true, rpcSchema>

export function createTestClient(parameters: TestClientConfig): TestClient {
  const { key = 'test', name = 'Test Client' } = parameters
  const client = createClient({
    ...parameters,
    key,
    name,
    type: 'TestClient',
  })
  return client.extend((config) => ({
    ...testActions(config),
  }))
}
