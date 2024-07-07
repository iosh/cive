import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getBalance } from './getBalance.js'
import { getBlock } from './getBlock.js'

import { parseCFX } from '../../unit/parseCFX.js'
import { generateLocalNodeBlock } from '../localNode/generateLocalNodeBlock.js'
import { sendTransaction } from '../wallet/sendTransaction.js'

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

test('gets balance', async () => {
  expect(
    await getBalance(client, { address: sourceAccount.address }),
  ).toMatchInlineSnapshot('10000000000000000000000n')
})

test('gets balance at latest_state', async () => {
  expect(
    await getBalance(client, {
      address: targetAccount.address,
      epochTag: 'latest_state',
    }),
  ).toMatchInlineSnapshot('10000000000000000000000n')
})

test('gets balance at block number', async () => {
  const currentBlock = await getBlock(client, {
    epochTag: 'latest_state',
  })
  expect(
    await getBalance(client, {
      address: targetAccount.address,
      epochNumber: currentBlock.blockNumber,
    }),
  ).toMatchInlineSnapshot('10000000000000000000000n')
})

test('gets balance when transaction', async () => {
  await sendTransaction(client, {
    value: parseCFX('10'),
    to: targetAccount.address,
    account: sourceAccount,
  })
  await generateLocalNodeBlock(client, { numTxs: 1, blockSizeLimit: 1024 })

  expect(
    await getBalance(client, { address: sourceAccount.address }),
  ).toMatchInlineSnapshot('9989999974800000000000n')

  expect(
    await getBalance(client, { address: targetAccount.address }),
  ).toMatchInlineSnapshot('10010000000000000000000n')
})
