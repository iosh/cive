import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getAccountPendingTransactions } from './getAccountPendingTransactions.js'

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
  expect(
    await getAccountPendingTransactions(client, {
      address: sourceAccount.address,
    }),
  ).toMatchInlineSnapshot(`
    {
      "firstTxStatus": null,
      "pendingCount": 0n,
      "pendingTransactions": [],
    }
  `)
})