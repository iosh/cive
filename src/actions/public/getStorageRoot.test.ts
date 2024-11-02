import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { deployTest20 } from '../../../test/src/utils.js'

import { mine } from '../test/mine.js'
import { getBlock } from './getBlock.js'
import { GetStorageRoot } from './getStorageRoot.js'

const client = devConflux.getClient({
  account: getTestAccount(accounts[0]),
})
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const { contractCreated } = await deployTest20(client)

  expect(
    await GetStorageRoot(client, {
      address: contractCreated!,
    }),
  ).toBeDefined()
  expect(
    await GetStorageRoot(client, {
      address: accounts[0].base32Address,
    }),
  ).toBeDefined()
})

test('epoch tag', async () => {
  const { contractCreated } = await deployTest20(client)
  await mine(client, { blocks: 1000 })
  expect(
    await GetStorageRoot(client, {
      address: contractCreated!,
      epochTag: 'earliest',
    }),
  ).toBeDefined()
  expect(
    await GetStorageRoot(client, {
      address: contractCreated!,
      epochTag: 'latest_checkpoint',
    }),
  ).toBeDefined()
  expect(
    await GetStorageRoot(client, {
      address: contractCreated!,
      epochTag: 'latest_confirmed',
    }),
  ).toBeDefined()
  expect(
    await GetStorageRoot(client, {
      address: contractCreated!,
      epochTag: 'latest_state',
    }),
  ).toBeDefined()
})

test('epoch number', async () => {
  const { contractCreated } = await deployTest20(client)
  const block = await getBlock(client)
  expect(
    await GetStorageRoot(client, {
      address: contractCreated!,
      epochNumber: block.epochNumber,
    }),
  ).toBeDefined()
})
