import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getCollateralInfo } from './getCollateralInfo.js'

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
test('with args epoch tag', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  expect(
    await getCollateralInfo(client, { epochTag: 'earliest' }),
  ).toMatchInlineSnapshot(`
    {
      "convertedStoragePoints": 0n,
      "totalStorageTokens": 50062500000000000000n,
      "usedStoragePoints": 0n,
    }
  `)

  expect(
    await getCollateralInfo(client, { epochTag: 'latest_checkpoint' }),
  ).toMatchInlineSnapshot(`
    {
      "convertedStoragePoints": 0n,
      "totalStorageTokens": 50062500000000000000n,
      "usedStoragePoints": 0n,
    }
  `)
  expect(
    await getCollateralInfo(client, { epochTag: 'latest_state' }),
  ).toMatchInlineSnapshot(`
    {
      "convertedStoragePoints": 0n,
      "totalStorageTokens": 50062500000000000000n,
      "usedStoragePoints": 0n,
    }
  `)
})

test('with args epoch number', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  expect(
    await getCollateralInfo(client, { epochNumber: 10n }),
  ).toMatchInlineSnapshot(`
    {
      "convertedStoragePoints": 0n,
      "totalStorageTokens": 50062500000000000000n,
      "usedStoragePoints": 0n,
    }
  `)

  expect(
    await getCollateralInfo(client, { epochNumber: 11n }),
  ).toMatchInlineSnapshot(`
    {
      "convertedStoragePoints": 0n,
      "totalStorageTokens": 50062500000000000000n,
      "usedStoragePoints": 0n,
    }
  `)
  expect(
    await getCollateralInfo(client, { epochNumber: 12n }),
  ).toMatchInlineSnapshot(`
    {
      "convertedStoragePoints": 0n,
      "totalStorageTokens": 50062500000000000000n,
      "usedStoragePoints": 0n,
    }
  `)
})
