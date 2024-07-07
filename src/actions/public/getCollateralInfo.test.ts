import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getCollateralInfo } from './getCollateralInfo.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getCollateralInfo(client)).toMatchInlineSnapshot(`
    {
      "convertedStoragePoints": 0n,
      "totalStorageTokens": 50062500000000000000n,
      "usedStoragePoints": 0n,
    }
  `)
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  expect(await getCollateralInfo(client)).toMatchInlineSnapshot(`
    {
      "convertedStoragePoints": 0n,
      "totalStorageTokens": 50062500000000000000n,
      "usedStoragePoints": 0n,
    }
  `)
})
