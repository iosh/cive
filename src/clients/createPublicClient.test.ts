import { assertType, describe, expect, test, vi } from 'vitest'
import { localhostNode } from '../chains/definitions/localhost.js'
import type { EIP1193RequestFn, PublicRpcSchema } from '../types/eip1193.js'
import { createPublicClient } from './createPublicClient.js'
import { createTransport } from './transports/createTransport.js'
import { http } from './transports/http.js'
import { webSocket } from './transports/webSocket.js'
import { custom } from './transports/custom.js'

const mockTransport = () =>
  createTransport({
    key: 'mock',
    name: 'Mock Transport',
    request: vi.fn(() => null) as any,
    type: 'mock',
  })

test('creates', () => {
  const { uid, ...client } = createPublicClient({
    transport: mockTransport,
  })

  assertType<EIP1193RequestFn<PublicRpcSchema>>(client.request)

  expect(uid).toBeDefined()
  expect(client).toMatchInlineSnapshot(`
    {
      "account": undefined,
      "batch": undefined,
      "cacheTime": 4000,
      "call": [Function],
      "ccipRead": undefined,
      "chain": undefined,
      "checkBalanceAgainstTransaction": [Function],
      "createBlockFilter": [Function],
      "createContractEventFilter": [Function],
      "createEventFilter": [Function],
      "createPendingTransactionFilter": [Function],
      "estimateContractGasAndCollateral": [Function],
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
      "getChainId": [Function],
      "getClientVersion": [Function],
      "getCode": [Function],
      "getCollateralForStorage": [Function],
      "getCollateralInfo": [Function],
      "getConfirmationRiskByHash": [Function],
      "getContractEvents": [Function],
      "getDepositList": [Function],
      "getEpochNumber": [Function],
      "getEpochReceipts": [Function],
      "getFeeBurnt": [Function],
      "getFeeHistory": [Function],
      "getFilterChanges": [Function],
      "getFilterLogs": [Function],
      "getGasPrice": [Function],
      "getInterestRate": [Function],
      "getLogs": [Function],
      "getNextNonce": [Function],
      "getParamsFromVote": [Function],
      "getPoSAccount": [Function],
      "getPoSBlock": [Function],
      "getPoSCommittee": [Function],
      "getPoSEconomics": [Function],
      "getPoSRewardByEpoch": [Function],
      "getPoSRewards": [Function],
      "getPoSStatus": [Function],
      "getPoSTransactionByNumber": [Function],
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
      "key": "public",
      "multicall": [Function],
      "name": "Public Client",
      "pollingInterval": 4000,
      "readContract": [Function],
      "request": [Function],
      "sendRawTransaction": [Function],
      "simulateContract": [Function],
      "traceBlock": [Function],
      "traceTransaction": [Function],
      "transport": {
        "key": "mock",
        "name": "Mock Transport",
        "request": [MockFunction spy],
        "retryCount": 3,
        "retryDelay": 150,
        "timeout": undefined,
        "type": "mock",
      },
      "type": "publicClient",
      "uninstallFilter": [Function],
      "verifyMessage": [Function],
      "verifyTypedData": [Function],
      "waitForTransactionReceipt": [Function],
      "watchEpochNumber": [Function],
    }
  `)
})
test('args: batch', () => {
  expect(
    createPublicClient({
      batch: {
        multicall: true,
      },
      chain: localhostNode,
      transport: http(),
    }).batch,
  ).toMatchInlineSnapshot(`
      {
        "multicall": true,
      }
    `)

  expect(
    createPublicClient({
      batch: {
        multicall: {
          batchSize: 2048,
          wait: 32,
        },
      },
      chain: localhostNode,
      transport: http(),
    }).batch,
  ).toMatchInlineSnapshot(`
      {
        "multicall": {
          "batchSize": 2048,
          "wait": 32,
        },
      }
    `)
})

describe('transports', () => {
  test('http', () => {
    const { uid, ...client } = createPublicClient({
      chain: localhostNode,
      transport: http(),
    })

    expect(uid).toBeDefined()
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
        "createContractEventFilter": [Function],
        "createEventFilter": [Function],
        "createPendingTransactionFilter": [Function],
        "estimateContractGasAndCollateral": [Function],
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
        "getChainId": [Function],
        "getClientVersion": [Function],
        "getCode": [Function],
        "getCollateralForStorage": [Function],
        "getCollateralInfo": [Function],
        "getConfirmationRiskByHash": [Function],
        "getContractEvents": [Function],
        "getDepositList": [Function],
        "getEpochNumber": [Function],
        "getEpochReceipts": [Function],
        "getFeeBurnt": [Function],
        "getFeeHistory": [Function],
        "getFilterChanges": [Function],
        "getFilterLogs": [Function],
        "getGasPrice": [Function],
        "getInterestRate": [Function],
        "getLogs": [Function],
        "getNextNonce": [Function],
        "getParamsFromVote": [Function],
        "getPoSAccount": [Function],
        "getPoSBlock": [Function],
        "getPoSCommittee": [Function],
        "getPoSEconomics": [Function],
        "getPoSRewardByEpoch": [Function],
        "getPoSRewards": [Function],
        "getPoSStatus": [Function],
        "getPoSTransactionByNumber": [Function],
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
        "key": "public",
        "multicall": [Function],
        "name": "Public Client",
        "pollingInterval": 4000,
        "readContract": [Function],
        "request": [Function],
        "sendRawTransaction": [Function],
        "simulateContract": [Function],
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
        "type": "publicClient",
        "uninstallFilter": [Function],
        "verifyMessage": [Function],
        "verifyTypedData": [Function],
        "waitForTransactionReceipt": [Function],
        "watchEpochNumber": [Function],
      }
    `)
  })
  test('webSocket', () => {
    const { uid, ...client } = createPublicClient({
      chain: localhostNode,
      transport: webSocket(localhostNode.rpcUrls.default.webSocket[0]),
    })

    expect(uid).toBeDefined()
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
        "createContractEventFilter": [Function],
        "createEventFilter": [Function],
        "createPendingTransactionFilter": [Function],
        "estimateContractGasAndCollateral": [Function],
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
        "getChainId": [Function],
        "getClientVersion": [Function],
        "getCode": [Function],
        "getCollateralForStorage": [Function],
        "getCollateralInfo": [Function],
        "getConfirmationRiskByHash": [Function],
        "getContractEvents": [Function],
        "getDepositList": [Function],
        "getEpochNumber": [Function],
        "getEpochReceipts": [Function],
        "getFeeBurnt": [Function],
        "getFeeHistory": [Function],
        "getFilterChanges": [Function],
        "getFilterLogs": [Function],
        "getGasPrice": [Function],
        "getInterestRate": [Function],
        "getLogs": [Function],
        "getNextNonce": [Function],
        "getParamsFromVote": [Function],
        "getPoSAccount": [Function],
        "getPoSBlock": [Function],
        "getPoSCommittee": [Function],
        "getPoSEconomics": [Function],
        "getPoSRewardByEpoch": [Function],
        "getPoSRewards": [Function],
        "getPoSStatus": [Function],
        "getPoSTransactionByNumber": [Function],
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
        "key": "public",
        "multicall": [Function],
        "name": "Public Client",
        "pollingInterval": 4000,
        "readContract": [Function],
        "request": [Function],
        "sendRawTransaction": [Function],
        "simulateContract": [Function],
        "traceBlock": [Function],
        "traceTransaction": [Function],
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
        "type": "publicClient",
        "uninstallFilter": [Function],
        "verifyMessage": [Function],
        "verifyTypedData": [Function],
        "waitForTransactionReceipt": [Function],
        "watchEpochNumber": [Function],
      }
    `)
  })

  test('custom', () => {
    const { uid, ...client } = createPublicClient({
      transport: custom({ request: async () => null }),
    })

    expect(uid).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "call": [Function],
        "ccipRead": undefined,
        "chain": undefined,
        "checkBalanceAgainstTransaction": [Function],
        "createBlockFilter": [Function],
        "createContractEventFilter": [Function],
        "createEventFilter": [Function],
        "createPendingTransactionFilter": [Function],
        "estimateContractGasAndCollateral": [Function],
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
        "getChainId": [Function],
        "getClientVersion": [Function],
        "getCode": [Function],
        "getCollateralForStorage": [Function],
        "getCollateralInfo": [Function],
        "getConfirmationRiskByHash": [Function],
        "getContractEvents": [Function],
        "getDepositList": [Function],
        "getEpochNumber": [Function],
        "getEpochReceipts": [Function],
        "getFeeBurnt": [Function],
        "getFeeHistory": [Function],
        "getFilterChanges": [Function],
        "getFilterLogs": [Function],
        "getGasPrice": [Function],
        "getInterestRate": [Function],
        "getLogs": [Function],
        "getNextNonce": [Function],
        "getParamsFromVote": [Function],
        "getPoSAccount": [Function],
        "getPoSBlock": [Function],
        "getPoSCommittee": [Function],
        "getPoSEconomics": [Function],
        "getPoSRewardByEpoch": [Function],
        "getPoSRewards": [Function],
        "getPoSStatus": [Function],
        "getPoSTransactionByNumber": [Function],
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
        "key": "public",
        "multicall": [Function],
        "name": "Public Client",
        "pollingInterval": 4000,
        "readContract": [Function],
        "request": [Function],
        "sendRawTransaction": [Function],
        "simulateContract": [Function],
        "traceBlock": [Function],
        "traceTransaction": [Function],
        "transport": {
          "key": "custom",
          "name": "Custom Provider",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": undefined,
          "type": "custom",
        },
        "type": "publicClient",
        "uninstallFilter": [Function],
        "verifyMessage": [Function],
        "verifyTypedData": [Function],
        "waitForTransactionReceipt": [Function],
        "watchEpochNumber": [Function],
      }
    `)
  })
})
