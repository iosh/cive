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
    `"0xedd550d9cfc669218f125b7ae5f57ab565eda1463a384ce566764b58d95fa0fc212732cdbeed4148059b51d5eaab4223fba734ad29495aa1e31a5eea45a7397600"`,
  )

  expect(
    await signMessage(client, {
      account: getTestAccount(accounts[0]),
      message: { raw: '0x68656c6c6f20776f726c64' },
    }),
  ).toMatchInlineSnapshot(
    `"0x7faf17ad6b7e74e4ec5fc47a9845d9cfe260c14b293308f6942ea202588073df4801eb7a2877ccb895bf42d57644c3818eded847bc03edd63fb36574df90699801"`,
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
    `"0x7faf17ad6b7e74e4ec5fc47a9845d9cfe260c14b293308f6942ea202588073df4801eb7a2877ccb895bf42d57644c3818eded847bc03edd63fb36574df90699801"`,
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
