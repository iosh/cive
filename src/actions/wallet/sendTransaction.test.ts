import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { parseCFX } from '../../unit/parseCFX.js'
import { generateLocalNodeBlock } from '../localNode/generateLocalNodeBlock.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getBalance } from '../public/getBalance.js'
import { sendTransaction } from './sendTransaction.js'

const client = devConflux.getClient()
const sourceAccount = accounts[0]
const targetAccount = accounts[1]
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default local account', async () => {
  expect(
    await getBalance(client, { address: sourceAccount.base32Address }),
  ).toMatchInlineSnapshot('10000000000000000000000n')

  expect(
    await getBalance(client, { address: targetAccount.base32Address }),
  ).toMatchInlineSnapshot('10000000000000000000000n')

  expect(
    await sendTransaction(client, {
      account: getTestAccount(sourceAccount),
      to: targetAccount.base32Address,
      value: parseCFX('1'),
    }),
  ).toBeDefined()

  await generateLocalNodeBlock(client, { numTxs: 1, blockSizeLimit: 1024 })

  expect(
    await getBalance(client, { address: targetAccount.base32Address }),
  ).toMatchInlineSnapshot('10001000000000000000000n')
  expect(
    await getBalance(client, { address: sourceAccount.base32Address }),
  ).toBeLessThan(sourceAccount.balance)
})
