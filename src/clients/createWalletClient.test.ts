import {
  createTransport,
  custom,
  http,
  webSocket,
  type EIP1193RequestFn,
} from 'viem'
import { assertType, describe, expect, test, vi } from 'vitest'
import { createWalletClient } from './createWalletClient.js'
import type { WalletRpcSchema } from '../types/eip1193.js'
import { privateKeyToAccount } from '../accounts/privateKeyToAccount.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import type { PrivateKeyAccount } from '../accounts/index.js'
import { localhost } from '../chains/index.js'
import { publicActions } from './decorators/public.js'
import { localNodeActions } from './decorators/localNode.js'
const sourceAccount = getTestAccount(accounts[0])
const mockTransport = () =>
  createTransport({
    key: 'mock',
    name: 'Mock Transport',
    request: vi.fn(() => null) as any,
    type: 'mock',
  })

test('creates', () => {
  const { uid, ...client } = createWalletClient({
    transport: mockTransport,
  })

  assertType<EIP1193RequestFn<WalletRpcSchema>>(client.request)
  assertType<{
    account?: undefined
  }>(client)
  expect(uid).toBeDefined()
  expect(client).toMatchInlineSnapshot(`
    {
      "account": undefined,
      "batch": undefined,
      "cacheTime": 4000,
      "ccipRead": undefined,
      "chain": undefined,
      "deployContract": [Function],
      "extend": [Function],
      "key": "wallet",
      "name": "Wallet Client",
      "pollingInterval": 4000,
      "prepareTransactionRequest": [Function],
      "request": [Function],
      "sendRawTransaction": [Function],
      "transport": {
        "key": "mock",
        "name": "Mock Transport",
        "request": [MockFunction spy],
        "retryCount": 3,
        "retryDelay": 150,
        "timeout": undefined,
        "type": "mock",
      },
      "type": "walletClient",
    }
  `)
})

describe('args: account', () => {
  test('local account', () => {
    const { uid, ...client } = createWalletClient({
      account: privateKeyToAccount(accounts[0].privateKey, {
        networkId: accounts[0].netId,
      }),
      transport: mockTransport,
    })
    assertType<{
      account: PrivateKeyAccount
    }>(client)
    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
          "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "batch": undefined,
        "cacheTime": 4000,
        "ccipRead": undefined,
        "chain": undefined,
        "deployContract": [Function],
        "extend": [Function],
        "key": "wallet",
        "name": "Wallet Client",
        "pollingInterval": 4000,
        "prepareTransactionRequest": [Function],
        "request": [Function],
        "sendRawTransaction": [Function],
        "transport": {
          "key": "mock",
          "name": "Mock Transport",
          "request": [MockFunction spy],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "mock",
        },
        "type": "walletClient",
      }
    `)
  })
})

describe('args: transport', () => {
  test('custom', () => {
    const { uid, ...client } = createWalletClient({
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
        "deployContract": [Function],
        "extend": [Function],
        "key": "wallet",
        "name": "Wallet Client",
        "pollingInterval": 4000,
        "prepareTransactionRequest": [Function],
        "request": [Function],
        "sendRawTransaction": [Function],
        "transport": {
          "key": "custom",
          "name": "Custom Provider",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "custom",
        },
        "type": "walletClient",
      }
    `)
  })

  test('http', () => {
    const { uid, ...client } = createWalletClient({
      transport: http(localhost.rpcUrls.default.http[0]),
    })

    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "ccipRead": undefined,
        "chain": undefined,
        "deployContract": [Function],
        "extend": [Function],
        "key": "wallet",
        "name": "Wallet Client",
        "pollingInterval": 4000,
        "prepareTransactionRequest": [Function],
        "request": [Function],
        "sendRawTransaction": [Function],
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
        "type": "walletClient",
      }
    `)
  })

  test('webSocket', () => {
    const { uid, ...client } = createWalletClient({
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
        "deployContract": [Function],
        "extend": [Function],
        "key": "wallet",
        "name": "Wallet Client",
        "pollingInterval": 4000,
        "prepareTransactionRequest": [Function],
        "request": [Function],
        "sendRawTransaction": [Function],
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
        "type": "walletClient",
      }
    `)
  })

  test('extend', () => {
    const { uid: _, ...client } = createWalletClient({
      account: sourceAccount,
      chain: localhost,
      transport: http(),
    })
      .extend(publicActions)
      .extend(localNodeActions)

    expect(client).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
          "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
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
        "clearTxpool": [Function],
        "createBlockFilter": [Function],
        "createEventFilter": [Function],
        "createLocalNodeAccount": [Function],
        "createPendingTransactionFilter": [Function],
        "deployContract": [Function],
        "estimateGasAndCollateral": [Function],
        "estimateMaxPriorityFeePerGas": [Function],
        "extend": [Function],
        "generateEmptyLocalNodeBlocks": [Function],
        "generateLocalNodeBlock": [Function],
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
        "getLocalNodeAddresses": [Function],
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
        "key": "wallet",
        "lockLocalNodeAccount": [Function],
        "name": "Wallet Client",
        "pollingInterval": 4000,
        "prepareTransactionRequest": [Function],
        "request": [Function],
        "sendRawTransaction": [Function],
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
        "type": "walletClient",
        "uninstallFilter": [Function],
        "unlockLocalNodeAccount": [Function],
      }
    `)
  })
})
