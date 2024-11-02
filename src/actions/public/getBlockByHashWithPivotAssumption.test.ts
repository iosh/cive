import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { generateLocalNodeBlock } from '../test/generateLocalNodeBlock.js'
import { getBlock } from './getBlock.js'
import { getBlockByHashWithPivotAssumption } from './getBlockByHashWithPivotAssumption.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  const blockHash = await generateLocalNodeBlock(client, {
    numTxs: 0,
    blockSizeLimit: 1024,
  })
  const block = await getBlock(client, { blockHash: blockHash })

  const result = await getBlockByHashWithPivotAssumption(client, {
    blockHash: blockHash,
    assumedPivotHash: blockHash,
    epochNumber: block.epochNumber,
  })
  expect(result.hash).toBe(blockHash)
  expect(Object.keys(result)).toMatchInlineSnapshot(`
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
