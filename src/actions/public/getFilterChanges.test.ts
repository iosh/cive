import { afterAll, assertType, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import type { Hash } from '../../types/misc.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { createBlockFilter } from './createBlockFilter.js'
import { createPendingTransactionFilter } from './createPendingTransactionFilter.js'
import { getFilterChanges } from './getFilterChanges.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const filter = await createPendingTransactionFilter(client)
  expect(await getFilterChanges(client, { filter })).toMatchInlineSnapshot('[]')
})

test('new blocks', async () => {
  const filter = await createBlockFilter(client)
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 6 })
  let hashes = await getFilterChanges(client, { filter })

  assertType<Hash[]>(hashes)
  expect(hashes.length).toBe(2)

  hashes = await getFilterChanges(client, { filter })
  expect(hashes.length).toBe(0)

  await generateEmptyLocalNodeBlocks(client, { numBlocks: 1 })

  hashes = await getFilterChanges(client, { filter })
  expect(hashes.length).toBe(1)
})
