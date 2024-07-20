import { http } from 'viem'
import { expect, test, vi } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { localhostNode } from '../../chains/definitions/localhost.js'
import { createClient } from '../../clients/createClient.js'
import { signMessage } from './signMessage.js'

const client = devConflux.getClient()

test('default local account', async () => {
  expect(
    await signMessage(client, {
      account: getTestAccount(accounts[0]),
      message: 'hello',
    }),
  ).toMatchInlineSnapshot(
    `"0xb484223a77031fe37fd61f78676b6a6bec17e333dde0af8a8352678e1bdc7cd00a14f7a6ac96d76d2ebf979f986bf33f1aafe6e0bdd62b47bd616da3b5a4e0331b"`,
  )

  expect(
    await signMessage(client, {
      account: getTestAccount(accounts[0]),
      message: { raw: '0x68656c6c6f20776f726c64' },
    }),
  ).toMatchInlineSnapshot(
    `"0x32e8275f9adae1f82b50798f9945592cc992c0610dc87c0a93f1cec69c93400a1e906b33e9010c219b67db92b77ba0cc6b0e1a5f633132a0d845f62c3733e0df1b"`,
  )

  expect(
    await signMessage(client, {
      account: getTestAccount(accounts[0]),
      message: {
        raw: Uint8Array.from([
          104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
        ]),
      },
    }),
  ).toMatchInlineSnapshot(
    `"0x32e8275f9adae1f82b50798f9945592cc992c0610dc87c0a93f1cec69c93400a1e906b33e9010c219b67db92b77ba0cc6b0e1a5f633132a0d845f62c3733e0df1b"`,
  )
})

test('mock rpc', async () => {
  const client = createClient({
    chain: localhostNode,
    transport: http(),
  })
  client.request = vi.fn(async () => {
    return '0xb484223a77031fe37fd61f78676b6a6bec17e333dde0af8a8352678e1bdc7cd00a14f7a6ac96d76d2ebf979f986bf33f1aafe6e0bdd62b47bd616da3b5a4e0331b' as any
  })

  expect(
    await signMessage(client, {
      account: accounts[0].base32Address,
      message: 'hello',
    }),
  ).toMatchInlineSnapshot(
    `"0xb484223a77031fe37fd61f78676b6a6bec17e333dde0af8a8352678e1bdc7cd00a14f7a6ac96d76d2ebf979f986bf33f1aafe6e0bdd62b47bd616da3b5a4e0331b"`,
  )
})
