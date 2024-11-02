import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { mine } from '../test/mine.js'
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
  await mine(client, { blocks: 60 })
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
      "baseFeeShareProp": 0n,
      "interestRate": 40000n,
      "powBaseReward": 0n,
      "storagePointProp": 0n,
    }
  `)

  expect(
    await getParamsFromVote(client, { epochTag: 'latest_state' }),
  ).toMatchInlineSnapshot(`
        {
          "baseFeeShareProp": 0n,
          "interestRate": 40000n,
          "powBaseReward": 0n,
          "storagePointProp": 0n,
        }
      `)
})

test('with epoch number', async () => {
  expect(
    await getParamsFromVote(client, { epochNumber: 0n }),
  ).toMatchInlineSnapshot(`
        {
          "baseFeeShareProp": 0n,
          "interestRate": 40000n,
          "powBaseReward": 0n,
          "storagePointProp": 0n,
        }
      `)

  expect(
    await getParamsFromVote(client, { epochNumber: 1n }),
  ).toMatchInlineSnapshot(`
        {
          "baseFeeShareProp": 0n,
          "interestRate": 40000n,
          "powBaseReward": 0n,
          "storagePointProp": 0n,
        }
      `)

  expect(
    await getParamsFromVote(client, { epochNumber: 10n }),
  ).toMatchInlineSnapshot(`
        {
          "baseFeeShareProp": 0n,
          "interestRate": 40000n,
          "powBaseReward": 0n,
          "storagePointProp": 0n,
        }
      `)

  expect(
    await getParamsFromVote(client, { epochNumber: 50n }),
  ).toMatchInlineSnapshot(`
        {
          "baseFeeShareProp": 0n,
          "interestRate": 40000n,
          "powBaseReward": 0n,
          "storagePointProp": 0n,
        }
      `)
})
