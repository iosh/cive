import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getInterestRate } from './getInterestRate.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getInterestRate(client)).toMatchInlineSnapshot('2522880000000n')
})

test('with args', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 100 })
  expect(
    await getInterestRate(client, { epochNumber: 0n }),
  ).toMatchInlineSnapshot('2522880000000n')

  expect(
    await getInterestRate(client, { epochTag: 'earliest' }),
  ).toMatchInlineSnapshot('2522880000000n')

  expect(
    await getInterestRate(client, { epochTag: 'latest_checkpoint' }),
  ).toMatchInlineSnapshot('2522880000000n')
  expect(
    await getInterestRate(client, { epochTag: 'latest_confirmed' }),
  ).toMatchInlineSnapshot('2522880000000n')
  expect(
    await getInterestRate(client, { epochTag: 'latest_finalized' }),
  ).toMatchInlineSnapshot('2522880000000n')

  expect(
    await getInterestRate(client, { epochTag: 'latest_state' }),
  ).toMatchInlineSnapshot('2522880000000n')
})
