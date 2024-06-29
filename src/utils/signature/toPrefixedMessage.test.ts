import { expect, test } from 'vitest'

import { PersonalMessage, format } from 'js-conflux-sdk'
import { stringToHex } from 'viem'
import { toPrefixedMessage } from './toPrefixedMessage.js'

test('default', () => {
  const hello = 'hello world'
  expect(toPrefixedMessage(hello)).toBe(
    stringToHex(PersonalMessage.personalMessage(hello)),
  )

  expect(toPrefixedMessage({ raw: stringToHex('hello world') })).toBe(
    stringToHex(PersonalMessage.personalMessage(hello)),
  )

  expect(toPrefixedMessage(hello)).toMatchInlineSnapshot(
    `"0x19436f6e666c7578205369676e6564204d6573736167653a0a313168656c6c6f20776f726c64"`,
  )
  expect(
    toPrefixedMessage({ raw: stringToHex('hello world') }),
  ).toMatchInlineSnapshot(
    `"0x19436f6e666c7578205369676e6564204d6573736167653a0a313168656c6c6f20776f726c64"`,
  )
})
