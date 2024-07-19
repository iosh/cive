import { parseUnits } from 'viem'
import {
  afterAll,
  assertType,
  beforeAll,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  onTestFinished,
  test,
} from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { deployTest20 } from '../../../test/src/utils.js'
import type { Address } from '../../accounts/types.js'
import type { Log } from '../../types/log.js'
import type { Hash } from '../../types/misc.js'
import { parseCFX } from '../../unit/parseCFX.js'
import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { writeContract } from '../wallet/writeContract.js'
import { createBlockFilter } from './createBlockFilter.js'
import { createContractEventFilter } from './createContractEventFilter.js'
import { createEventFilter } from './createEventFilter.js'
import { createPendingTransactionFilter } from './createPendingTransactionFilter.js'
import { getBalance } from './getBalance.js'
import { getBlock } from './getBlock.js'
import { getFilterChanges } from './getFilterChanges.js'
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
  await mine(client, { blocks: 10 })
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
  const filter = await createPendingTransactionFilter(client)
  expect(await getFilterChanges(client, { filter })).toMatchInlineSnapshot('[]')
})

test('pending txns', async () => {
  const filter = await createPendingTransactionFilter(client)

  await sendTransaction(client, {
    account: sourceAccount,
    to: accounts[1].base32Address,
    value: parseCFX('1'),
  })

  await sendTransaction(client, {
    account: sourceAccount,
    to: accounts[1].base32Address,
    value: parseCFX('1'),
  })
  let hashes = await getFilterChanges(client, { filter })

  assertType<Hash[]>(hashes)
  expect(hashes.length).toBe(2)

  await mine(client, { numTxs: 2 })

  hashes = await getFilterChanges(client, { filter })
  expect(hashes.length).toBe(0)

  await sendTransaction(client, {
    account: sourceAccount,
    to: accounts[1].base32Address,
    value: parseCFX('1'),
  })

  hashes = await getFilterChanges(client, { filter })
  expect(hashes.length).toBe(1)
})

test('new blocks', async () => {
  const filter = await createBlockFilter(client)

  await mine(client, { blocks: 2 })

  let hashes = await getFilterChanges(client, { filter })
  assertType<Hash[]>(hashes)
  expect(hashes.length).toBe(2)

  hashes = await getFilterChanges(client, { filter })
  expect(hashes.length).toBe(0)

  await mine(client, { blocks: 1 })

  hashes = await getFilterChanges(client, { filter })
  expect(hashes.length).toBe(1)
})

describe('contract events', () => {
  test('no args', async () => {
    const filter = await createContractEventFilter(client, {
      abi: Test20.abi,
    })

    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, parseUnits('1', 18)],
    })
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, parseUnits('1', 18)],
    })
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'approve',
      args: [accounts[1].base32Address, parseUnits('1', 18)],
    })
    await mine(client, { numTxs: 3 })

    const logs = await getFilterChanges(client, {
      filter,
    })
    assertType<Log<bigint, number, undefined, false, typeof Test20.abi>[]>(logs)
    expect(logs.length).toBe(3)

    expect(logs[0].eventName).toEqual('Transfer')

    expect(logs[1].eventName).toEqual('Transfer')

    expect(logs[2].eventName).toEqual('Approval')
  })

  test('args: fromBlock/toBlock', async () => {
    for (let i = 0; i < 50; i++) {
      await writeContract(client, {
        address: Test20Address!,
        abi: Test20.abi,
        functionName: 'transfer',
        args: [accounts[1].base32Address, parseUnits('1', 18)],
      })
    }
    const block = await getBlock(client)
    await mine(client, { numTxs: 50 })
    const blockNew = await getBlock(client)
    const filter = await createContractEventFilter(client, {
      abi: Test20.abi,
      eventName: 'Transfer',
      fromBlock: blockNew.blockNumber,
      toBlock: block.blockNumber,
    })

    const logs = await getFilterChanges(client, { filter })

    assertType<
      Log<bigint, number, undefined, false, typeof Test20.abi, 'Transfer'>[]
    >(logs)
    expect(logs.length).toBe(50)
  })
})

describe('events', () => {
  test('no args', async () => {
    const filter = await createEventFilter(client)
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, parseUnits('1', 18)],
    })
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, parseUnits('1', 18)],
    })
    await mine(client, { numTxs: 2 })
    let logs = await getFilterChanges(client, { filter })
    assertType<Log[]>(logs)
    expect(logs.length).toBe(2)
    logs = await getFilterChanges(client, { filter })
    expect(logs.length).toBe(0)
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, parseUnits('1', 18)],
    })
    await mine(client)
    logs = await getFilterChanges(client, { filter })
    expect(logs.length).toBe(1)
  })

  test('args: event', async () => {
    const filter = await createEventFilter(client, {
      event: event.default,
    })
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, parseUnits('1', 18)],
    })
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, parseUnits('1', 18)],
    })
    await mine(client, { numTxs: 2 })

    let logs = await getFilterChanges(client, { filter })

    expectTypeOf(logs).toEqualTypeOf<
      Log<bigint, number, typeof event.default>[]
    >()
    expectTypeOf(logs[0].eventName).toEqualTypeOf<'Transfer'>()

    expect(logs.length).toBe(2)
    expect(logs[0].eventName).toEqual('Transfer')
    expect(logs[1].eventName).toEqual('Transfer')

    logs = await getFilterChanges(client, { filter })
    expect(logs.length).toBe(0)

    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'transfer',
      args: [accounts[1].base32Address, parseUnits('1', 18)],
    })
    await mine(client)

    logs = await getFilterChanges(client, { filter })
    expect(logs.length).toBe(1)
    expect(logs[0].eventName).toEqual('Transfer')
  })
})
