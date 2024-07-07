import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { generateLocalNodeBlock } from '../localNode/generateLocalNodeBlock.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getEpochReceipts } from './getEpochReceipts.js'

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
    await getEpochReceipts(client, { epochNumber: 0n }),
  ).toMatchInlineSnapshot('[]')

  const sourceAccount = getTestAccount(accounts[0])
  await sendTransaction(client, {
    value: 0n,
    account: sourceAccount,
  })
  await generateLocalNodeBlock(client, { numTxs: 10, blockSizeLimit: 1024 })
  const resultWithoutReceipts = await getEpochReceipts(client, {
    epochNumber: 1n,
  })

  expect(resultWithoutReceipts.length).toBe(1)
  expect(resultWithoutReceipts[0][0].epochNumber).toBe(1n)
  expect(resultWithoutReceipts[0][0].space).toBe(undefined)
  const resultWithReceipts = await getEpochReceipts(client, {
    epochNumber: 1n,
    includeTxReceipts: true,
  })

  expect(resultWithReceipts.length).toBe(1)
  expect(resultWithReceipts[0][0].space).toBe('native')
})
