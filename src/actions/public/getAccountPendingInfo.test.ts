import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getAccountPendingInfo } from './getAccountPendingInfo.js'

const sourceAccount = getTestAccount(accounts[0])
const targetAccount = getTestAccount(accounts[1])
const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(
    await getAccountPendingInfo(client, { address: sourceAccount.address }),
  ).toMatchInlineSnapshot(`
    {
      "localNonce": 0n,
      "nextPendingTx": 0n,
      "pendingCount": 0n,
      "pendingNonce": 0n,
    }
  `)

  expect(
    await getAccountPendingInfo(client, { address: targetAccount.address }),
  ).toMatchInlineSnapshot(`
    {
      "localNonce": 0n,
      "nextPendingTx": 0n,
      "pendingCount": 0n,
      "pendingNonce": 0n,
    }
  `)
})

test('with tx', async () => {
  await sendTransaction(client, {
    account: sourceAccount,
    value: 0n,
    to: targetAccount.address,
  })

  expect(
    await getAccountPendingInfo(client, { address: accounts[0].base32Address }),
  ).toMatchInlineSnapshot(`
    {
      "localNonce": 0n,
      "nextPendingTx": 34993918322552798075736612473029692312583248690501399920505890097382783775166n,
      "pendingCount": 1n,
      "pendingNonce": 0n,
    }
  `)
  await sendTransaction(client, {
    value: 0n,
    account: sourceAccount,
    to: targetAccount.address,
  })

  expect(
    await getAccountPendingInfo(client, { address: accounts[0].base32Address }),
  ).toMatchInlineSnapshot(`
    {
      "localNonce": 0n,
      "nextPendingTx": 34993918322552798075736612473029692312583248690501399920505890097382783775166n,
      "pendingCount": 2n,
      "pendingNonce": 0n,
    }
  `)

  await sendTransaction(client, {
    value: 0n,
    account: sourceAccount,
    to: targetAccount.address,
  })

  expect(
    await getAccountPendingInfo(client, { address: accounts[0].base32Address }),
  ).toMatchInlineSnapshot(`
    {
      "localNonce": 0n,
      "nextPendingTx": 34993918322552798075736612473029692312583248690501399920505890097382783775166n,
      "pendingCount": 3n,
      "pendingNonce": 0n,
    }
  `)
})
