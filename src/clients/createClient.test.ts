import {
  http,
  type EIP1193RequestFn,
  createTransport,
  custom,
  webSocket,
} from 'viem'
import { assertType, describe, expect, test, vi } from 'vitest'
import { localhost } from '../chains/index.js'
import type { EIP1474Methods } from '../types/eip1193.js'
import { createClient } from './createClient.js'
import { publicActions } from './decorators/public.js'

test('creates', () => {
  const mockTransport = () =>
    createTransport({
      key: 'mock',
      name: 'Mock Transport',
      request: vi.fn(async () => null) as unknown as EIP1193RequestFn,
      type: 'mock',
    })
  const { uid, ...client } = createClient({
    transport: mockTransport,
  })

  assertType<EIP1193RequestFn<EIP1474Methods>>(client.request)

  expect(uid).toBeDefined()
  expect(client).toMatchInlineSnapshot(`
    {
      "account": undefined,
      "batch": undefined,
      "cacheTime": 4000,
      "ccipRead": undefined,
      "chain": undefined,
      "extend": [Function],
      "key": "base",
      "name": "Base Client",
      "pollingInterval": 4000,
      "request": [Function],
      "transport": {
        "key": "mock",
        "name": "Mock Transport",
        "request": [MockFunction spy],
        "retryCount": 3,
        "retryDelay": 150,
        "timeout": undefined,
        "type": "mock",
      },
      "type": "base",
    }
  `)
})

describe('transports', () => {
  test('http', () => {
    const { uid, ...client } = createClient({
      chain: localhost,
      transport: http(),
    })

    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "ccipRead": undefined,
        "chain": {
          "fees": undefined,
          "formatters": undefined,
          "id": 201029,
          "name": "Localhost",
          "nativeCurrency": {
            "decimals": 18,
            "name": "CFX",
            "symbol": "CFX",
          },
          "rpcUrls": {
            "default": {
              "http": [
                "http://127.0.0.1:12537",
              ],
              "webSocket": [
                "ws://127.0.0.1:12535",
              ],
            },
          },
          "serializers": undefined,
        },
        "extend": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "fetchOptions": undefined,
          "key": "http",
          "name": "HTTP JSON-RPC",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": 10000,
          "type": "http",
          "url": "http://127.0.0.1:12537",
        },
        "type": "base",
      }
    `)
  })

  test('webSocket', () => {
    const { uid, ...client } = createClient({
      chain: localhost,
      transport: webSocket(localhost.rpcUrls.default.webSocket[0]),
    })

    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "ccipRead": undefined,
        "chain": {
          "fees": undefined,
          "formatters": undefined,
          "id": 201029,
          "name": "Localhost",
          "nativeCurrency": {
            "decimals": 18,
            "name": "CFX",
            "symbol": "CFX",
          },
          "rpcUrls": {
            "default": {
              "http": [
                "http://127.0.0.1:12537",
              ],
              "webSocket": [
                "ws://127.0.0.1:12535",
              ],
            },
          },
          "serializers": undefined,
        },
        "extend": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "getRpcClient": [Function],
          "getSocket": [Function],
          "key": "webSocket",
          "name": "WebSocket JSON-RPC",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "subscribe": [Function],
          "timeout": 10000,
          "type": "webSocket",
        },
        "type": "base",
      }
    `)
  })

  test('custom', () => {
    const { uid, ...client } = createClient({
      transport: custom({ request: async () => null }),
    })

    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "ccipRead": undefined,
        "chain": undefined,
        "extend": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "key": "custom",
          "name": "Custom Provider",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "custom",
        },
        "type": "base",
      }
    `)
  })
})

describe('config', () => {
  test('cacheTime', () => {
    const mockTransport = () =>
      createTransport({
        key: 'mock',
        name: 'Mock Transport',
        request: vi.fn(async () => null) as unknown as EIP1193RequestFn,
        type: 'mock',
      })
    const { uid, ...client } = createClient({
      cacheTime: 10_000,
      transport: mockTransport,
    })

    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 10000,
        "ccipRead": undefined,
        "chain": undefined,
        "extend": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "key": "mock",
          "name": "Mock Transport",
          "request": [MockFunction spy],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "mock",
        },
        "type": "base",
      }
    `)
  })

  test('ccipRead', () => {
    const mockTransport = () =>
      createTransport({
        key: 'mock',
        name: 'Mock Transport',
        request: vi.fn(async () => null) as unknown as EIP1193RequestFn,
        type: 'mock',
      })
    const { uid, ...client } = createClient({
      ccipRead: {
        async request(_parameters) {
          return '0x' as const
        },
      },
      transport: mockTransport,
    })

    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "ccipRead": {
          "request": [Function],
        },
        "chain": undefined,
        "extend": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "key": "mock",
          "name": "Mock Transport",
          "request": [MockFunction spy],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "mock",
        },
        "type": "base",
      }
    `)
  })

  test('key', () => {
    const mockTransport = () =>
      createTransport({
        key: 'mock',
        name: 'Mock Transport',
        request: vi.fn(async () => null) as unknown as EIP1193RequestFn,
        type: 'mock',
      })
    const { uid, ...client } = createClient({
      key: 'bar',
      transport: mockTransport,
    })

    assertType<EIP1193RequestFn<EIP1474Methods>>(client.request)
    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "ccipRead": undefined,
        "chain": undefined,
        "extend": [Function],
        "key": "bar",
        "name": "Base Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "key": "mock",
          "name": "Mock Transport",
          "request": [MockFunction spy],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "mock",
        },
        "type": "base",
      }
    `)
  })

  test('name', () => {
    const mockTransport = () =>
      createTransport({
        key: 'mock',
        name: 'Mock Transport',
        request: vi.fn(async () => null) as unknown as EIP1193RequestFn,
        type: 'mock',
      })
    const { uid, ...client } = createClient({
      name: 'Mock Client',
      transport: mockTransport,
    })

    assertType<EIP1193RequestFn<EIP1474Methods>>(client.request)
    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "ccipRead": undefined,
        "chain": undefined,
        "extend": [Function],
        "key": "base",
        "name": "Mock Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "key": "mock",
          "name": "Mock Transport",
          "request": [MockFunction spy],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "mock",
        },
        "type": "base",
      }
    `)
  })

  test('pollingInterval', () => {
    const mockTransport = () =>
      createTransport({
        key: 'mock',
        name: 'Mock Transport',
        request: vi.fn(async () => null) as unknown as EIP1193RequestFn,
        type: 'mock',
      })
    const { uid, ...client } = createClient({
      pollingInterval: 10_000,
      transport: mockTransport,
    })

    assertType<EIP1193RequestFn<EIP1474Methods>>(client.request)
    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 10000,
        "ccipRead": undefined,
        "chain": undefined,
        "extend": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 10000,
        "request": [Function],
        "transport": {
          "key": "mock",
          "name": "Mock Transport",
          "request": [MockFunction spy],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "mock",
        },
        "type": "base",
      }
    `)
  })

  test('type', () => {
    const mockTransport = () =>
      createTransport({
        key: 'mock',
        name: 'Mock Transport',
        request: vi.fn(async () => null) as unknown as EIP1193RequestFn,
        type: 'mock',
      })
    const { uid, ...client } = createClient({
      transport: mockTransport,
      type: 'foo',
    })

    assertType<EIP1193RequestFn<EIP1474Methods>>(client.request)
    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "ccipRead": undefined,
        "chain": undefined,
        "extend": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 4000,
        "request": [Function],
        "transport": {
          "key": "mock",
          "name": "Mock Transport",
          "request": [MockFunction spy],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "mock",
        },
        "type": "foo",
      }
    `)
  })
})

describe('extends', () => {
  test('default', async () => {
    const client = createClient({
      chain: localhost,
      transport: http(),
    }).extend((config) => ({
      getChainId: async () => config.chain.id,
    }))

    expect(await client.getChainId()).toEqual(client.chain.id)
  })

  test('public actions', () => {
    const { uid: _, ...client } = createClient({
      chain: localhost,
      transport: http(),
    }).extend(publicActions)

    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "call": [Function],
        "ccipRead": undefined,
        "chain": {
          "fees": undefined,
          "formatters": undefined,
          "id": 201029,
          "name": "Localhost",
          "nativeCurrency": {
            "decimals": 18,
            "name": "CFX",
            "symbol": "CFX",
          },
          "rpcUrls": {
            "default": {
              "http": [
                "http://127.0.0.1:12537",
              ],
              "webSocket": [
                "ws://127.0.0.1:12535",
              ],
            },
          },
          "serializers": undefined,
        },
        "checkBalanceAgainstTransaction": [Function],
        "createBlockFilter": [Function],
        "createEventFilter": [Function],
        "createPendingTransactionFilter": [Function],
        "estimateGasAndCollateral": [Function],
        "estimateMaxPriorityFeePerGas": [Function],
        "extend": [Function],
        "getAccount": [Function],
        "getAccountPendingInfo": [Function],
        "getAccountPendingTransactions": [Function],
        "getAccumulateInterestRate": [Function],
        "getAdmin": [Function],
        "getBalance": [Function],
        "getBastBlockHash": [Function],
        "getBlock": [Function],
        "getBlockByHashWithPivotAssumption": [Function],
        "getBlockRewardInfo": [Function],
        "getBlocksByEpoch": [Function],
        "getBytecode": [Function],
        "getClientVersion": [Function],
        "getCollateralForStorage": [Function],
        "getCollateralInfo": [Function],
        "getConfirmationRiskByHash": [Function],
        "getDepositList": [Function],
        "getEpochNumber": [Function],
        "getEpochReceipts": [Function],
        "getFilterChanges": [Function],
        "getFilterLogs": [Function],
        "getGasPrice": [Function],
        "getInterestRate": [Function],
        "getLogs": [Function],
        "getNextNonce": [Function],
        "getParamsFromVote": [Function],
        "getPoSAccount": [Function],
        "getPoSBlock": [Function],
        "getPoSEconomics": [Function],
        "getPoSRewardByEpoch": [Function],
        "getPoSRewards": [Function],
        "getPoSStatus": [Function],
        "getPoSTransactionByNumber": [Function],
        "getPosCommittee": [Function],
        "getSkippedBlocksByEpoch": [Function],
        "getSponsorInfo": [Function],
        "getStakingBalance": [Function],
        "getStatus": [Function],
        "getStorageAt": [Function],
        "getStorageRoot": [Function],
        "getSupplyInfo": [Function],
        "getTransaction": [Function],
        "getTransactionReceipt": [Function],
        "getTxPoolNextNonce": [Function],
        "getVoteList": [Function],
        "key": "base",
        "name": "Base Client",
        "pollingInterval": 4000,
        "request": [Function],
        "traceBlock": [Function],
        "traceTransaction": [Function],
        "transport": {
          "fetchOptions": undefined,
          "key": "http",
          "name": "HTTP JSON-RPC",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": 10000,
          "type": "http",
          "url": "http://127.0.0.1:12537",
        },
        "type": "base",
        "uninstallFilter": [Function],
      }
    `)
  })
})
