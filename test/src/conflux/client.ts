import { type Config } from '@xcfx/node'
import type { Account, Address } from '~cive/accounts/types.js'
import { localhostNode } from '~cive/chains/definitions/localhost.js'
import {
  type Client,
  type ClientConfig,
  createClient,
} from '~cive/clients/createClient.js'
import {
  http,
  type Transport,
  webSocket,
} from '~cive/clients/transports/index.js'
import type { ParseAccount } from '~cive/types/account.js'
import type { Chain } from '~cive/types/chain.js'
import type { ExactPartial } from '~cive/types/utils.js'
import { accounts } from '../constants.js'
import { createNode, remove } from './node.js'

type DefineConfluxParameters<chain extends Chain> = {
  chain: chain
  port: number
  wsPort: number
  udpAndTcpPort: number
}

type DefineConfluxReturnType<chain extends Chain> = {
  chain: chain
  clientConfig: ClientConfig<Transport, chain, undefined>
  getClient<
    config extends ExactPartial<
      Omit<ClientConfig, 'account' | 'chain'> & {
        account?: true | Address | Account | undefined
        chain?: Chain | undefined
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
  start(config?: Config): Promise<void>
}

function defineConflux<const chain extends Chain>(
  parameters: DefineConfluxParameters<chain>,
): DefineConfluxReturnType<chain> {
  const { chain: chain_, port, wsPort, udpAndTcpPort } = parameters

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
          chain: config?.chain || chain,
          transport: clientConfig.transport,
        }) as any
      ).extend(() => ({ mode: 'conflux' })) as never
    },
    rpcUrl,
    async stop() {
      await remove()
    },
    async start(config) {
      return createNode({
        ...config,
        httpPort: port,
        wsPort,
        udpAndTcpPort,
      })
    },
  } as const
}

export const poolId = Number(process.env.VITEST_POOL_ID ?? 1)

export const devConflux = defineConflux({
  chain: localhostNode,
  port: 12339 + poolId * 10,
  wsPort: 12440 + poolId * 10,
  udpAndTcpPort: 12541 + poolId * 10,
})
