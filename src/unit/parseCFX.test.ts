import { expect, test } from 'vitest'

import { parseCFX } from './parseCFX.js'
import { Drip } from 'js-conflux-sdk'

test('converts cfx to drip', () => {
  expect(parseCFX('6942069420.12345678912345')).toBe(
    BigInt(Drip.fromCFX('6942069420.12345678912345').toString()),
  )
  expect(parseCFX('6942069420.12345678912345')).toMatchInlineSnapshot(
    '6942069420123456789123450000n',
  )
  expect(parseCFX('6942069420')).toMatchInlineSnapshot(
    '6942069420000000000000000000n',
  )
  expect(parseCFX('1')).toMatchInlineSnapshot('1000000000000000000n')
  expect(parseCFX('0.5')).toMatchInlineSnapshot('500000000000000000n')
  expect(parseCFX('0.1')).toMatchInlineSnapshot('100000000000000000n')
  expect(parseCFX('0.01')).toMatchInlineSnapshot('10000000000000000n')
  expect(parseCFX('0.001')).toMatchInlineSnapshot('1000000000000000n')
  expect(parseCFX('0.0001')).toMatchInlineSnapshot('100000000000000n')
  expect(parseCFX('0.00001')).toMatchInlineSnapshot('10000000000000n')
  expect(parseCFX('0.00000000001')).toMatchInlineSnapshot('10000000n')
  expect(parseCFX('0.000000000001')).toMatchInlineSnapshot('1000000n')
  expect(parseCFX('0.0000000000001')).toMatchInlineSnapshot('100000n')
  expect(parseCFX('0.00000000000001')).toMatchInlineSnapshot('10000n')
  expect(parseCFX('0.000000000000001')).toMatchInlineSnapshot('1000n')
  expect(parseCFX('0.0000000000000001')).toMatchInlineSnapshot('100n')
  expect(parseCFX('0.00000000000000001')).toMatchInlineSnapshot('10n')
  expect(parseCFX('0.000000000000000001')).toMatchInlineSnapshot('1n')
  expect(parseCFX('-6942069420.12345678912345')).toMatchInlineSnapshot(
    '-6942069420123456789123450000n',
  )
  expect(parseCFX('-6942069420')).toMatchInlineSnapshot(
    '-6942069420000000000000000000n',
  )
  expect(parseCFX('-1')).toMatchInlineSnapshot('-1000000000000000000n')
  expect(parseCFX('-0.5')).toMatchInlineSnapshot('-500000000000000000n')
  expect(parseCFX('-0.1')).toMatchInlineSnapshot('-100000000000000000n')
  expect(parseCFX('-0.00000000001')).toMatchInlineSnapshot('-10000000n')
  expect(parseCFX('-0.000000000001')).toMatchInlineSnapshot('-1000000n')
  expect(parseCFX('-0.0000000000001')).toMatchInlineSnapshot('-100000n')
  expect(parseCFX('-0.00000000000001')).toMatchInlineSnapshot('-10000n')
  expect(parseCFX('-0.000000000000001')).toMatchInlineSnapshot('-1000n')
  expect(parseCFX('-0.0000000000000001')).toMatchInlineSnapshot('-100n')
  expect(parseCFX('-0.00000000000000001')).toMatchInlineSnapshot('-10n')
  expect(parseCFX('-0.000000000000000001')).toMatchInlineSnapshot('-1n')
})

test('converts cfx to gDrip', () => {
  expect(parseCFX('69420.1234567', 'gDrip')).toMatchInlineSnapshot(
    '69420123456700n',
  )
  expect(parseCFX('69420.1234567', 'gDrip')).toBe(
    BigInt(Drip.fromCFX('69420.1234567').toGDrip()),
  )
  expect(parseCFX('69420', 'gDrip')).toMatchInlineSnapshot('69420000000000n')
  expect(parseCFX('1', 'gDrip')).toMatchInlineSnapshot('1000000000n')
  expect(parseCFX('0.5', 'gDrip')).toMatchInlineSnapshot('500000000n')
  expect(parseCFX('0.1', 'gDrip')).toMatchInlineSnapshot('100000000n')
  expect(parseCFX('0.01', 'gDrip')).toMatchInlineSnapshot('10000000n')
  expect(parseCFX('0.001', 'gDrip')).toMatchInlineSnapshot('1000000n')
  expect(parseCFX('0.0001', 'gDrip')).toMatchInlineSnapshot('100000n')
  expect(parseCFX('0.00001', 'gDrip')).toMatchInlineSnapshot('10000n')
  expect(parseCFX('0.000001', 'gDrip')).toMatchInlineSnapshot('1000n')
  expect(parseCFX('0.0000001', 'gDrip')).toMatchInlineSnapshot('100n')
  expect(parseCFX('0.00000001', 'gDrip')).toMatchInlineSnapshot('10n')
  expect(parseCFX('0.000000001', 'gDrip')).toMatchInlineSnapshot('1n')

  expect(parseCFX('-6942060.123456', 'gDrip')).toMatchInlineSnapshot(
    '-6942060123456000n',
  )
  expect(parseCFX('-6942069420', 'gDrip')).toMatchInlineSnapshot(
    '-6942069420000000000n',
  )
  expect(parseCFX('-1', 'gDrip')).toMatchInlineSnapshot('-1000000000n')
  expect(parseCFX('-0.5', 'gDrip')).toMatchInlineSnapshot('-500000000n')
  expect(parseCFX('-0.1', 'gDrip')).toMatchInlineSnapshot('-100000000n')
  expect(parseCFX('-0.01', 'gDrip')).toMatchInlineSnapshot('-10000000n')
  expect(parseCFX('-0.001', 'gDrip')).toMatchInlineSnapshot('-1000000n')
  expect(parseCFX('-0.0001', 'gDrip')).toMatchInlineSnapshot('-100000n')
  expect(parseCFX('-0.00001', 'gDrip')).toMatchInlineSnapshot('-10000n')
  expect(parseCFX('-0.000001', 'gDrip')).toMatchInlineSnapshot('-1000n')
  expect(parseCFX('-0.0000001', 'gDrip')).toMatchInlineSnapshot('-100n')
  expect(parseCFX('-0.00000001', 'gDrip')).toMatchInlineSnapshot('-10n')
  expect(parseCFX('-0.000000001', 'gDrip')).toMatchInlineSnapshot('-1n')
})

test('converts to rounded gDrip', () => {
  expect(parseCFX('0.0000000001', 'gDrip')).toMatchInlineSnapshot('0n')

  expect(parseCFX('0.00000000059', 'gDrip')).toMatchInlineSnapshot('1n')
  expect(parseCFX('1.00000000059', 'gDrip')).toMatchInlineSnapshot(
    '1000000001n',
  )
  expect(parseCFX('69.59000000059', 'gDrip')).toMatchInlineSnapshot(
    '69590000001n',
  )
  expect(parseCFX('1.2345678912345222', 'gDrip')).toMatchInlineSnapshot(
    '1234567891n',
  )
  expect(parseCFX('-0.0000000001', 'gDrip')).toMatchInlineSnapshot('0n')
  expect(parseCFX('-0.00000000059', 'gDrip')).toMatchInlineSnapshot('-1n')
  expect(parseCFX('-1.00000000059', 'gDrip')).toMatchInlineSnapshot(
    '-1000000001n',
  )
  expect(parseCFX('-69.59000000059', 'gDrip')).toMatchInlineSnapshot(
    '-69590000001n',
  )
  expect(parseCFX('-1.2345678912345222', 'gDrip')).toMatchInlineSnapshot(
    '-1234567891n',
  )
})

test('converts to rounded drip', () => {
  expect(parseCFX('0.0000000000000000001')).toMatchInlineSnapshot('0n')
  expect(parseCFX('0.00000000000000000059')).toMatchInlineSnapshot('1n')
  expect(parseCFX('1.00000000000000000059')).toMatchInlineSnapshot(
    '1000000000000000001n',
  )
  expect(parseCFX('69.59000000000000000059')).toMatchInlineSnapshot(
    '69590000000000000001n',
  )
  expect(parseCFX('1.2345678000000000912345222')).toMatchInlineSnapshot(
    '1234567800000000091n',
  )
  expect(parseCFX('-0.0000000000000000001')).toMatchInlineSnapshot('0n')
  expect(parseCFX('-0.00000000000000000059')).toMatchInlineSnapshot('-1n')
  expect(parseCFX('-1.00000000000000000059')).toMatchInlineSnapshot(
    '-1000000000000000001n',
  )
  expect(parseCFX('-69.59000000000000000059')).toMatchInlineSnapshot(
    '-69590000000000000001n',
  )
  expect(parseCFX('-1.2345678000000000912345222')).toMatchInlineSnapshot(
    '-1234567800000000091n',
  )
})
