import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getTransaction } from './getTransaction.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

const sourceAccount = getTestAccount(accounts[0])
test('default', async () => {
  const hash = await sendTransaction(client, {
    account: sourceAccount,
    to: sourceAccount.address,
  })

  await mine(client, { numTxs: 1 })

  const tx = await getTransaction(client, { hash })
  expect(Object.keys(tx)).toMatchInlineSnapshot(`
    [
      "blockHash",
      "chainId",
      "contractCreated",
      "data",
      "epochHeight",
      "from",
      "gas",
      "gasPrice",
      "hash",
      "nonce",
      "r",
      "s",
      "status",
      "storageLimit",
      "to",
      "transactionIndex",
      "type",
      "v",
      "value",
    ]
  `)
  expect(tx.type).toMatchInlineSnapshot(`"legacy"`)
  expect(tx.chainId).toMatchInlineSnapshot('201029')
  expect(tx.data).toMatchInlineSnapshot(`"0x"`)
  expect(tx.to).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )
  expect(tx.from).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )
  expect(tx.hash).toMatchInlineSnapshot(
    `"0x2e277f2031cb9dcb57d174b99e1f33f4f0141f5bd2e6ddbfa9675ddbedff164b"`,
  )
  expect(tx.nonce).toMatchInlineSnapshot('0')
  expect(tx.r).toMatchInlineSnapshot(
    `"0xcf3f05859dd82398bec754f12f8ba4bf60cf9d98ed6d2a1397a919fd5e69ccc2"`,
  )
  expect(tx.s).toMatchInlineSnapshot(
    `"0x491b9484ef00f5e7f4b2e7bd687ccbba5d3b2c7b3bc531fb50468dae9f4e57d2"`,
  )
})

test('get transaction 1559', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  const hash = await sendTransaction(client, {
    account: sourceAccount,
    to: sourceAccount.address,
  })

  await mine(client, { numTxs: 1 })

  const tx = await getTransaction(client, { hash })

  expect(Object.keys(tx)).toMatchInlineSnapshot(`
    [
      "accessList",
      "blockHash",
      "chainId",
      "contractCreated",
      "data",
      "epochHeight",
      "from",
      "gas",
      "gasPrice",
      "hash",
      "maxFeePerGas",
      "maxPriorityFeePerGas",
      "nonce",
      "r",
      "s",
      "status",
      "storageLimit",
      "to",
      "transactionIndex",
      "type",
      "v",
      "value",
      "yParity",
    ]
  `)
  expect(tx.type).toMatchInlineSnapshot(`"eip1559"`)
  expect(tx.chainId).toMatchInlineSnapshot('201029')
  expect(tx.data).toMatchInlineSnapshot(`"0x"`)
  expect(tx.maxFeePerGas).toMatchInlineSnapshot('4000001n')
  expect(tx.maxPriorityFeePerGas).toMatchInlineSnapshot('4000000n')
  expect(tx.gasPrice).toMatchInlineSnapshot('4000001n')
  expect(tx.yParity).toMatchInlineSnapshot(`"0x1"`)
})
