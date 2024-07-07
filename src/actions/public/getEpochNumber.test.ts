import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getEpochNumber } from './getEpochNumber.js'
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
  expect(await getEpochNumber(client)).toMatchInlineSnapshot('0n')
})

test('with args epoch tag', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  expect(
    await getEpochNumber(client, { epochTag: 'earliest' }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getEpochNumber(client, { epochTag: 'latest_checkpoint' }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getEpochNumber(client, { epochTag: 'latest_confirmed' }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getEpochNumber(client, { epochTag: 'latest_finalized' }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await getEpochNumber(client, { epochTag: 'latest_state' }),
  ).toMatchInlineSnapshot('6n')

  expect(
    await getEpochNumber(client, { epochTag: 'latest_mined' }),
  ).toMatchInlineSnapshot('10n')
})
