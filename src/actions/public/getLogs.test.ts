import { parseUnits } from 'viem'
import {
  afterAll,
  assertType,
  beforeAll,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  test,
} from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { deployTest20 } from '../../../test/src/utils.js'
import type { Address } from '../../accounts/types.js'

import { mine } from '../test/mine.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'

import type { Log } from '../../types/log.js'
import { writeContract } from '../wallet/writeContract.js'
import { getBlock } from './getBlock.js'
import { getLogs } from './getLogs.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({ account: sourceAccount })
let Test20Address: Address
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  const { contractCreated } = await deployTest20(client)
  Test20Address = contractCreated!
  await writeContract(client, {
    address: Test20Address!,
    abi: Test20.abi,
    functionName: 'mint',
    args: [sourceAccount.address, parseUnits('1000', 18)],
  })
  await mine(client)
})
afterAll(async () => {
  await devConflux.stop()
})

beforeEach(async () => await mine(client, { numTxs: 10 }))
const event = {
  default: {
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  approve: {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
  },
  invalid: {
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  unnamed: {
    inputs: [
      {
        indexed: true,
        type: 'address',
      },
      {
        indexed: true,
        type: 'address',
      },
      {
        indexed: false,
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
} as const

test('default', async () => {
  await mine(client, { blocks: 1 })
  const logs = await getLogs(client)
  expect(logs.length).toBe(1)
})

describe('events', () => {
  test('no args', async () => {
    const block = await getBlock(client)
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, 1n],
    })
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, 1n],
    })
    await mine(client, { numTxs: 2 })

    const logs = await getLogs(client, {
      fromEpoch: block.epochNumber,
      toEpoch: 'latest_state',
    })
    assertType<Log[]>(logs)
    expect(logs.length).toBe(2)
  })

  test('args: event', async () => {
    const block = await getBlock(client)
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, 1n],
    })
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, 1n],
    })
    await mine(client, { numTxs: 2 })

    const logs = await getLogs(client, {
      event: event.default,
      fromEpoch: block.epochNumber,
      toEpoch: 'latest_state',
    })
    expectTypeOf(logs).toEqualTypeOf<
      Log<bigint, number, typeof event.default>[]
    >()

    expect(logs.length).toBe(2)

    expect(logs[0].eventName).toEqual('Transfer')
    expect(logs[1].eventName).toEqual('Transfer')
  })

  test('args: events', async () => {
    const block = await getBlock(client)
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'approve',
      args: [accounts[1].base32Address, 1n],
    })
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, 1n],
    })

    await mine(client, { numTxs: 2 })

    const logs = await getLogs(client, {
      events: [event.default, event.approve] as const,
      fromEpoch: block.epochNumber,
      toEpoch: 'latest_state',
    })

    expect(logs.length).toBe(2)
    expect(logs[0].eventName).toEqual('Approval')
    expect(logs[1].eventName).toEqual('Transfer')
  })
})
