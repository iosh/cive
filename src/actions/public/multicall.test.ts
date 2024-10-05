import { afterAll, beforeAll, expect, test, vi } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { Test20 } from '~test/src/contracts/Test20.js'
import { deployMulticall3, deployTest20 } from '~test/src/utils.js'
import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getBlock } from './getBlock.js'
import { multicall } from './multicall.js'
import * as readContract from './readContract.js'
import type { Address } from '~cive/accounts/types.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({ account: sourceAccount })

let test20: { contractCreated: Address | null }
let test20Other: { contractCreated: Address | null }
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  const { contractCreated } = await deployMulticall3(client)
  const block = await getBlock(client)
  client.chain.contracts = {
    multicall3: {
      address: contractCreated!,
      epochCreated: Number(block.epochNumber),
    },
  }
  await mine(client, { blocks: 10 })
  test20 = await deployTest20(client)
  test20Other = await deployTest20(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const spy = vi.spyOn(readContract, 'readContract')

  const block = await getBlock(client)

  expect(
    await multicall(client, {
      epochNumber: block.epochNumber,
      contracts: [
        {
          abi: Test20.abi,
          functionName: 'name',
          address: test20.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'symbol',
          address: test20Other.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'totalSupply',
          address: test20.contractCreated!,
        },
      ],
    }),
  ).toMatchInlineSnapshot(`
    [
      {
        "result": "Test20",
        "status": "success",
      },
      {
        "result": "TEST",
        "status": "success",
      },
      {
        "result": 0n,
        "status": "success",
      },
    ]
  `)
  expect(spy).toHaveBeenCalledOnce()
})

test('args: allowFailure', async () => {
  const block = await getBlock(client)
  expect(
    await multicall(client, {
      epochNumber: block.epochNumber,
      contracts: [
        {
          abi: Test20.abi,
          functionName: 'name',
          address: test20.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'symbol',
          address: test20Other.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'totalSupply',
          address: test20.contractCreated!,
        },
      ],
    }),
  ).toMatchInlineSnapshot(`
    [
      {
        "result": "Test20",
        "status": "success",
      },
      {
        "result": "TEST",
        "status": "success",
      },
      {
        "result": 0n,
        "status": "success",
      },
    ]
  `)
})

test('args: batchSize', async () => {
  const block = await getBlock(client)
  expect(
    await multicall(client, {
      batchSize: 30,
      epochNumber: block.epochNumber,
      contracts: [
        {
          abi: Test20.abi,
          functionName: 'name',
          address: test20.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'symbol',
          address: test20Other.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'totalSupply',
          address: test20.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'name',
          address: test20.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'symbol',
          address: test20Other.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'totalSupply',
          address: test20.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'name',
          address: test20.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'symbol',
          address: test20Other.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'totalSupply',
          address: test20.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'name',
          address: test20.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'symbol',
          address: test20Other.contractCreated!,
        },
        {
          abi: Test20.abi,
          functionName: 'totalSupply',
          address: test20.contractCreated!,
        },
      ],
    }),
  ).toMatchInlineSnapshot(`
    [
      {
        "result": "Test20",
        "status": "success",
      },
      {
        "result": "TEST",
        "status": "success",
      },
      {
        "result": 0n,
        "status": "success",
      },
      {
        "result": "Test20",
        "status": "success",
      },
      {
        "result": "TEST",
        "status": "success",
      },
      {
        "result": 0n,
        "status": "success",
      },
      {
        "result": "Test20",
        "status": "success",
      },
      {
        "result": "TEST",
        "status": "success",
      },
      {
        "result": 0n,
        "status": "success",
      },
      {
        "result": "Test20",
        "status": "success",
      },
      {
        "result": "TEST",
        "status": "success",
      },
      {
        "result": 0n,
        "status": "success",
      },
    ]
  `)
})
