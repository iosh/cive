import { http } from 'viem'
import { expect, test, vi } from 'vitest'
import { accounts } from '~test/src/constants.js'
import { localhostNode } from '../../chains/definitions/localhost.js'
import { createClient } from '../../clients/createClient.js'
import { getChainId } from './getChainId.js'

test('mock rpc', async () => {
  const client = createClient({
    chain: localhostNode,
    transport: http(),
  })
  client.request = vi.fn(async () => {
    return accounts[1].netId as any
  })
  expect(await getChainId(client)).toMatchInlineSnapshot('201029')
})
