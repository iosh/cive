import { expect, test } from 'vitest'

import { stringToBytes, stringToHex } from 'viem'
import { hashMessage } from './hashMessage.js'

test('to hex', () => {
  expect(hashMessage('hello world')).toMatchInlineSnapshot(
    `"0x33bfa24b39fec6c4c65bab7884c081feec7776721a83701540a87c90fc3eb9b4"`,
  )

  expect(hashMessage('🤗')).toMatchInlineSnapshot(
    `"0x72dbc4e4ee08d7927be6e90b43d10de40579bd41e471401795ab565e8104679e"`,
  )

  const hex = stringToHex('hello world')

  expect(hashMessage(hex)).toMatchInlineSnapshot(
    `"0x7457b1b16dc2ffbe1233647758087acecd2a76650f422da58dead59310b13b7d"`,
  )

  const buffer = stringToBytes('hello world')

  expect(
    hashMessage({
      raw: buffer,
    }),
  ).toMatchInlineSnapshot(
    `"0x33bfa24b39fec6c4c65bab7884c081feec7776721a83701540a87c90fc3eb9b4"`,
  )
})

test('to bytes', () => {
  expect(hashMessage('hello world', 'bytes')).toMatchInlineSnapshot(
    `
    Uint8Array [
      51,
      191,
      162,
      75,
      57,
      254,
      198,
      196,
      198,
      91,
      171,
      120,
      132,
      192,
      129,
      254,
      236,
      119,
      118,
      114,
      26,
      131,
      112,
      21,
      64,
      168,
      124,
      144,
      252,
      62,
      185,
      180,
    ]
  `,
  )
  expect(hashMessage('🤗', 'bytes')).toMatchInlineSnapshot(
    `
    Uint8Array [
      114,
      219,
      196,
      228,
      238,
      8,
      215,
      146,
      123,
      230,
      233,
      11,
      67,
      209,
      13,
      228,
      5,
      121,
      189,
      65,
      228,
      113,
      64,
      23,
      149,
      171,
      86,
      94,
      129,
      4,
      103,
      158,
    ]
  `,
  )
  expect(hashMessage('0xdeadbeef', 'bytes')).toMatchInlineSnapshot(
    `
    Uint8Array [
      5,
      59,
      176,
      211,
      201,
      35,
      137,
      83,
      74,
      154,
      91,
      240,
      85,
      120,
      213,
      1,
      230,
      37,
      61,
      165,
      66,
      230,
      23,
      213,
      180,
      132,
      243,
      109,
      207,
      51,
      254,
      106,
    ]
  `,
  )

  expect(
    hashMessage({ raw: '0x68656c6c6f20776f726c64' }, 'bytes'),
  ).toMatchInlineSnapshot(
    `
    Uint8Array [
      51,
      191,
      162,
      75,
      57,
      254,
      198,
      196,
      198,
      91,
      171,
      120,
      132,
      192,
      129,
      254,
      236,
      119,
      118,
      114,
      26,
      131,
      112,
      21,
      64,
      168,
      124,
      144,
      252,
      62,
      185,
      180,
    ]
  `,
  )
  expect(
    hashMessage(
      {
        raw: Uint8Array.from([
          104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
        ]),
      },
      'bytes',
    ),
  ).toMatchInlineSnapshot(
    `
    Uint8Array [
      51,
      191,
      162,
      75,
      57,
      254,
      198,
      196,
      198,
      91,
      171,
      120,
      132,
      192,
      129,
      254,
      236,
      119,
      118,
      114,
      26,
      131,
      112,
      21,
      64,
      168,
      124,
      144,
      252,
      62,
      185,
      180,
    ]
  `,
  )
})
