import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { accounts, getTestAccount } from '../../../test/src/constants.js'

import { deployTest20 } from '../../../test/src/utils.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'
import { checkBalanceAgainstTransaction } from './checkBalanceAgainstTransaction.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient()

beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const client = devConflux.getClient({
    account: sourceAccount,
  })

  const { contractCreated } = await deployTest20(client)

  expect(
    await checkBalanceAgainstTransaction(client, {
      accountAddress: sourceAccount.address,
      contractAddress: contractCreated!,
      gasLimit: 1000000,
      gasPrice: 1000000000,
      storageLimit: 1000000,
    }),
  ).toMatchInlineSnapshot(`
    {
      "isBalanceEnough": true,
      "willPayCollateral": true,
      "willPayTxFee": true,
    }
  `)

  expect(
    await checkBalanceAgainstTransaction(client, {
      accountAddress: sourceAccount.address,
      contractAddress: contractCreated!,
      gasLimit: 1000000000000000,
      gasPrice: 1000000000000000,
      storageLimit: 100000000000000,
    }),
  ).toMatchInlineSnapshot(`
    {
      "isBalanceEnough": false,
      "willPayCollateral": true,
      "willPayTxFee": true,
    }
  `)
})
