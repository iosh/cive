import { expect, test, vi } from 'vitest'
import { createClient } from '../../clients/createClient.js'
import { localhost } from '../../chains/index.js'
import { http } from 'viem'
import { getChainId } from './getChainId.js'
import { accounts } from '~test/src/constants.js'

test('mock rpc', async () => {
  const client = createClient({
    chain: localhost,
    transport: http(),
  })
  client.request = vi.fn(async () => {
    return accounts[1].netId as any
  })
  expect(await getChainId(client)).toMatchInlineSnapshot("201029")
})
