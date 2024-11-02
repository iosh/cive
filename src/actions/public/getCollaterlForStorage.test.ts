import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { getCollateralForStorage } from './getCollaterlForStorage.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(
    await getCollateralForStorage(client, {
      address: accounts[0].base32Address,
    }),
  ).toMatchInlineSnapshot('0n')
})

test('with args epoch tag', async () => {
  expect(
    await getCollateralForStorage(client, {
      address: accounts[0].base32Address,
      epochTag: 'earliest',
    }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getCollateralForStorage(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_checkpoint',
    }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getCollateralForStorage(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_confirmed',
    }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getCollateralForStorage(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_finalized',
    }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getCollateralForStorage(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_state',
    }),
  ).toMatchInlineSnapshot('0n')
})

test('with args epoch number', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 50 })

  expect(
    await getCollateralForStorage(client, {
      address: accounts[0].base32Address,
      epochNumber: 10n,
    }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getCollateralForStorage(client, {
      address: accounts[0].base32Address,
      epochNumber: 20n,
    }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getCollateralForStorage(client, {
      address: accounts[0].base32Address,
      epochNumber: 30n,
    }),
  ).toMatchInlineSnapshot('0n')
})
