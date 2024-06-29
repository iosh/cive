import { expect, test } from 'vitest'

import { Drip } from 'js-conflux-sdk'
import { formatGDrip } from './formatGDrip.js'

test('converts wei to gwei', () => {
  expect(formatGDrip(82079252892807n)).toBe(new Drip(82079252892807n).toGDrip())

  expect(formatGDrip(82079252892807n)).toMatchInlineSnapshot(
    `"82079.252892807"`,
  )
  expect(formatGDrip(82070000000000n)).toMatchInlineSnapshot(`"82070"`)
  expect(formatGDrip(1000000000n)).toMatchInlineSnapshot('"1"')
  expect(formatGDrip(500000000n)).toMatchInlineSnapshot('"0.5"')
  expect(formatGDrip(100000000n)).toMatchInlineSnapshot('"0.1"')
  expect(formatGDrip(10000000n)).toMatchInlineSnapshot('"0.01"')
  expect(formatGDrip(1000000n)).toMatchInlineSnapshot('"0.001"')
  expect(formatGDrip(100000n)).toMatchInlineSnapshot('"0.0001"')
  expect(formatGDrip(10000n)).toMatchInlineSnapshot('"0.00001"')
  expect(formatGDrip(1000n)).toMatchInlineSnapshot('"0.000001"')
  expect(formatGDrip(100n)).toMatchInlineSnapshot('"0.0000001"')
  expect(formatGDrip(10n)).toMatchInlineSnapshot('"0.00000001"')
  expect(formatGDrip(1n)).toMatchInlineSnapshot('"0.000000001"')
  expect(formatGDrip(-82079252892807n)).toMatchInlineSnapshot(
    `"-82079.252892807"`,
  )
  expect(formatGDrip(-82070000000000n)).toMatchInlineSnapshot(`"-82070"`)
  expect(formatGDrip(-1000000000n)).toMatchInlineSnapshot('"-1"')
  expect(formatGDrip(-500000000n)).toMatchInlineSnapshot('"-0.5"')
  expect(formatGDrip(-100000000n)).toMatchInlineSnapshot('"-0.1"')
  expect(formatGDrip(-10000000n)).toMatchInlineSnapshot('"-0.01"')
  expect(formatGDrip(-1000000n)).toMatchInlineSnapshot('"-0.001"')
  expect(formatGDrip(-100000n)).toMatchInlineSnapshot('"-0.0001"')
  expect(formatGDrip(-10000n)).toMatchInlineSnapshot('"-0.00001"')
  expect(formatGDrip(-1000n)).toMatchInlineSnapshot('"-0.000001"')
  expect(formatGDrip(-100n)).toMatchInlineSnapshot('"-0.0000001"')
  expect(formatGDrip(-10n)).toMatchInlineSnapshot('"-0.00000001"')
  expect(formatGDrip(-1n)).toMatchInlineSnapshot('"-0.000000001"')
})
