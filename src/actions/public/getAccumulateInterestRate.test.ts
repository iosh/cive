import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getAccumulateInterestRate } from './getAccumulateInterestRate.js'
import { getBlock } from './getBlock.js'

const client = devConflux.getClient()

beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getAccumulateInterestRate(client)).toBeDefined()
})

test('with block number', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 3 })
  const block = await getBlock(client)

  expect(
    await getAccumulateInterestRate(client, { epochNumber: block.epochNumber }),
  ).toBeDefined()
})

test('with epoch tag', async () => {
  expect(
    await getAccumulateInterestRate(client, { epochTag: 'earliest' }),
  ).toBeDefined()

  expect(
    await getAccumulateInterestRate(client, { epochTag: 'latest_checkpoint' }),
  ).toBeDefined()

  expect(
    await getAccumulateInterestRate(client, { epochTag: 'latest_confirmed' }),
  ).toBeDefined()

  expect(
    await getAccumulateInterestRate(client, { epochTag: 'latest_finalized' }),
  ).toBeDefined()

  expect(
    await getAccumulateInterestRate(client, { epochTag: 'latest_state' }),
  ).toBeDefined()
})
