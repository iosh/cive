import { describe, expect, test } from 'vitest'

import { accounts } from '~test/src/constants.js'

import { toAccount } from './toAccount.js'

describe('toAccount', () => {
  test('json-rpc account', () => {
    expect(toAccount(accounts[0].base32Address)).toMatchInlineSnapshot(`
      {
        "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
        "type": "json-rpc",
      }
    `)
  })

  test('local account', () => {
    expect(
      toAccount({
        address: accounts[0].base32Address,
        async signMessage() {
          return '0x'
        },
        async signTransaction(_transaction) {
          return '0x'
        },
        async signTypedData() {
          return '0x'
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "custom",
        "type": "local",
      }
    `)
  })
})
