import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { getBalance } from './getBalance.js'
import { getBlock } from './getBlock.js'

import { parseCFX } from '../../utils/unit/parseCFX.js'
import { mine } from '../test/mine.js'
import { sendTransaction } from '../wallet/sendTransaction.js'

const sourceAccount = getTestAccount(accounts[0])
const targetAccount = getTestAccount(accounts[1])
const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
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
  await mine(client, { numTxs: 1 })

  expect(
    await getBalance(client, { address: sourceAccount.address }),
  ).toMatchInlineSnapshot('9989999979000000000000n')

  expect(
    await getBalance(client, { address: targetAccount.address }),
  ).toMatchInlineSnapshot('10010000000000000000000n')
})
