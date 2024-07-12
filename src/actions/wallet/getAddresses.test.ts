import { expect, test, vi } from 'vitest'
import { accounts } from '~test/src/constants.js'
import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import { createClient } from '../../clients/createClient.js'

import { http } from 'viem'
import { localhost } from '../../chains/index.js'
import { getAddresses } from './getAddresses.js'

test('mock rpc', async () => {
  const client = createClient({
    chain: localhost,
    transport: http(),
  })
  client.request = vi.fn(async () => {
    return [accounts[1].base32Address] as any
  })
  expect(await getAddresses(client)).toMatchInlineSnapshot(`
    [
      "net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa",
    ]
  `)
})

test('local account', async () => {
  const client = createClient({
    account: privateKeyToAccount(accounts[0].privateKey, {
      networkId: accounts[0].netId,
    }),
    chain: localhost,
    transport: http(),
  })

  expect(await getAddresses(client)).toMatchInlineSnapshot(`
    [
      "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
    ]
  `)
})
