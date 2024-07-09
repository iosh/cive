import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getPoSAccount } from './getPoSAccount.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(
    await getPoSAccount(client, {
      address:
        '0x046ca462890f25ed9394ca9f92c979ff48e1738a81822ecab96d83813c1a433c',
    }),
  ).toMatchInlineSnapshot(`
    {
      "address": "0x046ca462890f25ed9394ca9f92c979ff48e1738a81822ecab96d83813c1a433c",
      "blockNumber": 1n,
      "status": {
        "availableVotes": 0n,
        "forceRetired": undefined,
        "forfeited": 0n,
        "inQueue": [],
        "locked": 0n,
        "outQueue": [],
        "unlocked": 0n,
      },
    }
  `)
})
