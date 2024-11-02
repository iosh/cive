import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { getParamsFromVote } from './getParamsFromVote.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getParamsFromVote(client)).toMatchInlineSnapshot(`
    {
      "baseFeeShareProp": 0n,
      "interestRate": 40000n,
      "powBaseReward": 0n,
      "storagePointProp": 0n,
    }
  `)
})

test('with epoch tag', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 100 })
  expect(
    await getParamsFromVote(client, { epochTag: 'earliest' }),
  ).toMatchInlineSnapshot(`
    {
      "baseFeeShareProp": 0n,
      "interestRate": 40000n,
      "powBaseReward": 0n,
      "storagePointProp": 0n,
    }
  `)

  expect(
    await getParamsFromVote(client, { epochTag: 'latest_checkpoint' }),
  ).toMatchInlineSnapshot(`
    {
      "baseFeeShareProp": 0n,
      "interestRate": 40000n,
      "powBaseReward": 0n,
      "storagePointProp": 0n,
    }
  `)

  expect(
    await getParamsFromVote(client, { epochTag: 'latest_confirmed' }),
  ).toMatchInlineSnapshot(`
    {
      "baseFeeShareProp": 1000000000000000000n,
      "interestRate": 40000n,
      "powBaseReward": 2000000000000000000n,
      "storagePointProp": 1000000000000000000n,
    }
  `)

  expect(
    await getParamsFromVote(client, { epochTag: 'latest_state' }),
  ).toMatchInlineSnapshot(`
    {
      "baseFeeShareProp": 1000000000000000000n,
      "interestRate": 40000n,
      "powBaseReward": 2000000000000000000n,
      "storagePointProp": 1000000000000000000n,
    }
  `)
})

test('with epoch number', async () => {
  expect(
    await getParamsFromVote(client, { epochNumber: 0n }),
  ).toMatchInlineSnapshot(`
    {
      "baseFeeShareProp": 1000000000000000000n,
      "interestRate": 40000n,
      "powBaseReward": 2000000000000000000n,
      "storagePointProp": 1000000000000000000n,
    }
  `)

  expect(
    await getParamsFromVote(client, { epochNumber: 1n }),
  ).toMatchInlineSnapshot(`
    {
      "baseFeeShareProp": 1000000000000000000n,
      "interestRate": 40000n,
      "powBaseReward": 2000000000000000000n,
      "storagePointProp": 1000000000000000000n,
    }
  `)

  expect(
    await getParamsFromVote(client, { epochNumber: 10n }),
  ).toMatchInlineSnapshot(`
    {
      "baseFeeShareProp": 1000000000000000000n,
      "interestRate": 40000n,
      "powBaseReward": 2000000000000000000n,
      "storagePointProp": 1000000000000000000n,
    }
  `)

  expect(
    await getParamsFromVote(client, { epochNumber: 50n }),
  ).toMatchInlineSnapshot(`
    {
      "baseFeeShareProp": 1000000000000000000n,
      "interestRate": 40000n,
      "powBaseReward": 2000000000000000000n,
      "storagePointProp": 1000000000000000000n,
    }
  `)
})
