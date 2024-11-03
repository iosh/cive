import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { describe } from 'node:test'
import { wait } from '../../utils/wait.js'
import { mine } from '../test/mine.js'
import {
  type OnEpochNumberParameter,
  watchEpochNumber,
} from './watchEpochNumber.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

describe('poll', () => {
  test('default', async () => {
    const epochNumbers: OnEpochNumberParameter[] = []
    const unwatch = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        0n,
        1n,
        2n,
        3n,
        4n,
        5n,
      ]
    `)
  })

  test('epoch tag', async () => {
    const epochNumbers: OnEpochNumberParameter[] = []
    const unwatch = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => {
        epochNumbers.push(epochNumber)
      },
      poll: true,
      pollingInterval: 100,
      epochTag: 'earliest',
    })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        0n,
        0n,
      ]
    `)
  })

  test('emitMissed', async () => {
    const epochNumbers: OnEpochNumberParameter[] = []
    const unwatch = watchEpochNumber(client, {
      emitMissed: true,
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      pollingInterval: 100,
      poll: true,
    })
    await wait(110)
    await mine(client, { blocks: 3 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        6n,
        7n,
        8n,
        9n,
        10n,
      ]
    `)
  })

  test('emitOnBegin', async () => {
    const epochNumbers: OnEpochNumberParameter[] = []
    const unwatch = watchEpochNumber(client, {
      emitOnBegin: true,
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      pollingInterval: 100,
      poll: true,
    })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        10n,
        11n,
        12n,
        13n,
        14n,
      ]
    `)
  })

  test('pollingInterval', async () => {
    const client_2 = devConflux.getClient({
      pollingInterval: 200,
    })

    const epochNumbers: OnEpochNumberParameter[] = []

    const unwatch = watchEpochNumber(client_2, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
    })
    await wait(210)
    await mine(client_2, { blocks: 1 })
    await wait(210)
    await mine(client_2, { blocks: 1 })
    await wait(210)
    unwatch()

    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        14n,
        15n,
        16n,
      ]
    `)
  })

  test('http transport', async () => {
    const epochNumbers: OnEpochNumberParameter[] = []

    const unwatch = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })

    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        16n,
        17n,
        18n,
        19n,
      ]
    `)
  })

  test('does not emit when no new incoming epoch', async () => {
    const epochNumbers: OnEpochNumberParameter[] = []

    const unwatch = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        19n,
        20n,
        21n,
      ]
    `)
  })

  test('watch  => unwatch => watch', async () => {
    let epochNumbers: OnEpochNumberParameter[] = []

    let unwatch = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        21n,
        22n,
        23n,
      ]
    `)
    epochNumbers = []

    unwatch = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        23n,
        24n,
        25n,
      ]
    `)
  })

  test('multiple watchers', async () => {
    let epochNumbers: OnEpochNumberParameter[] = []
    let unwatch1 = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    let unwatch2 = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    let unwatch3 = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)

    unwatch1()
    unwatch2()
    unwatch3()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        25n,
        25n,
        25n,
        26n,
        26n,
        26n,
        27n,
        27n,
        27n,
      ]
    `)

    epochNumbers = []

    unwatch1 = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    unwatch2 = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    unwatch3 = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)

    unwatch1()
    unwatch2()
    unwatch3()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        27n,
        27n,
        27n,
        28n,
        28n,
        28n,
        29n,
        29n,
        29n,
      ]
    `)
  })

  test('immediately unwatch', async () => {
    const epochNumbers: OnEpochNumberParameter[] = []

    const unwatch = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    unwatch()
    await mine(client, { blocks: 1 })
    await wait(110)
    expect(epochNumbers).toMatchInlineSnapshot('[]')
  })
})
