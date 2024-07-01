import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { signTransaction } from '../../accounts/index.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { prepareTransactionRequest } from '../wallet/prepareTransactionRequest.js'
import { sendRawTransaction } from '../wallet/sendRawTransaction.js'
import { getAccountPendingInfo } from './getAccountPendingInfo.js'

const sourceAccount = getTestAccount(accounts[0])
const targetAccount = getTestAccount(accounts[1])
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
  const sourceAccount = getTestAccount(accounts[0])
  const tx = await prepareTransactionRequest(client, {
    value: 0n,
    account: sourceAccount,
  })
  const rawTx = await signTransaction({
    privateKey: accounts[0].privateKey,
    transaction: tx,
  })

  await sendRawTransaction(client, { serializedTransaction: rawTx })

  expect(
    await getAccountPendingInfo(client, { address: accounts[0].base32Address }),
  ).toMatchInlineSnapshot(`
    {
      "localNonce": 1n,
      "nextPendingTx": 0n,
      "pendingCount": 0n,
      "pendingNonce": 0n,
    }
  `)

  const tx1 = await prepareTransactionRequest(client, {
    value: 0n,
    account: sourceAccount,
  })

  const rawTx1 = await signTransaction({
    privateKey: accounts[0].privateKey,
    transaction: tx1,
  })

  await sendRawTransaction(client, { serializedTransaction: rawTx1 })

  expect(
    await getAccountPendingInfo(client, { address: accounts[0].base32Address }),
  ).toMatchInlineSnapshot(`
    {
      "localNonce": 2n,
      "nextPendingTx": 0n,
      "pendingCount": 0n,
      "pendingNonce": 0n,
    }
  `)

  const tx2 = await prepareTransactionRequest(client, {
    value: 0n,
    account: sourceAccount,
  })

  const rawTx2 = await signTransaction({
    privateKey: accounts[0].privateKey,
    transaction: tx2,
  })

  await sendRawTransaction(client, { serializedTransaction: rawTx2 })

  expect(
    await getAccountPendingInfo(client, { address: accounts[0].base32Address }),
  ).toMatchInlineSnapshot(`
    {
      "localNonce": 3n,
      "nextPendingTx": 0n,
      "pendingCount": 0n,
      "pendingNonce": 0n,
    }
  `)
})
