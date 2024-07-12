import { expect, test, vi } from 'vitest'
import { accounts } from '~test/src/constants.js'
import { createClient } from '../../clients/createClient.js'

import { http } from 'viem'
import { localhost } from '../../chains/index.js'
import { requestPermissions } from './requestPermissions.js'

test('mock rpc', async () => {
  const client = createClient({
    chain: localhost,
    transport: http(),
  })
  client.request = vi.fn(async () => {
    return [
      {
        caveats: [
          {
            type: 'filterResponse',
            value: [accounts[0].base32Address],
          },
        ],
        invoker: 'https://example.com',
        parentCapability: 'cfx_accounts',
      },
    ] as any
  })
  expect(
    await requestPermissions(client, { cfx_accounts: {} }),
  ).toMatchInlineSnapshot(`
    [
      {
        "caveats": [
          {
            "type": "filterResponse",
            "value": [
              "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
            ],
          },
        ],
        "invoker": "https://example.com",
        "parentCapability": "cfx_accounts",
      },
    ]
  `)
})
