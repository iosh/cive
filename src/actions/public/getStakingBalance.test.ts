import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { getStakingBalance } from './getStakingBalance.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  expect(
    await getStakingBalance(client, { address: accounts[0].base32Address }),
  ).toMatchInlineSnapshot('0n')
})

test('epochNumber', async () => {
  expect(
    await getStakingBalance(client, {
      address: accounts[0].base32Address,
      epochNumber: 1n,
    }),
  ).toMatchInlineSnapshot('0n')
  expect(
    await getStakingBalance(client, {
      address: accounts[0].base32Address,
      epochNumber: 3n,
    }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getStakingBalance(client, {
      address: accounts[0].base32Address,
      epochNumber: 6n,
    }),
  ).toMatchInlineSnapshot('0n')
})

test('epoch tag', async () => {
  expect(
    await getStakingBalance(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_state',
    }),
  ).toMatchInlineSnapshot('0n')
  expect(
    await getStakingBalance(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_confirmed',
    }),
  ).toMatchInlineSnapshot('0n')
  expect(
    await getStakingBalance(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_checkpoint',
    }),
  ).toMatchInlineSnapshot('0n')
  expect(
    await getStakingBalance(client, {
      address: accounts[0].base32Address,
      epochTag: 'earliest',
    }),
  ).toMatchInlineSnapshot('0n')
})
