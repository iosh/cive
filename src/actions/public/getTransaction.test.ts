import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { mine } from '../test/mine.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getTransaction } from './getTransaction.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
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
    `"0x2544af3be3c64246d01e2c38372f34135a55baefa90477d5e70ab2296065416e"`,
  )
  expect(tx.nonce).toMatchInlineSnapshot('0')
  expect(tx.r).toMatchInlineSnapshot(
    `"0xa3df516d1c0134073e2247d0e4004bcf9562f4cd0cba705ca04209d816c5b47c"`,
  )
  expect(tx.s).toMatchInlineSnapshot(
    `"0x53ad709a9e8a35428c85de544d964bef07f15c20f0516c523e8aa5565eb27058"`,
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
  expect(tx.maxFeePerGas).toMatchInlineSnapshot('1n')
  expect(tx.maxPriorityFeePerGas).toMatchInlineSnapshot('0n')
  expect(tx.gasPrice).toMatchInlineSnapshot('1n')
  expect(tx.yParity).toMatchInlineSnapshot(`"0x1"`)
})
