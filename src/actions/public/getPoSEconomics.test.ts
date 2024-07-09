import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getPoSEconomics } from './getPoSEconomics.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getPoSEconomics(client)).toMatchInlineSnapshot(`
    {
      "distributablePosInterest": 0n,
      "lastDistributeBlock": 0n,
      "totalPosStakingTokens": 0n,
    }
  `)
})

test('epochNumber', async () => {
  expect(
    await getPoSEconomics(client, { epochNumber: 0n }),
  ).toMatchInlineSnapshot(`
    {
      "distributablePosInterest": 0n,
      "lastDistributeBlock": 0n,
      "totalPosStakingTokens": 0n,
    }
  `)
})

test('epochTag', async () => {
  expect(
    await getPoSEconomics(client, { epochTag: 'latest_state' }),
  ).toMatchInlineSnapshot(`
    {
      "distributablePosInterest": 0n,
      "lastDistributeBlock": 0n,
      "totalPosStakingTokens": 0n,
    }
  `)

  expect(
    await getPoSEconomics(client, { epochTag: 'latest_confirmed' }),
  ).toMatchInlineSnapshot(`
    {
      "distributablePosInterest": 0n,
      "lastDistributeBlock": 0n,
      "totalPosStakingTokens": 0n,
    }
  `)

  expect(
    await getPoSEconomics(client, { epochTag: 'latest_checkpoint' }),
  ).toMatchInlineSnapshot(`
    {
      "distributablePosInterest": 0n,
      "lastDistributeBlock": 0n,
      "totalPosStakingTokens": 0n,
    }
  `)

  expect(
    await getPoSEconomics(client, { epochTag: 'earliest' }),
  ).toMatchInlineSnapshot(`
    {
      "distributablePosInterest": 0n,
      "lastDistributeBlock": 0n,
      "totalPosStakingTokens": 0n,
    }
  `)
})
