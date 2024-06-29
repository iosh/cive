import { Buffer } from 'node:buffer'
import { format, sign } from 'js-conflux-sdk'
import { expect, test } from 'vitest'

import { publicKeyToAddress } from './publicKeyToAddress.js'

test('default', () => {
  const publicKey =
    '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'

  const addressBuffer = sign.publicKeyToAddress(
    Buffer.from(publicKey.slice(2), 'hex'),
  )

  expect(
    publicKeyToAddress({
      publicKey,
      networkId: 1,
    }),
  ).toEqual(format.address(addressBuffer, 1))

  expect(
    publicKeyToAddress({
      publicKey,
      networkId: 1,
    }),
  ).toEqual('cfxtest:aak39z1fdm02v71y33znvaxwthh99skcp2s48zasbp')

  expect(
    publicKeyToAddress({
      publicKey,
      networkId: 1029,
    }),
  ).toEqual(format.address(addressBuffer, 1029))

  expect(
    publicKeyToAddress({
      publicKey,
      networkId: 1029,
    }),
  ).toEqual('cfx:aak39z1fdm02v71y33znvaxwthh99skcp2evrfgefg')

  expect(
    publicKeyToAddress({
      publicKey,
      networkId: 6666,
    }),
  ).toEqual(format.address(addressBuffer, 6666))

  expect(
    publicKeyToAddress({
      publicKey,
      networkId: 6666,
    }),
  ).toEqual('net6666:aak39z1fdm02v71y33znvaxwthh99skcp292njthta')
})
