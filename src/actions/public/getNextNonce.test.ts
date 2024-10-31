import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { mine } from '../test/mine.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getBlock } from './getBlock.js'
import { getNextNonce } from './getNextNonce.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getNextNonce(client, { address: sourceAccount.address })).toBe(0)
})

test('with epoch tag', async () => {
  await sendTransaction(client, {
    account: sourceAccount,
    value: 0n,
    to: sourceAccount.address,
  })

  await mine(client, { numTxs: 1 })
  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      epochNumber: 0n,
    }),
  ).toBe(1)

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      tryTxPool: false,
      epochTag: 'earliest',
    }),
  ).toBe(0)

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      tryTxPool: false,
      epochTag: 'latest_checkpoint',
    }),
  ).toBe(0)

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      tryTxPool: false,
      epochTag: 'latest_confirmed',
    }),
  ).toBe(0)

  await generateEmptyLocalNodeBlocks(client, { numBlocks: 50 })

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      tryTxPool: false,
      epochTag: 'latest_confirmed',
    }),
  ).toBe(1)

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      tryTxPool: false,
      epochTag: 'latest_state',
    }),
  ).toBe(1)
})

test('with epoch number', async () => {
  await sendTransaction(client, {
    account: sourceAccount,
    value: 0n,

    to: sourceAccount.address,
  })

  await mine(client, { numTxs: 1 })
  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      tryTxPool: false,
      epochNumber: 1n,
    }),
  ).toBe(1)

  const block = await getBlock(client, { epochTag: 'latest_state' })

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      tryTxPool: false,
      epochNumber: block.blockNumber,
    }),
  ).toBe(2)
})

test('with tryTxPool', async () => {
  await sendTransaction(client, {
    account: sourceAccount,
    value: 0n,

    to: sourceAccount.address,
  })
  await sendTransaction(client, {
    account: sourceAccount,
    value: 0n,

    to: sourceAccount.address,
  })
  await sendTransaction(client, {
    account: sourceAccount,
    value: 0n,

    to: sourceAccount.address,
  })
  await sendTransaction(client, {
    account: sourceAccount,
    value: 0n,

    to: sourceAccount.address,
  })
  // there is 4 tx in tx pool and 2 is executed
  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
    }),
  ).toBe(6)
})
