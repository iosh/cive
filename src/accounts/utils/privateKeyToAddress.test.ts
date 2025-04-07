import { expect, test } from 'vitest'
import { accounts } from '~test/src/constants.js'
import { privateKeyToAddress } from './privateKeyToAddress.js'

test('default', () => {
  expect(
    privateKeyToAddress({
      privateKey: accounts[0].privateKey,
      networkId: accounts[0].netId,
    }).toLowerCase(),
  ).toEqual('net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x')

  expect(
    privateKeyToAddress({
      privateKey: accounts[1].privateKey,
      networkId: accounts[1].netId,
    }).toLowerCase(),
  ).toEqual('net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa')

  expect(
    privateKeyToAddress({
      privateKey: accounts[2].privateKey,
      networkId: accounts[2].netId,
    }).toLowerCase(),
  ).toEqual('net201029:aas350p711z3zn9zyc57trh4hdp88erdvyan0hnmds')
})
