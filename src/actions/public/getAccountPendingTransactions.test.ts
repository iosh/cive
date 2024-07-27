import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { parseCFX } from '../../utils/unit/parseCFX.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getAccountPendingTransactions } from './getAccountPendingTransactions.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({ account: sourceAccount })

beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)

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
  expect(
    await getAccountPendingTransactions(client, {
      address: sourceAccount.address,
    }),
  ).toMatchInlineSnapshot(`
    {
      "firstTxStatus": "ready",
      "pendingCount": 2n,
      "pendingTransactions": [
        {
          "blockHash": null,
          "chainId": 201029,
          "contractCreated": null,
          "data": "0x",
          "epochHeight": 0n,
          "from": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "gas": 21000n,
          "gasPrice": 1200000000n,
          "hash": "0xd96c3e5b62e7396971c9e88b52aee75962f485a795d250b65dcfa211d4fec1b5",
          "nonce": 0,
          "r": "0x3c9e64f061a7e902ba8fc8d68d71a3122cac15d32982792e6c6ade300059587f",
          "s": "0x7ca8d1618c58bb0bbf94846e442891ac00d717121f30393470770511db8d7e3a",
          "status": null,
          "storageLimit": 0n,
          "to": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "transactionIndex": null,
          "type": "legacy",
          "v": 1n,
          "value": 10000000000000000n,
        },
        {
          "blockHash": null,
          "chainId": 201029,
          "contractCreated": null,
          "data": "0x",
          "epochHeight": 0n,
          "from": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "gas": 21000n,
          "gasPrice": 1200000000n,
          "hash": "0x4b05eec3ebaa8ad200bded2d2d68754fa7e6c0a568bd91050b35236e2a97d76d",
          "nonce": 1,
          "r": "0x6cefd6d8bf9d2bc760ade644d4fa57a8105c2d5100e83c5aa240896de7e67365",
          "s": "0x342d80c056de4de57b033700c749f9dadfc407b063441b58f9b6eea02bb8e3d9",
          "status": null,
          "storageLimit": 0n,
          "to": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "transactionIndex": null,
          "type": "legacy",
          "v": 0n,
          "value": 10000000000000000n,
        },
      ],
    }
  `)
})

test('with nonce', async () => {
  expect(
    await getAccountPendingTransactions(client, {
      address: sourceAccount.address,
      nonce: 1,
    }),
  ).toMatchInlineSnapshot(`
    {
      "firstTxStatus": "ready",
      "pendingCount": 1n,
      "pendingTransactions": [
        {
          "blockHash": null,
          "chainId": 201029,
          "contractCreated": null,
          "data": "0x",
          "epochHeight": 0n,
          "from": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "gas": 21000n,
          "gasPrice": 1200000000n,
          "hash": "0x4b05eec3ebaa8ad200bded2d2d68754fa7e6c0a568bd91050b35236e2a97d76d",
          "nonce": 1,
          "r": "0x6cefd6d8bf9d2bc760ade644d4fa57a8105c2d5100e83c5aa240896de7e67365",
          "s": "0x342d80c056de4de57b033700c749f9dadfc407b063441b58f9b6eea02bb8e3d9",
          "status": null,
          "storageLimit": 0n,
          "to": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "transactionIndex": null,
          "type": "legacy",
          "v": 0n,
          "value": 10000000000000000n,
        },
      ],
    }
  `)

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
  expect(
    await getAccountPendingTransactions(client, {
      address: sourceAccount.address,
      limit: 1,
    }),
  ).toMatchInlineSnapshot(`
    {
      "firstTxStatus": "ready",
      "pendingCount": 2n,
      "pendingTransactions": [
        {
          "blockHash": null,
          "chainId": 201029,
          "contractCreated": null,
          "data": "0x",
          "epochHeight": 0n,
          "from": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "gas": 21000n,
          "gasPrice": 1200000000n,
          "hash": "0xd96c3e5b62e7396971c9e88b52aee75962f485a795d250b65dcfa211d4fec1b5",
          "nonce": 0,
          "r": "0x3c9e64f061a7e902ba8fc8d68d71a3122cac15d32982792e6c6ade300059587f",
          "s": "0x7ca8d1618c58bb0bbf94846e442891ac00d717121f30393470770511db8d7e3a",
          "status": null,
          "storageLimit": 0n,
          "to": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "transactionIndex": null,
          "type": "legacy",
          "v": 1n,
          "value": 10000000000000000n,
        },
      ],
    }
  `)

  expect(
    await getAccountPendingTransactions(client, {
      address: sourceAccount.address,
      limit: 999,
    }),
  ).toMatchInlineSnapshot(`
    {
      "firstTxStatus": "ready",
      "pendingCount": 2n,
      "pendingTransactions": [
        {
          "blockHash": null,
          "chainId": 201029,
          "contractCreated": null,
          "data": "0x",
          "epochHeight": 0n,
          "from": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "gas": 21000n,
          "gasPrice": 1200000000n,
          "hash": "0xd96c3e5b62e7396971c9e88b52aee75962f485a795d250b65dcfa211d4fec1b5",
          "nonce": 0,
          "r": "0x3c9e64f061a7e902ba8fc8d68d71a3122cac15d32982792e6c6ade300059587f",
          "s": "0x7ca8d1618c58bb0bbf94846e442891ac00d717121f30393470770511db8d7e3a",
          "status": null,
          "storageLimit": 0n,
          "to": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "transactionIndex": null,
          "type": "legacy",
          "v": 1n,
          "value": 10000000000000000n,
        },
        {
          "blockHash": null,
          "chainId": 201029,
          "contractCreated": null,
          "data": "0x",
          "epochHeight": 0n,
          "from": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "gas": 21000n,
          "gasPrice": 1200000000n,
          "hash": "0x4b05eec3ebaa8ad200bded2d2d68754fa7e6c0a568bd91050b35236e2a97d76d",
          "nonce": 1,
          "r": "0x6cefd6d8bf9d2bc760ade644d4fa57a8105c2d5100e83c5aa240896de7e67365",
          "s": "0x342d80c056de4de57b033700c749f9dadfc407b063441b58f9b6eea02bb8e3d9",
          "status": null,
          "storageLimit": 0n,
          "to": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
          "transactionIndex": null,
          "type": "legacy",
          "v": 0n,
          "value": 10000000000000000n,
        },
      ],
    }
  `)
})
