import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { mine } from '../test/mine.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getTransactionReceipt } from './getTransactionReceipt.js'

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
    value: 0n,
  })

  await mine(client, { numTxs: 1 })

  const receipt = await getTransactionReceipt(client, { hash })

  expect(Object.keys(receipt).sort()).toMatchInlineSnapshot(`
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
      "log",
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
    `"0x2544af3be3c64246d01e2c38372f34135a55baefa90477d5e70ab2296065416e"`,
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
