import { afterAll, assertType, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'

import type { Block } from '../../types/block.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { getBlock } from './getBlock.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('legacy', async () => {
  const block = await getBlock(client)
  assertType<Block>(block)
  expect(block).toBeDefined()
  expect(
    Object.entries(block!)
      .filter(([_, value]) => {
        return value !== null && typeof value !== 'undefined'
      })
      .map(([key]) => key),
  ).toMatchInlineSnapshot(`
    [
      "adaptive",
      "blame",
      "blockNumber",
      "custom",
      "deferredLogsBloomHash",
      "deferredReceiptsRoot",
      "deferredStateRoot",
      "difficulty",
      "epochNumber",
      "gasLimit",
      "hash",
      "height",
      "miner",
      "nonce",
      "parentHash",
      "powQuality",
      "refereeHashes",
      "size",
      "timestamp",
      "transactions",
      "transactionsRoot",
    ]
  `)
})

test('1559', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  const block = await getBlock(client)

  expect(
    Object.entries(block!)
      .filter(([_, value]) => {
        return value !== null && typeof value !== 'undefined'
      })
      .map(([key]) => key),
  ).toMatchInlineSnapshot(`
    [
      "adaptive",
      "baseFeePerGas",
      "blame",
      "blockNumber",
      "custom",
      "deferredLogsBloomHash",
      "deferredReceiptsRoot",
      "deferredStateRoot",
      "difficulty",
      "epochNumber",
      "gasLimit",
      "gasUsed",
      "hash",
      "height",
      "miner",
      "nonce",
      "parentHash",
      "posReference",
      "powQuality",
      "refereeHashes",
      "size",
      "timestamp",
      "transactions",
      "transactionsRoot",
    ]
  `)
})
