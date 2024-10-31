import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'
import { getAccount } from './getAccount.js'

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

test('default', async () => {
  expect(
    await getAccount(client, { address: sourceAccount.address }),
  ).toMatchInlineSnapshot(`
    {
      "accumulatedInterestReturn": 0n,
      "address": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
      "admin": "NET201029:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNF1HCG",
      "balance": 10000000000000000000000n,
      "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "collateralForStorage": 0n,
      "nonce": 0n,
      "stakingBalance": 0n,
    }
  `)
  expect(
    await getAccount(client, { address: targetAccount.address }),
  ).toMatchInlineSnapshot(`
    {
      "accumulatedInterestReturn": 0n,
      "address": "NET201029:TYPE.USER:AAMX7S8G19HS0ZG2793WKV6BFEFKMNG0BUBDY0TXAA",
      "admin": "NET201029:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNF1HCG",
      "balance": 10000000000000000000000n,
      "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "collateralForStorage": 0n,
      "nonce": 0n,
      "stakingBalance": 0n,
    }
  `)
})
