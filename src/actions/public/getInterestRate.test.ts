import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { mine } from '../test/mine.js'
import { getInterestRate } from './getInterestRate.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getInterestRate(client)).toMatchInlineSnapshot('2522880000000n')
})

test('with args', async () => {
  await mine(client, { blocks: 20 })
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
    await getInterestRate(client, { epochTag: 'latest_state' }),
  ).toMatchInlineSnapshot('2522880000000n')
})
