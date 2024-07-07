import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getDepositList } from './getDepositList.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(
    await getDepositList(client, { address: accounts[0].base32Address }),
  ).toMatchInlineSnapshot('[]')
})

test('with args epoch tag', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  expect(
    await getDepositList(client, {
      address: accounts[0].base32Address,
      epochTag: 'earliest',
    }),
  ).toMatchInlineSnapshot('[]')
  expect(
    await getDepositList(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_checkpoint',
    }),
  ).toMatchInlineSnapshot('[]')
  expect(
    await getDepositList(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_confirmed',
    }),
  ).toMatchInlineSnapshot('[]')
  expect(
    await getDepositList(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_finalized',
    }),
  ).toMatchInlineSnapshot('[]')
  expect(
    await getDepositList(client, {
      address: accounts[0].base32Address,
      epochTag: 'latest_state',
    }),
  ).toMatchInlineSnapshot('[]')
})

test('with args epoch number', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 50 })

  expect(
    await getDepositList(client, {
      address: accounts[0].base32Address,
      epochNumber: 10n,
    }),
  ).toMatchInlineSnapshot('[]')
  expect(
    await getDepositList(client, {
      address: accounts[0].base32Address,
      epochNumber: 20n,
    }),
  ).toMatchInlineSnapshot('[]')
  expect(
    await getDepositList(client, {
      address: accounts[0].base32Address,
      epochNumber: 30n,
    }),
  ).toMatchInlineSnapshot('[]')
})
