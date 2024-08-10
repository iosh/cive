import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { describe } from 'node:test'
import { wait } from '../../utils/wait.js'
import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import {
  type OnEpochNumberParameter,
  watchEpochNumber,
} from './watchEpochNumber.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
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
        1n,
        2n,
        3n,
        4n,
        5n,
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

    await mine(client, { blocks: 3 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        8n,
        9n,
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

    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        9n,
        10n,
        11n,
        12n,
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

    await mine(client_2, { blocks: 1 })
    await wait(210)
    await mine(client_2, { blocks: 1 })
    await wait(210)
    unwatch()

    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        14n,
        15n,
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
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        15n,
        16n,
        16n,
        17n,
        17n,
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

    await mine(client, { blocks: 1 })
    await wait(110)

    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        19n,
        19n,
        19n,
        20n,
        20n,
        20n,
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
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        21n,
        21n,
        21n,
        21n,
        22n,
        22n,
        22n,
        22n,
      ]
    `)
    epochNumbers = []

    unwatch = watchEpochNumber(client, {
      onEpochNumber: (epochNumber) => epochNumbers.push(epochNumber),
      poll: true,
      pollingInterval: 100,
    })
    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)
    unwatch()
    expect(epochNumbers).toMatchInlineSnapshot(`
      [
        23n,
        23n,
        23n,
        23n,
        23n,
        24n,
        24n,
        24n,
        24n,
        24n,
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

    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)

    unwatch1()
    unwatch2()
    unwatch3()
    expect(epochNumbers.length).toMatchInlineSnapshot(`36`)

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

    await mine(client, { blocks: 1 })
    await wait(110)
    await mine(client, { blocks: 1 })
    await wait(110)

    unwatch1()
    unwatch2()
    unwatch3()
    expect(epochNumbers.length).toMatchInlineSnapshot('42')
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
