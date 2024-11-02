import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { getPoSCommittee } from './getPoSCommittee.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getPoSCommittee(client)).toBeDefined()

  expect(await getPoSCommittee(client, { blockNumber: 1n })).toBeDefined()
})
