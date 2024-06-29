import { expect, test } from 'vitest'
import { PrivateKeyAccount } from 'js-conflux-sdk'
import { privateKeyToAddress } from './privateKeyToAddress.js'
import { accounts } from '~test/src/conflux/accounts.js'

test('default', () => {
  expect(
    privateKeyToAddress({
      privateKey: accounts[0].privateKey,
      networkId: accounts[0].netId,
    }).toLowerCase(),
  ).toEqual(
    new PrivateKeyAccount(
      accounts[0].privateKey,
      accounts[0].netId,
    ).address.toLowerCase(),
  )

  expect(
    privateKeyToAddress({
      privateKey: accounts[1].privateKey,
      networkId: accounts[1].netId,
    }).toLowerCase(),
  ).toEqual(
    new PrivateKeyAccount(
      accounts[1].privateKey,
      accounts[1].netId,
    ).address.toLowerCase(),
  )

  expect(
    privateKeyToAddress({
      privateKey: accounts[2].privateKey,
      networkId: accounts[2].netId,
    }).toLowerCase(),
  ).toEqual(
    new PrivateKeyAccount(
      accounts[2].privateKey,
      accounts[2].netId,
    ).address.toLowerCase(),
  )
})
