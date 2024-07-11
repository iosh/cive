import { expect, test } from 'vitest'
import { createClient } from '../../clients/createClient.js'
import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import { accounts } from '~test/src/constants.js'
import { http } from 'viem'
import { getAddresses } from './getAddresses.js'
import { localhost } from '../../chains/index.js'

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
