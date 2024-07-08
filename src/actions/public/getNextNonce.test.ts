import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { generateLocalNodeBlock } from '../localNode/generateLocalNodeBlock.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
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

  await generateLocalNodeBlock(client, { numTxs: 10, blockSizeLimit: 10 })
  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      epochNumber: 0n,
    }),
  ).toBe(1)

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      epochTag: 'earliest',
    }),
  ).toBe(0)

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      epochTag: 'latest_checkpoint',
    }),
  ).toBe(0)

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      epochTag: 'latest_confirmed',
    }),
  ).toBe(0)

  await generateEmptyLocalNodeBlocks(client, { numBlocks: 50 })

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      epochTag: 'latest_confirmed',
    }),
  ).toBe(1)

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      epochTag: 'latest_state',
    }),
  ).toBe(1)

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      epochTag: 'latest_finalized',
    }),
  ).toBe(0)
})

test('with epoch number', async () => {
  await sendTransaction(client, {
    account: sourceAccount,
    value: 0n,
    to: sourceAccount.address,
  })

  await generateLocalNodeBlock(client, { numTxs: 1, blockSizeLimit: 10 })
  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      epochNumber: 1n,
    }),
  ).toBe(1)

  const block = await getBlock(client, { epochTag: 'latest_state' })

  expect(
    await getNextNonce(client, {
      address: sourceAccount.address,
      epochNumber: block.blockNumber,
    }),
  ).toBe(2)
})
