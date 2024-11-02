import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { getBlocksByEpoch } from './getBlocksByEpoch.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
  const epochs = await getBlocksByEpoch(client, { epochTag: 'latest_state' })

  for (const epoch of epochs) {
    expect(epoch).toBeTypeOf('string')
  }
})
