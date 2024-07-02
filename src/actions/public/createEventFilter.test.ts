import { afterAll, assertType, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts } from '~test/src/constants.js'

import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'

import type { EIP1193RequestFn } from 'viem'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { createEventFilter } from './createEventFilter.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
})

afterAll(async () => {
  await devConflux.stop()
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
        indexed: true,
        name: 'tokenId',
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
        indexed: true,
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
} as const

const request = (() => {}) as unknown as EIP1193RequestFn
describe('default', () => {
  test('no args', async () => {
    const filter = await createEventFilter(client)
    assertType<typeof filter>({
      id: '0x',
      request,
      type: 'event',
    })
    expect(filter.id).toBeDefined()
    expect(filter.type).toBe('event')
    expect(filter.args).toBeUndefined()
    expect(filter.abi).toBeUndefined()
    expect(filter.eventName).toBeUndefined()
  })

  test('args: address', async () => {
    await createEventFilter(client, {
      address: accounts[0].base32Address,
    })
  })

  test('args: event', async () => {
    const filter = await createEventFilter(client, {
      event: event.default,
    })
    assertType<typeof filter>({
      abi: [event.default],
      eventName: 'Transfer',
      id: '0x',
      request,
      strict: undefined,
      type: 'event',
    })
    expect(filter.args).toBeUndefined()
    expect(filter.abi).toEqual([event.default])
    expect(filter.eventName).toEqual('Transfer')
  })

  test('args: events', async () => {
    const filter = await createEventFilter(client, {
      events: [event.default, event.approve],
    })
    assertType<typeof filter>({
      abi: [event.default, event.approve],
      eventName: undefined,
      id: '0x',
      request,
      strict: undefined,
      type: 'event',
    })
    expect(filter.args).toBeUndefined()
    expect(filter.abi).toEqual([event.default, event.approve])
    expect(filter.eventName).toBeUndefined()
  })

  test('args: args (named)', async () => {
    const filter = await createEventFilter(client, {
      event: event.default,
      args: {
        from: accounts[0].hexAddress,
        to: accounts[0].hexAddress,
      },
    })
    assertType<typeof filter>({
      abi: [event.default],
      args: {
        from: accounts[0].hexAddress,
        to: accounts[0].hexAddress,
      },
      eventName: 'Transfer',
      id: '0x',
      request,
      strict: undefined,
      type: 'event',
    })
    expect(filter.args).toEqual({
      from: accounts[0].hexAddress,
      to: accounts[0].hexAddress,
    })
    expect(filter.abi).toEqual([event.default])
    expect(filter.eventName).toEqual('Transfer')

    const filter2 = await createEventFilter(client, {
      event: event.default,
      args: {
        from: accounts[0].hexAddress,
      },
    })
    assertType<typeof filter2>({
      abi: [event.default],
      args: {
        from: accounts[0].hexAddress,
      },
      eventName: 'Transfer',
      id: '0x',
      request,
      strict: undefined,
      type: 'event',
    })
    expect(filter2.args).toEqual({
      from: accounts[0].hexAddress,
    })
    expect(filter2.abi).toEqual([event.default])
    expect(filter2.eventName).toEqual('Transfer')

    const filter3 = await createEventFilter(client, {
      event: event.default,
      args: {
        to: [accounts[0].hexAddress, accounts[1].hexAddress],
      },
    })
    assertType<typeof filter3>({
      abi: [event.default],
      args: {
        to: [accounts[0].hexAddress, accounts[1].hexAddress],
      },
      eventName: 'Transfer',
      id: '0x',
      request,
      strict: undefined,
      type: 'event',
    })
    expect(filter3.args).toEqual({
      to: [accounts[0].hexAddress, accounts[1].hexAddress],
    })
    expect(filter3.abi).toEqual([event.default])
    expect(filter3.eventName).toEqual('Transfer')
  })

  test('args: args (unnamed)', async () => {
    const filter1 = await createEventFilter(client, {
      event: event.unnamed,
      args: [accounts[0].hexAddress, accounts[1].hexAddress],
    })
    assertType<typeof filter1>({
      abi: [event.unnamed],
      args: [accounts[0].hexAddress, accounts[1].hexAddress],
      eventName: 'Transfer',
      id: '0x',
      request,
      strict: undefined,
      type: 'event',
    })
    expect(filter1.args).toEqual([
      accounts[0].hexAddress,
      accounts[1].hexAddress,
    ])
    expect(filter1.abi).toEqual([event.unnamed])
    expect(filter1.eventName).toEqual('Transfer')

    const filter2 = await createEventFilter(client, {
      event: event.unnamed,
      args: [[accounts[0].hexAddress, accounts[1].hexAddress]],
    })
    assertType<typeof filter2>({
      abi: [event.unnamed],
      args: [[accounts[0].hexAddress, accounts[1].hexAddress]],
      eventName: 'Transfer',
      id: '0x',
      request,
      strict: undefined,
      type: 'event',
    })
    expect(filter2.args).toEqual([
      [accounts[0].hexAddress, accounts[1].hexAddress],
    ])
    expect(filter2.abi).toEqual([event.unnamed])
    expect(filter2.eventName).toEqual('Transfer')

    const filter3 = await createEventFilter(client, {
      event: event.unnamed,
      args: [null, accounts[0].hexAddress],
    })
    assertType<typeof filter3>({
      abi: [event.unnamed],
      args: [null, accounts[0].hexAddress],
      eventName: 'Transfer',
      id: '0x',
      request,
      strict: undefined,
      type: 'event',
    })
    expect(filter3.args).toEqual([null, accounts[0].hexAddress])
    expect(filter3.abi).toEqual([event.unnamed])
    expect(filter3.eventName).toEqual('Transfer')
  })

  test('args: epoch', async () => {
    await createEventFilter(client, {
      event: event.default,
      fromBlock: 5n,
      toBlock: 8n,
    })
    await createEventFilter(client, {
      event: event.default,
      fromEpoch: 4n,
      toEpoch: 8n,
    })
  })

  test('args: block', async () => {
    await createEventFilter(client, {
      event: event.default,
      fromBlock: 5n,
      toBlock: 8n,
    })
    await createEventFilter(client, {
      event: event.default,
      fromBlock: 3n,
      toBlock: 9n,
    })
  })
})
