import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { sayHelloLocalNode } from '../../actions/test/sayHelloLocalNode.js'
import { signMessage } from '../../actions/wallet/signMessage.js'
import { verifyMessage } from './verifyMessage.js'

const client = devConflux.getClient({ account: getTestAccount(accounts[0]) })
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

const sourceAccount = getTestAccount(accounts[0])
test('default', async () => {
  let signature = await signMessage(client, {
    account: sourceAccount,
    message: 'hello world',
  })
  expect(
    await verifyMessage({
      address: sourceAccount.address,
      message: 'hello world',
      signature,
    }),
  ).toBeTruthy()

  signature = await signMessage(client!, {
    account: sourceAccount,
    message: 'cive 🥰',
  })
  expect(
    await verifyMessage({
      address: sourceAccount.address,
      message: 'cive 🥰',
      signature,
    }),
  ).toBeTruthy()
})

test('raw message', async () => {
  expect(
    await verifyMessage({
      address: sourceAccount.address,
      message: { raw: '0x68656c6c6f20776f726c64' },
      signature: await signMessage(client, {
        account: sourceAccount,
        message: { raw: '0x68656c6c6f20776f726c64' },
      }),
    }),
  ).toBe(true)
})
