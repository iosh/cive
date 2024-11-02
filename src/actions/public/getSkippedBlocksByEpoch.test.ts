import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { mine } from '../test/mine.js'
import { getSkippedBlocksByEpoch } from './getSkippedBlocksByEpoch.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  await mine(client, { blocks: 35 })
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
    await getSkippedBlocksByEpoch(client, { epochNumber: 20n }),
  ).toBeDefined()
  expect(
    await getSkippedBlocksByEpoch(client, { epochNumber: 30n }),
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
