import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { getPoSRewardByEpoch } from './getPoSRewardByEpoch.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getPoSRewardByEpoch(client, { epochNumber: 0n })).toBeUndefined()
})
