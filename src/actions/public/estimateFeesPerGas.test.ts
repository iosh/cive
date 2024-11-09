import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import {
  estimateFeesPerGas,
  internal_estimateFeesPerGas,
} from './estimateFeesPerGas.js'
import { getBlock } from './getBlock.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const block = await getBlock(client)
  const { maxFeePerGas, maxPriorityFeePerGas } =
    await estimateFeesPerGas(client)

  expect(maxFeePerGas).toBe(block.baseFeePerGas! + maxPriorityFeePerGas)
  expect(maxPriorityFeePerGas).toBeDefined()
})

describe('internal_estimateFeesPerGas', () => {
  test('maxPriorityFeePerGas request/block args', async () => {
    const baseFeePerGas = 420n
    const maxPriorityFeePerGas = 69n
    const { maxFeePerGas } = await internal_estimateFeesPerGas(client, {
      block: { baseFeePerGas } as any,
      request: { maxPriorityFeePerGas } as any,
    })
    expect(maxFeePerGas).toBe(baseFeePerGas + maxPriorityFeePerGas)
  })

  test('maxFeePerGas request args', async () => {
    const maxFeePerGas_ = 69n
    const { maxFeePerGas } = await internal_estimateFeesPerGas(client, {
      request: { maxFeePerGas: maxFeePerGas_ } as any,
    })
    expect(maxFeePerGas).toBe(maxFeePerGas_)
  })

  test('gasPrice request args', async () => {
    const gasPrice_ = 69n
    const { gasPrice } = await internal_estimateFeesPerGas(client, {
      request: { gasPrice: gasPrice_ } as any,
      type: 'legacy',
    })
    expect(gasPrice).toBe(gasPrice_)
  })
})
