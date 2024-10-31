import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'
import { getBlock } from './getBlock.js'
import { getBlockRewardInfo } from './getBlockRewardInfo.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 30 })
  const block = await getBlock(client, { epochTag: 'latest_mined' })

  const result = await getBlockRewardInfo(client, {
    epochNumber: block.epochNumber - 20n,
  })
  expect(result.map((v) => Object.keys(v))).toMatchInlineSnapshot(`
    [
      [
        "author",
        "baseReward",
        "blockHash",
        "totalReward",
        "txFee",
      ],
    ]
  `)
})
