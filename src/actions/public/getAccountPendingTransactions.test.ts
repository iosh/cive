import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { parseCFX } from '../../utils/unit/parseCFX.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getAccountPendingTransactions } from './getAccountPendingTransactions.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({ account: sourceAccount })

beforeAll(async () => {
  await devConflux.start()

  await sendTransaction(client, {
    to: sourceAccount.address,
    value: parseCFX('0.01'),
  })
  await sendTransaction(client, {
    to: sourceAccount.address,
    value: parseCFX('0.01'),
  })
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const pendingTransactions = await getAccountPendingTransactions(client, {
    address: sourceAccount.address,
  })

  expect(pendingTransactions.pendingCount).toBe(2n)
  expect(pendingTransactions.firstTxStatus).toBe('ready')
  expect(pendingTransactions.pendingTransactions.length).toBe(2)
})

test('with nonce', async () => {
  const pendingTransactions = await getAccountPendingTransactions(client, {
    address: sourceAccount.address,
    nonce: 1,
  })

  expect(pendingTransactions.pendingCount).toBe(1n)
  expect(pendingTransactions.firstTxStatus).toBe('ready')
  expect(pendingTransactions.pendingTransactions.length).toBe(1)

  expect(
    await getAccountPendingTransactions(client, {
      address: sourceAccount.address,
      nonce: 2,
    }),
  ).toMatchInlineSnapshot(`
    {
      "firstTxStatus": null,
      "pendingCount": 0n,
      "pendingTransactions": [],
    }
  `)
})

test('with limit', async () => {
  const pendingTransactions = await getAccountPendingTransactions(client, {
    address: sourceAccount.address,
    limit: 1,
  })

  expect(pendingTransactions.pendingCount).toBe(2n)
  expect(pendingTransactions.firstTxStatus).toBe('ready')
  expect(pendingTransactions.pendingTransactions.length).toBe(1)

  const pendingTransactions2 = await getAccountPendingTransactions(client, {
    address: sourceAccount.address,
    limit: 999,
  })

  expect(pendingTransactions2.pendingCount).toBe(2n)
  expect(pendingTransactions2.firstTxStatus).toBe('ready')
  expect(pendingTransactions2.pendingTransactions.length).toBe(2)
})
