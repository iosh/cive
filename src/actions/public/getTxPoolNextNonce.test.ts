import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getTxPoolNextNonce } from './getTxPoolNextNonce.js'
import { getNextNonce } from './getNextNonce.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'

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
  await sendTransaction(client, {
    account: sourceAccount,
    from: sourceAccount.address,
    to: sourceAccount.address,
    value: 0n,
  })

  expect(
    await getTxPoolNextNonce(client, { address: sourceAccount.address }),
  ).toMatchInlineSnapshot('1')

  expect(
    await getNextNonce(client, { address: sourceAccount.address }),
  ).toMatchInlineSnapshot('1')
})