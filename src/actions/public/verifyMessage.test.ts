import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { toHex } from 'viem'
import { accounts, getTestAccount } from '../../../test/src/constants.js'

import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { signMessage } from '../wallet/signMessage.js'

import { verifyMessage } from './verifyMessage.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({
  account: sourceAccount,
})

beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

describe('verifyMessage', () => {
  test('default', async () => {
    const signature = await signMessage(client, {
      account: sourceAccount,
      message: 'hello world',
    })
    expect(
      await verifyMessage(client, {
        address: sourceAccount.address,
        message: 'hello world',
        signature,
      }),
    ).toBe(true)

    expect(
      await verifyMessage(client, {
        address: accounts[1].base32Address,
        message: 'hello world',
        signature,
      }),
    ).toBe(false)
  })

  test('hex', async () => {
    const signature = await signMessage(client, {
      account: sourceAccount,
      message: toHex('hello world'),
    })
    expect(
      await verifyMessage(client, {
        address: sourceAccount.address,
        message: toHex('hello world'),
        signature,
      }),
    ).toBe(true)
  })
  test('raw message', async () => {
    expect(
      await verifyMessage(client, {
        address: sourceAccount.address,
        message: { raw: '0x68656c6c6f20776f726c64' },
        signature:
          '0x7faf17ad6b7e74e4ec5fc47a9845d9cfe260c14b293308f6942ea202588073df4801eb7a2877ccb895bf42d57644c3818eded847bc03edd63fb36574df90699801',
      }),
    ).toBe(true)

    expect(
      await verifyMessage(client, {
        address: sourceAccount.address,
        message: {
          raw: Uint8Array.from([
            104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
          ]),
        },
        signature:
          '0x7faf17ad6b7e74e4ec5fc47a9845d9cfe260c14b293308f6942ea202588073df4801eb7a2877ccb895bf42d57644c3818eded847bc03edd63fb36574df90699801',
      }),
    ).toBe(true)
  })
})
