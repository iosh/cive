import type { Account, Address } from '~unit/accounts/types.js'
import { localhost } from '~unit/chains/index.js'
import {
  type Client,
  type ClientConfig,
  createClient,
} from '~unit/clients/createClient.js'
import {
  http,
  type Transport,
  webSocket,
} from '~unit/clients/transports/index.js'
import type { ParseAccount } from '~unit/types/account.js'
import type { Chain } from '~unit/types/chain.js'
import type { ExactPartial } from '~unit/types/utils.js'
import { accounts } from '../constants.js'
import { createNode, remove } from './docker.js'

type DefineConfluxParameters<chain extends Chain> = {
  chain: chain
  port: number
  wsPort: number
}

type DefineConfluxReturnType<chain extends Chain> = {
  chain: chain
  clientConfig: ClientConfig<Transport, chain, undefined>
  getClient<
    config extends ExactPartial<
      Omit<ClientConfig, 'account' | 'chain'> & {
        account?: true | Address | Account | undefined
        chain?: false | undefined
      }
    >,
  >(
    config?: config | undefined,
  ): Client<
    config['transport'] extends Transport ? config['transport'] : Transport,
    config['chain'] extends false ? undefined : chain,
    config['account'] extends Address
      ? ParseAccount<config['account']>
      : config['account'] extends Account
        ? config['account']
        : config['account'] extends true
          ? ParseAccount<(typeof accounts)[0]['base32Address']>
          : undefined,
    undefined,
    { mode: 'conflux' }
  >
  rpcUrl: {
    http: string
    ws: string
  }
  stop(): Promise<void>
  start(): Promise<void>
}

function defineConflux<const chain extends Chain>(
  parameters: DefineConfluxParameters<chain>,
): DefineConfluxReturnType<chain> {
  const { chain: chain_, port, wsPort } = parameters

  const rpcUrl = {
    http: `http://127.0.0.1:${port}`,
    ws: `ws://127.0.0.1:${wsPort}`,
  } as const

  const chain = {
    ...chain_,
    name: `${chain_.name} (Local)`,
    rpcUrls: {
      default: {
        http: [rpcUrl.http],
        webSocket: [rpcUrl.ws],
      },
    },
  } as const satisfies Chain

  const clientConfig = {
    batch: {
      multicall: process.env.VITE_BATCH_MULTICALL === 'true',
    },
    chain,
    pollingInterval: 100,
    transport(args) {
      const { config, request, value } = (() => {
        if (process.env.VITE_NETWORK_TRANSPORT_MODE === 'webSocket')
          return webSocket(rpcUrl.ws)(args)
        return http(rpcUrl.http)(args)
      })()

      return {
        config,
        async request({ method, params }: any, opts: any = {}) {
          return request({ method, params }, opts)
        },
        value,
      }
    },
  } as const satisfies ClientConfig

  return {
    chain,
    clientConfig,
    getClient(config) {
      return (
        createClient({
          ...clientConfig,
          ...config,
          account:
            config?.account === true
              ? accounts[0].base32Address
              : config?.account,
          chain: config?.chain === false ? undefined : chain,
          transport: clientConfig.transport,
        }) as any
      ).extend(() => ({ mode: 'conflux' })) as never
    },
    rpcUrl,
    async stop() {
      await remove()
    },
    async start() {
      return createNode({
        httpPort: port,
        wsPort,
      })
    },
  } as const
}

export const poolId = Number(process.env.VITEST_POOL_ID ?? 1)

export const devConflux = defineConflux({
  chain: localhost,
  port: 12539 + poolId * 10,
  wsPort: 12540 + poolId * 10,
})
