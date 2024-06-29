import { expect, test } from 'vitest'

import { accounts } from '~test/src/conflux/accounts.js'
import { signMessage } from './signMessage.js'
import { PersonalMessage } from 'js-conflux-sdk'

test('default', async () => {
  expect(
    await signMessage({
      message: 'hello world',
      privateKey: accounts[0].privateKey,
    }),
  ).toBe(PersonalMessage.sign(accounts[0].privateKey, 'hello world'))

  expect(
    await signMessage({
      message: 'hello world',
      privateKey: accounts[0].privateKey,
    }),
  ).toMatchInlineSnapshot(
    `"0x7faf17ad6b7e74e4ec5fc47a9845d9cfe260c14b293308f6942ea202588073df4801eb7a2877ccb895bf42d57644c3818eded847bc03edd63fb36574df90699801"`,
  )

  expect(
    await signMessage({
      message: '🥰🥰',
      privateKey: accounts[0].privateKey,
    }),
  ).toBe(PersonalMessage.sign(accounts[0].privateKey, '🥰🥰'))

  expect(
    await signMessage({
      message: '🥰🥰',
      privateKey: accounts[0].privateKey,
    }),
  ).toMatchInlineSnapshot(
    `"0xf553e1c07e73e5f44b31816f8f0645b7506db84408bec9297fa7b63b4d14db6741092e973859bd2e42061c1c313ebbbe20bd58f12da919003c9eb3f80ac2196400"`,
  )
})

test('raw', async () => {
  expect(
    await signMessage({
      message: { raw: '0x68656c6c6f20776f726c64' },
      privateKey: accounts[0].privateKey,
    }),
  ).toBe(PersonalMessage.sign(accounts[0].privateKey, '0x68656c6c6f20776f726c64'))

  expect(
    await signMessage({
      message: { raw: '0x68656c6c6f20776f726c64' },
      privateKey: accounts[0].privateKey,
    }),
  ).toMatchInlineSnapshot(
    `"0x7faf17ad6b7e74e4ec5fc47a9845d9cfe260c14b293308f6942ea202588073df4801eb7a2877ccb895bf42d57644c3818eded847bc03edd63fb36574df90699801"`,
  )

  expect(
    await signMessage({
      message: {
        raw: Uint8Array.from([
          104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
        ]),
      },
      privateKey: accounts[0].privateKey,
    }),
  ).toMatchInlineSnapshot(
    `"0x7faf17ad6b7e74e4ec5fc47a9845d9cfe260c14b293308f6942ea202588073df4801eb7a2877ccb895bf42d57644c3818eded847bc03edd63fb36574df90699801"`,
  )
})
