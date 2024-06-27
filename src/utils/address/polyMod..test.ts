import { polyMod as _polyMod } from '@conflux-dev/conflux-address-js/lib/cip37/base32.js'
import { stringToBytes } from 'viem'
import { describe, expect, test } from 'vitest'
import { polyMod } from './polyMod.js'

test('polyMod', () => {
  const strings = ['Hello world', 'poly mode', '123456', 'abcdef']

  for (let index = 0; index < strings.length; index++) {
    const string = strings[index]
    const buffer = Buffer.from(string)
    const uint8 = stringToBytes(string)
    expect(polyMod(uint8).toString()).toEqual(_polyMod(buffer).toString())
  }
})
