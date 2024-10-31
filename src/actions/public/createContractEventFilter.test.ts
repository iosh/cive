import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { deployTest20 } from '../../../test/src/utils.js'
import type { Address } from '../../accounts/types.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'
import { createContractEventFilter } from './createContractEventFilter.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({ account: sourceAccount })
let Test20Address: Address
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  const { contractCreated } = await deployTest20(client)
  Test20Address = contractCreated!
})

afterAll(async () => {
  await devConflux.stop()
})

test('args: address', async () => {
  const filter = await createContractEventFilter(client, {
    address: Test20Address,
    abi: Test20.abi,
  })
  expect(filter.id).toBeDefined()
})

test('args: args', async () => {
  const filter = await createContractEventFilter(client, {
    address: Test20Address,
    abi: Test20.abi,
    eventName: 'Transfer',
    args: {
      from: sourceAccount.address,
      to: sourceAccount.address,
    },
  })
  expect(filter.abi).toEqual(Test20.abi)
  expect(filter.args).toEqual({
    from: sourceAccount.address,
    to: sourceAccount.address,
  })
  expect(filter.eventName).toEqual('Transfer')

  const filter2 = await createContractEventFilter(client, {
    address: Test20Address,
    abi: Test20.abi,
    eventName: 'Transfer',
    args: {
      from: sourceAccount.address,
    },
  })

  expect(filter.abi).toEqual(Test20.abi)
  expect(filter2.args).toEqual({
    from: sourceAccount.address,
  })
  expect(filter.eventName).toEqual('Transfer')

  const filter3 = await createContractEventFilter(client, {
    address: Test20Address,
    abi: Test20.abi,
    eventName: 'Transfer',
    args: {
      to: [accounts[0].base32Address, accounts[1].base32Address],
    },
  })
  expect(filter.abi).toEqual(Test20.abi)
  expect(filter3.args).toEqual({
    to: [accounts[0].base32Address, accounts[1].base32Address],
  })
  expect(filter3.eventName).toEqual('Transfer')
})

test('args: epoch', async () => {
  expect(
    (
      await createContractEventFilter(client, {
        address: Test20Address,
        abi: Test20.abi,
        eventName: 'Transfer',
        fromEpoch: 'latest_state',
        toEpoch: 'latest_state',
      })
    ).id,
  ).toBeDefined()

  expect(
    (
      await createContractEventFilter(client, {
        address: Test20Address,
        abi: Test20.abi,
        eventName: 'Transfer',
        fromEpoch: 1n,
        toEpoch: 'latest_state',
      })
    ).id,
  ).toBeDefined()

  expect(
    (
      await createContractEventFilter(client, {
        address: Test20Address,
        abi: Test20.abi,
        eventName: 'Transfer',
        fromEpoch: 'latest_state',
        toEpoch: 1n,
      })
    ).id,
  ).toBeDefined()
})

test('args: block number', async () => {
  expect(
    (
      await createContractEventFilter(client, {
        address: Test20Address,
        abi: Test20.abi,
        eventName: 'Transfer',
        toBlock: 1n,
        fromBlock: 1n,
      })
    ).id,
  ).toBeDefined()
})
