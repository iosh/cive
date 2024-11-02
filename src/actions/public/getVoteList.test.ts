import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { getVoteList } from './getVoteList.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

const sourceAccount = getTestAccount(accounts[0])

test('default', async () => {
  expect(
    await getVoteList(client, { address: sourceAccount.address }),
  ).toMatchInlineSnapshot('[]')
})

test('epochNumber', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })

  expect(
    await getVoteList(client, {
      address: sourceAccount.address,
      epochNumber: 1n,
    }),
  ).toMatchInlineSnapshot('[]')

  expect(
    await getVoteList(client, {
      address: sourceAccount.address,
      epochNumber: 3n,
    }),
  ).toMatchInlineSnapshot('[]')
  expect(
    await getVoteList(client, {
      address: sourceAccount.address,
      epochNumber: 5n,
    }),
  ).toMatchInlineSnapshot('[]')
})

test('epoch tag', async () => {
  expect(
    await getVoteList(client, {
      address: sourceAccount.address,
      epochTag: 'latest_state',
    }),
  ).toMatchInlineSnapshot('[]')

  expect(
    await getVoteList(client, {
      address: sourceAccount.address,
      epochTag: 'latest_confirmed',
    }),
  ).toMatchInlineSnapshot('[]')
  expect(
    await getVoteList(client, {
      address: sourceAccount.address,
      epochTag: 'latest_checkpoint',
    }),
  ).toMatchInlineSnapshot('[]')
  expect(
    await getVoteList(client, {
      address: sourceAccount.address,
      epochTag: 'earliest',
    }),
  ).toMatchInlineSnapshot('[]')
})
