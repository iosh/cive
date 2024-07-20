import { formatUnits, parseUnits } from 'viem'
import {
  afterAll,
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

import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'

import type { Log } from '../../types/log.js'
import { writeContract } from '../wallet/writeContract.js'
import { createContractEventFilter } from './createContractEventFilter.js'
import { createEventFilter } from './createEventFilter.js'
import { getBlock } from './getBlock.js'
import { getFilterLogs } from './getFilterLogs.js'

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

afterAll(async () => {
  await devConflux.stop()
})
beforeEach(async () => await mine(client, { numTxs: 10 }))

test('default', async () => {
  const filter = await createEventFilter(client)
  expect(await getFilterLogs(client, { filter })).toMatchInlineSnapshot('[]')
})

describe('contract events', () => {
  test('no args', async () => {
    const block = await getBlock(client)
    const filter = await createContractEventFilter(client, {
      abi: Test20.abi,
      fromEpoch: block.epochNumber,
      toEpoch: 'latest_state',
    })

    await writeContract(client, {
      address: Test20Address,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[0].base32Address, parseUnits('1', 18)],
    })
    await writeContract(client, {
      address: Test20Address,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[0].base32Address, parseUnits('1', 18)],
    })
    await writeContract(client, {
      address: Test20Address,
      abi: Test20.abi,
      functionName: 'approve',
      args: [accounts[0].base32Address, parseUnits('1', 18)],
    })
    await mine(client, { numTxs: 3 })
    await mine(client, { blocks: 10 })
    const logs = await getFilterLogs(client, {
      filter,
    })

    expectTypeOf(logs).toEqualTypeOf<
      Log<bigint, number, undefined, false, typeof Test20.abi>[]
    >()

    expectTypeOf(logs[0].eventName).toEqualTypeOf<
      'Transfer' | 'Approval' | 'EIP712DomainChanged' | 'Paused' | 'Unpaused'
    >()
    expect(logs.length).toBe(3)
    expect(logs[0].address).toBe(Test20Address)
    expect(logs[0].eventName).toEqual('Transfer')
    expect(logs[1].eventName).toEqual('Transfer')
    expect(logs[2].eventName).toEqual('Approval')
  })
})

describe('args: eventName', () => {
  test('no args', async () => {
    const block = await getBlock(client)
    const filter = await createContractEventFilter(client, {
      abi: Test20.abi,
      eventName: 'Transfer',
      fromEpoch: block.epochNumber,
      toEpoch: 'latest_state',
    })

    await writeContract(client, {
      address: Test20Address,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[0].base32Address, parseUnits('1', 18)],
    })
    await writeContract(client, {
      address: Test20Address,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[0].base32Address, parseUnits('1', 18)],
    })
    await writeContract(client, {
      address: Test20Address,
      abi: Test20.abi,
      functionName: 'approve',
      args: [accounts[0].base32Address, parseUnits('1', 18)],
    })
    await mine(client, { numTxs: 3 })
    await mine(client, { blocks: 10 })
    const logs = await getFilterLogs(client, {
      filter,
    })

    expectTypeOf(logs).toEqualTypeOf<
      Log<bigint, number, undefined, false, typeof Test20.abi, 'Transfer'>[]
    >()

    expectTypeOf(logs[0].eventName).toEqualTypeOf<'Transfer'>()
    expect(logs.length).toBe(2)
    expect(logs[0].address).toBe(Test20Address)
    expect(logs[0].eventName).toEqual('Transfer')
    expect(logs[1].eventName).toEqual('Transfer')
  })
})
