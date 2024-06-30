import { expect, test } from 'vitest'

import { accounts, typedData } from '~test/src/constants.js'

import { signTypedData } from './signTypedData.js'
import { hashTypedData } from '../../utils/signature/hashTypedData.js'
import { Message, format, sign } from 'js-conflux-sdk'

test('default', async () => {
  const hashData = hashTypedData({
    ...typedData.basic,
    primaryType: 'Mail',
  })
  const hash = await signTypedData({
    ...typedData.basic,
    primaryType: 'Mail',
    privateKey: accounts[0].privateKey,
  })
  expect(hash).toBe(Message.sign(accounts[0].privateKey, hashData))

  expect(hash).toMatchInlineSnapshot(
    `"0x7527fa58c1e8d21a450268ad764ca30b0dd4a4f49102eda896dbcec974bdc1060dbad0f1f0fb4e5d0ac406760b33a25d32befb2fee81cf84e3f340de2390240901"`,
  )
})

test('minimal', async () => {
  const hashData = hashTypedData({
    types: {
      CIP23Domain: [],
    },
    primaryType: 'CIP23Domain',
    domain: {},
  })

  const hash = await signTypedData({
    types: {
      CIP23Domain: [],
    },
    primaryType: 'CIP23Domain',
    domain: {},
    privateKey: accounts[0].privateKey,
  })
  expect(hash).toBe(Message.sign(accounts[0].privateKey, hashData))
  expect(hash).toMatchInlineSnapshot(
    `"0xe552c7e52256e3894a5f170d20650c813d2155ed7970b4e57bb659437d890ca074d13be050a1d3c20a2a4f96c664ea03915dea7b642402b0199bad91a7ee3a9300"`,
  )
})

test('complex', async () => {
  const hashData = hashTypedData({
    ...typedData.complex,
    primaryType: 'Mail',
  })
  const hash = await signTypedData({
    ...typedData.complex,
    primaryType: 'Mail',
    privateKey: accounts[0].privateKey,
  })
  expect(hash).toBe(Message.sign(accounts[0].privateKey, hashData))
  expect(hash).toMatchInlineSnapshot(
    `"0xe6aa0d82d824502e300b058b47237561400d0dc64b6e365a029f19b30da3ba0011d11fcf7d3fbd7756811466d3cfaf218262c537c657a4c110c48f9cae29510201"`,
  )
})

test('domain: empty', async () => {
  expect(
    await signTypedData({
      ...typedData.complex,
      domain: undefined,
      primaryType: 'Mail',
      privateKey: accounts[0].privateKey,
    }),
  ).toMatchInlineSnapshot(
    `"0xe9923385d885922e5ac44658423c74bbc030718eb1493081453402b0315ca3894bd061242cc811d6f4a65d5a7ad0ac7dd73701e4a546817fcdbfce5a2eedcff900"`,
  )

  expect(
    await signTypedData({
      ...typedData.complex,
      domain: {},
      primaryType: 'Mail',
      privateKey: accounts[0].privateKey,
    }),
  ).toMatchInlineSnapshot(
    `"0xe9923385d885922e5ac44658423c74bbc030718eb1493081453402b0315ca3894bd061242cc811d6f4a65d5a7ad0ac7dd73701e4a546817fcdbfce5a2eedcff900"`,
  )
})

test('domain: chainId', async () => {
  const hashData = hashTypedData({
    ...typedData.complex,
    domain: {
      chainId: 1,
    },
    primaryType: 'Mail',
  })
  const hash = await signTypedData({
    ...typedData.complex,
    domain: {
      chainId: 1,
    },
    primaryType: 'Mail',
    privateKey: accounts[0].privateKey,
  })
  expect(hash).toBe(Message.sign(accounts[0].privateKey, hashData))
  expect(hash).toMatchInlineSnapshot(
    `"0x6c50bad8d115d490c8698f52b0eba038d39f6c67a5bebb91386a89f889f17e0b4c2673c22ad6f092b56ccd39cbd1865a8f962c24aedd592ddc38f44ccd16e7c100"`,
  )
})

test('domain: name', async () => {
  const hashData = hashTypedData({
    ...typedData.complex,
    domain: {
      name: 'Ether!',
    },
    primaryType: 'Mail',
  })
  const hash = await signTypedData({
    ...typedData.complex,
    domain: {
      name: 'Ether!',
    },
    primaryType: 'Mail',
    privateKey: accounts[0].privateKey,
  })
  expect(hash).toBe(Message.sign(accounts[0].privateKey, hashData))
  expect(hash).toMatchInlineSnapshot(
    `"0xc459ca8954db84a752091a454128569fc69d88a05b38d48a8544ec5e3ef0eaea2981b45caef85fe1a1c264e7cd7b3cfaaa0f74f63e94af3aed8f7e80cd64df9c00"`,
  )
})

test('domain: verifyingContract', async () => {
  const hashData = hashTypedData({
    ...typedData.complex,
    domain: {
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    primaryType: 'Mail',
  })
  const hash = await signTypedData({
    ...typedData.complex,
    domain: {
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    primaryType: 'Mail',
    privateKey: accounts[0].privateKey,
  })
  expect(hash).toBe(Message.sign(accounts[0].privateKey, hashData))
  expect(hash).toMatchInlineSnapshot(
    `"0xdbaba3b3ed8371d53787dbb577f543d3650b5b9fe372f9f19c261778eb303f7b77a6b5a7ee96cc8928e9624b177978aa3da173fe7844562efbeff237c1a1ceff01"`,
  )
})

test('domain: salt', async () => {
  const hashData = hashTypedData({
    ...typedData.complex,
    domain: {
      salt: '0x123512315aaaa1231313b1231b23b13b123aa12312211b1b1b111bbbb1affafa',
    },
    primaryType: 'Mail',
  })
  const hash = await signTypedData({
    ...typedData.complex,
    domain: {
      salt: '0x123512315aaaa1231313b1231b23b13b123aa12312211b1b1b111bbbb1affafa',
    },
    primaryType: 'Mail',
    privateKey: accounts[0].privateKey,
  })
  expect(hash).toBe(Message.sign(accounts[0].privateKey, hashData))
  expect(hash).toMatchInlineSnapshot(
    `"0x67da1b928323cd806df60cf7b8bdef3d8ca25ffb1a78a2abbc386ebb5aa3387d4f4211b7d3a6aefcb1dc473290b54f3c6f2f5aac21d836567f5e66cb413bb67f01"`,
  )
})
