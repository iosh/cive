import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { parseCFX } from '../../utils/unit/parseCFX.js'
import { getBalance } from '../public/getBalance.js'
import { mine } from '../test/mine.js'
import { sendTransaction } from './sendTransaction.js'

const client = devConflux.getClient()
const sourceAccount = accounts[0]
const targetAccount = accounts[1]
beforeAll(async () => {
  await devConflux.start()
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

  await mine(client, { numTxs: 1 })

  expect(
    await getBalance(client, { address: targetAccount.base32Address }),
  ).toMatchInlineSnapshot('10001000000000000000000n')
  expect(
    await getBalance(client, { address: sourceAccount.base32Address }),
  ).toBeLessThan(sourceAccount.balance)
})
