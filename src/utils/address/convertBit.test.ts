import { convertBit as _convertBit } from '@conflux-dev/conflux-address-js/lib/cip37/base32.js'
import { hexToBytes } from 'viem'
import { describe, expect, test } from 'vitest'
import { convertBit } from './convertBit.js'

const addresses = [
  '0x1a2f80341409639ea6a35bbcab8299066109aa55',
  '0xCD91fFd0b7F5db0D86d1Aeb761b9eDBeeaD0b9A7',
  '0x0147986DB1aBb85f21C1d933353A331A04630e1b',
  '0x14028654DB1828f47fD0702e2386BD8C55bb1046',
  '0xA3aBb8B25575E581A496Cc02dB106593590bE0BC',
  '0x80194597D37505B70d65D60Ba02110B435292be0',
  '0xE72B899B4c4e1dbE00eFea091f2ed6120FD09168',
  '0x4b4e00fd0c7b556dA2986C26bC972BFbB8F8FfE0',
] as const
describe('convertBit 8 to 5', () => {
  test('convertBit 8 to 5', () => {
    for (let index = 0; index < addresses.length; index++) {
      const address = addresses[index]

      const buffer = Buffer.from(address.replace('0x', ''), 'hex')
      const uint8 = hexToBytes(address)

      expect(convertBit(uint8, 8, 5, true)).toEqual(
        _convertBit(buffer, 8, 5, true),
      )
    }
  })
  test('convertBit 5 to 8', () => {
    for (let index = 0; index < addresses.length; index++) {
      const address = addresses[index]

      const buffer = Buffer.from(address.replace('0x', ''), 'hex')
      const uint8 = hexToBytes(address)

      expect(convertBit(uint8, 5, 8, true)).toEqual(
        _convertBit(buffer, 5, 8, true),
      )
    }
  })

  test('convertBit 8 to 5 not pad', () => {
    for (let index = 0; index < addresses.length; index++) {
      const address = addresses[index]

      const buffer = Buffer.from(address.replace('0x', ''), 'hex')
      const uint8 = hexToBytes(address)

      expect(convertBit(uint8, 8, 5, false)).toEqual(
        _convertBit(buffer, 8, 5, false),
      )
    }
  })
})
