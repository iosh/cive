import { http } from 'viem'
import { expect, test, vi } from 'vitest'
import { accounts } from '~test/src/constants.js'
import { localhostNode } from '../../chains/definitions/localhost.js'
import { createClient } from '../../clients/createClient.js'
import { requestAddresses } from './requestAddresses.js'

test('mock rpc', async () => {
  const client = createClient({
    chain: localhostNode,
    transport: http(),
  })
  client.request = vi.fn(async () => {
    return [accounts[0].base32Address, accounts[1].base32Address] as any
  })
  expect(await requestAddresses(client)).toMatchInlineSnapshot(`
    [
      "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa",
    ]
  `)
})
