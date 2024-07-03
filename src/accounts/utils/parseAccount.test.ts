import { expect, test } from 'vitest'

import { privateKeyToAccount } from '../privateKeyToAccount.js'

import { accounts } from '~test/src/constants.js'
import { parseAccount } from './parseAccount.js'

test('address', () => {
  expect(parseAccount(accounts[0].base32Address)).toMatchInlineSnapshot(`
    {
      "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "type": "json-rpc",
    }
  `)
})

test('account', () => {
  expect(
    parseAccount(
      privateKeyToAccount(accounts[0].privateKey, {
        networkId: accounts[0].netId,
      }),
    ),
  ).toMatchInlineSnapshot(`
    {
      "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
      "signMessage": [Function],
      "signTransaction": [Function],
      "signTypedData": [Function],
      "source": "privateKey",
      "type": "local",
    }
  `)
})
