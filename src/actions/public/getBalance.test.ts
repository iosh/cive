import { afterAll, beforeAll, expect, test } from 'vitest'
import { accounts, getTestAccount } from '~test/src/conflux/accounts.js'
import { devConflux } from '~test/src/conflux/client.js'
import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getBalance } from './getBalance.js'
import { getBlock } from './getBlock.js'

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
