import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'
import { getSkippedBlocksByEpoch } from './getSkippedBlocksByEpoch.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 500 })
  expect(await getSkippedBlocksByEpoch(client)).toBeDefined()
})

test('epochNumber', async () => {
  expect(
    await getSkippedBlocksByEpoch(client, { epochNumber: 0n }),
  ).toBeDefined()

  expect(
    await getSkippedBlocksByEpoch(client, { epochNumber: 10n }),
  ).toBeDefined()
  expect(
    await getSkippedBlocksByEpoch(client, { epochNumber: 50n }),
  ).toBeDefined()
  expect(
    await getSkippedBlocksByEpoch(client, { epochNumber: 100n }),
  ).toBeDefined()
})

test('epoch tag', async () => {
  expect(
    await getSkippedBlocksByEpoch(client, { epochTag: 'latest_state' }),
  ).toBeDefined()
  expect(
    await getSkippedBlocksByEpoch(client, { epochTag: 'latest_confirmed' }),
  ).toBeDefined()

  expect(
    await getSkippedBlocksByEpoch(client, { epochTag: 'latest_checkpoint' }),
  ).toBeDefined()

  expect(
    await getSkippedBlocksByEpoch(client, { epochTag: 'earliest' }),
  ).toBeDefined()
})
