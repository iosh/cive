import { expect, test } from 'vitest'

import { formatCFX } from './formatCFX.js'

test('converts drip to cfx', () => {
  expect(formatCFX(46947002750148372109389793665n)).toMatchInlineSnapshot(
    `"46947002750.148372109389793665"`,
  )

  expect(formatCFX(46947002750000000000000000000n)).toMatchInlineSnapshot(
    `"46947002750"`,
  )

  expect(formatCFX(1000000000000000000000000n)).toMatchInlineSnapshot(
    '"1000000"',
  )
  expect(formatCFX(100000000000000000000000n)).toMatchInlineSnapshot('"100000"')

  expect(formatCFX(10000000000000000000000n)).toMatchInlineSnapshot('"10000"')
  expect(formatCFX(1000000000000000000000n)).toMatchInlineSnapshot('"1000"')
  expect(formatCFX(100000000000000000000n)).toMatchInlineSnapshot('"100"')
  expect(formatCFX(10000000000000000000n)).toMatchInlineSnapshot('"10"')
  expect(formatCFX(1000000000000000000n)).toMatchInlineSnapshot('"1"')
  expect(formatCFX(500000000000000000n)).toMatchInlineSnapshot('"0.5"')
  expect(formatCFX(100000000000000000n)).toMatchInlineSnapshot('"0.1"')
  expect(formatCFX(10000000000000000n)).toMatchInlineSnapshot('"0.01"')
  expect(formatCFX(1000000000000000n)).toMatchInlineSnapshot('"0.001"')
  expect(formatCFX(100000000000000n)).toMatchInlineSnapshot('"0.0001"')
  expect(formatCFX(10000000000000n)).toMatchInlineSnapshot('"0.00001"')
  expect(formatCFX(1000000000000n)).toMatchInlineSnapshot('"0.000001"')
  expect(formatCFX(100000000000n)).toMatchInlineSnapshot('"0.0000001"')
  expect(formatCFX(10000000000n)).toMatchInlineSnapshot('"0.00000001"')
  expect(formatCFX(1000000000n)).toMatchInlineSnapshot('"0.000000001"')
  expect(formatCFX(100000000n)).toMatchInlineSnapshot('"0.0000000001"')
  expect(formatCFX(10000000n)).toMatchInlineSnapshot('"0.00000000001"')
  expect(formatCFX(1000000n)).toMatchInlineSnapshot('"0.000000000001"')
  expect(formatCFX(100000n)).toMatchInlineSnapshot('"0.0000000000001"')
  expect(formatCFX(10000n)).toMatchInlineSnapshot('"0.00000000000001"')
  expect(formatCFX(1000n)).toMatchInlineSnapshot('"0.000000000000001"')
  expect(formatCFX(100n)).toMatchInlineSnapshot('"0.0000000000000001"')
  expect(formatCFX(10n)).toMatchInlineSnapshot('"0.00000000000000001"')
  expect(formatCFX(1n)).toMatchInlineSnapshot('"0.000000000000000001"')
  expect(formatCFX(0n)).toMatchInlineSnapshot('"0"')

  expect(formatCFX(-46947002750148372109389793665n)).toMatchInlineSnapshot(
    `"-46947002750.148372109389793665"`,
  )
  expect(formatCFX(-46947002750000000000000000000n)).toMatchInlineSnapshot(
    `"-46947002750"`,
  )
  expect(formatCFX(-1000000000000000000n)).toMatchInlineSnapshot('"-1"')
  expect(formatCFX(-500000000000000000n)).toMatchInlineSnapshot('"-0.5"')
  expect(formatCFX(-100000000000000000n)).toMatchInlineSnapshot('"-0.1"')
  expect(formatCFX(-10000000n)).toMatchInlineSnapshot('"-0.00000000001"')
  expect(formatCFX(-1000000n)).toMatchInlineSnapshot('"-0.000000000001"')
  expect(formatCFX(-100000n)).toMatchInlineSnapshot('"-0.0000000000001"')
  expect(formatCFX(-10000n)).toMatchInlineSnapshot('"-0.00000000000001"')
  expect(formatCFX(-1000n)).toMatchInlineSnapshot('"-0.000000000000001"')
  expect(formatCFX(-100n)).toMatchInlineSnapshot('"-0.0000000000000001"')
  expect(formatCFX(-10n)).toMatchInlineSnapshot('"-0.00000000000000001"')
  expect(formatCFX(-1n)).toMatchInlineSnapshot('"-0.000000000000000001"')
})

test('converts gDrip to cfx', () => {
  expect(formatCFX(82079252892807n, 'gDrip')).toMatchInlineSnapshot(
    `"82079.252892807"`,
  )

  expect(formatCFX(82090000000000n, 'gDrip')).toMatchInlineSnapshot(`"82090"`)
  expect(formatCFX(1000000000n, 'gDrip')).toMatchInlineSnapshot('"1"')
  expect(formatCFX(500000000n, 'gDrip')).toMatchInlineSnapshot('"0.5"')
  expect(formatCFX(100000000n, 'gDrip')).toMatchInlineSnapshot('"0.1"')
  expect(formatCFX(10000000n, 'gDrip')).toMatchInlineSnapshot('"0.01"')
  expect(formatCFX(1000000n, 'gDrip')).toMatchInlineSnapshot('"0.001"')
  expect(formatCFX(100000n, 'gDrip')).toMatchInlineSnapshot('"0.0001"')
  expect(formatCFX(10000n, 'gDrip')).toMatchInlineSnapshot('"0.00001"')
  expect(formatCFX(1000n, 'gDrip')).toMatchInlineSnapshot('"0.000001"')
  expect(formatCFX(100n, 'gDrip')).toMatchInlineSnapshot('"0.0000001"')
  expect(formatCFX(10n, 'gDrip')).toMatchInlineSnapshot('"0.00000001"')
  expect(formatCFX(1n, 'gDrip')).toMatchInlineSnapshot('"0.000000001"')
  expect(formatCFX(-82090000000000n, 'gDrip')).toMatchInlineSnapshot(`"-82090"`)
  expect(formatCFX(-82090000000000n, 'gDrip')).toMatchInlineSnapshot(`"-82090"`)
  expect(formatCFX(-1000000000n, 'gDrip')).toMatchInlineSnapshot('"-1"')
  expect(formatCFX(-500000000n, 'gDrip')).toMatchInlineSnapshot('"-0.5"')
  expect(formatCFX(-100000000n, 'gDrip')).toMatchInlineSnapshot('"-0.1"')
  expect(formatCFX(-10000000n, 'gDrip')).toMatchInlineSnapshot('"-0.01"')
  expect(formatCFX(-1000000n, 'gDrip')).toMatchInlineSnapshot('"-0.001"')
  expect(formatCFX(-100000n, 'gDrip')).toMatchInlineSnapshot('"-0.0001"')
  expect(formatCFX(-10000n, 'gDrip')).toMatchInlineSnapshot('"-0.00001"')
  expect(formatCFX(-1000n, 'gDrip')).toMatchInlineSnapshot('"-0.000001"')
  expect(formatCFX(-100n, 'gDrip')).toMatchInlineSnapshot('"-0.0000001"')
  expect(formatCFX(-10n, 'gDrip')).toMatchInlineSnapshot('"-0.00000001"')
  expect(formatCFX(-1n, 'gDrip')).toMatchInlineSnapshot('"-0.000000001"')
})
