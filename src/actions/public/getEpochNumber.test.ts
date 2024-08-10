import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { wait } from '../../utils/wait.js'
import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getEpochNumber } from './getEpochNumber.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getEpochNumber(client, { cacheTime: 0 })).toMatchInlineSnapshot(
    '0n',
  )
})

test('with args epoch tag', async () => {
  await mine(client, { blocks: 10 })
  expect(
    await getEpochNumber(client, { epochTag: 'earliest' }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getEpochNumber(client, { epochTag: 'latest_checkpoint' }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getEpochNumber(client, { epochTag: 'latest_finalized' }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getEpochNumber(client, { epochTag: 'latest_state' }),
  ).toMatchInlineSnapshot('6n')

  expect(
    await getEpochNumber(client, { epochTag: 'latest_mined', cacheTime: 0 }),
  ).toMatchInlineSnapshot('10n')
})

test('with cache time', async () => {
  await mine(client, { blocks: 1 })
  const epochNumber = await getEpochNumber(client, {
    cacheTime: 1_000,
    epochTag: 'latest_mined',
  })
  expect(epochNumber).toMatchInlineSnapshot('10n')
  await mine(client, { blocks: 1 })
  await mine(client, { blocks: 1 })

  expect(await getEpochNumber(client)).toBe(epochNumber)
  await wait(1_000)

  const epochNumberWithoutCache = await getEpochNumber(client, {
    cacheTime: 0,
    epochTag: 'latest_mined',
  })
  expect(epochNumberWithoutCache).toMatchInlineSnapshot('13n')

  await mine(client, { blocks: 1 })

  expect(
    await getEpochNumber(client, { epochTag: 'latest_mined', cacheTime: 0 }),
  ).toMatchInlineSnapshot('14n')
  await mine(client, { blocks: 1 })
  expect(
    await getEpochNumber(client, { epochTag: 'latest_mined', cacheTime: 0 }),
  ).toMatchInlineSnapshot('15n')
  await mine(client, { blocks: 1 })
  expect(
    await getEpochNumber(client, { epochTag: 'latest_mined', cacheTime: 0 }),
  ).toMatchInlineSnapshot('16n')
})
