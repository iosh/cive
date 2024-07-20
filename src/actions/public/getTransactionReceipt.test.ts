import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getTransactionReceipt } from './getTransactionReceipt.js'

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
    value: 0n,
  })

  await mine(client, { numTxs: 1 })

  const receipt = await getTransactionReceipt(client, { hash })

  expect(Object.keys(receipt)).toMatchInlineSnapshot(`
    [
      "blockHash",
      "burntGasFee",
      "contractCreated",
      "effectiveGasPrice",
      "epochNumber",
      "from",
      "gasCoveredBySponsor",
      "gasFee",
      "gasUsed",
      "index",
      "logs",
      "logsBloom",
      "outcomeStatus",
      "stateRoot",
      "storageCollateralized",
      "storageCoveredBySponsor",
      "storageReleased",
      "to",
      "transactionHash",
      "txExecErrorMsg",
      "type",
      "log",
    ]
  `)

  expect(receipt.type).toMatchInlineSnapshot(`"legacy"`)

  expect(receipt.from).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )

  expect(receipt.to).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )

  expect(receipt.transactionHash).toMatchInlineSnapshot(
    `"0x2e277f2031cb9dcb57d174b99e1f33f4f0141f5bd2e6ddbfa9675ddbedff164b"`,
  )

  expect(receipt.epochNumber).toMatchInlineSnapshot('1n')

  expect(receipt.index).toMatchInlineSnapshot('0n')
})

test('1559', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  const hash = await sendTransaction(client, {
    account: sourceAccount,
    to: sourceAccount.address,
    value: 0n,
  })

  await mine(client, { numTxs: 1 })

  const receipt = await getTransactionReceipt(client, { hash })

  expect(Object.keys(receipt)).toMatchInlineSnapshot(`
    [
      "blockHash",
      "burntGasFee",
      "contractCreated",
      "effectiveGasPrice",
      "epochNumber",
      "from",
      "gasCoveredBySponsor",
      "gasFee",
      "gasUsed",
      "index",
      "logs",
      "logsBloom",
      "outcomeStatus",
      "stateRoot",
      "storageCollateralized",
      "storageCoveredBySponsor",
      "storageReleased",
      "to",
      "transactionHash",
      "txExecErrorMsg",
      "type",
      "log",
    ]
  `)

  expect(receipt.type).toMatchInlineSnapshot(`"eip1559"`)

  expect(receipt.from).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )

  expect(receipt.to).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )

  expect(receipt.epochNumber).toMatchInlineSnapshot('16n')

  expect(receipt.index).toMatchInlineSnapshot('0n')
})
