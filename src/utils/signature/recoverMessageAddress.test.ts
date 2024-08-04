import { getAddress } from 'viem'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { sayHelloLocalNode } from '../../actions/localNode/sayHelloLocalNode.js'
import { signMessage } from '../../actions/wallet/signMessage.js'
import { recoverMessageAddress } from './recoverMessageAddress.js'
import { verifyMessage } from './verifyMessage.js'

const client = devConflux.getClient({ account: getTestAccount(accounts[0]) })
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})
test('default', async () => {
  const signature = await signMessage(client, {
    message: 'hello world',
  })

  expect(
    await recoverMessageAddress({
      message: 'hello world',
      signature: signature,
    }),
  ).toEqual(getAddress(accounts[0].hexAddress))

  const signature1 = await signMessage(client, {
    message: '🥰',
  })
  expect(
    await recoverMessageAddress({
      message: '🥰',
      signature: signature1,
    }),
  ).toEqual(getAddress(accounts[0].hexAddress))

  const signature2 = await signMessage(client, {
    message: { raw: '0x68656c6c6f20776f726c64' },
  })
  expect(
    await recoverMessageAddress({
      message: { raw: '0x68656c6c6f20776f726c64' },
      signature: signature2,
    }),
  ).toEqual(getAddress(accounts[0].hexAddress))

  const signature3 = await signMessage(client, {
    message: {
      raw: Uint8Array.from([
        104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
      ]),
    },
  })

  expect(
    await recoverMessageAddress({
      message: {
        raw: Uint8Array.from([
          104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
        ]),
      },
      signature: signature3,
    }),
  ).toEqual(getAddress(accounts[0].hexAddress))
})
