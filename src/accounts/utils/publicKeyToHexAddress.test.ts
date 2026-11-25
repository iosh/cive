import { expect, test } from 'vitest'

import { publicKeyToHexAddress } from './publicKeyToHexAddress.js'

test('default', () => {
  const publicKey =
    '0x0440e211139de5952e076d3a953ab71ea91dd9bc3d893623af3e8b942e6c4f3b4ee92d4e514ea4a565ca1cf76f47600d5e5581a2b75b4c6e7f98f1344e95868cbe'

  expect(publicKeyToHexAddress(publicKey)).toEqual(
    '0x1352a892ad7261473d4862b5e324ec4c0e110ae4',
  )
})
