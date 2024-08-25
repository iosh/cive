import { expect, test } from 'vitest'
import { accounts } from '~test/src/constants.js'
import { provider } from '../../../test/src/provider/index.js'
import { localhostNode } from '../../chains/definitions/localhost.js'
import { createClient } from '../../clients/createClient.js'
import { custom } from '../../clients/transports/custom.js'
import { switchChain } from './switchChain.js'

test('default', async () => {
  const client = createClient({
    account: accounts[0].base32Address,
    chain: localhostNode,
    transport: custom(provider),
  })

  expect(await switchChain(client, { id: localhostNode.id })).toBeUndefined()
})
