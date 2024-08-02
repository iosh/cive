import { expect, test } from 'vitest'

import { accounts, typedData } from '~test/src/constants.js'

import { Message } from 'js-conflux-sdk'
import { hashTypedData } from '../../utils/signature/hashTypedData.js'
import { signTypedData } from './signTypedData.js'

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
    `"0xeb376dca45860063b24144736ec5bd39120d38e280712acb958acdcce3c93c305b0942d29e23474c70132baaff12a47d39c6bceab1255232136d51a9d9f1bd2b01"`,
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
    `"0x82f7e3bf7fe76e03c521e02befaeef5c47b08f59e7744df97b10c6e0ca85bdbf683cad7362bf1278f53208021b49be5829db95d04ed5369e8f51d6ae87a5a26600"`,
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
    `"0x83c67e842813570d215c14c7528843d0c5463dbfe5034216049918ce1900942c6352ae1c5ba18ca441862572b5b5696b349e9c06efe5a9a0a54e53a3c68b732300"`,
  )

  expect(
    await signTypedData({
      ...typedData.complex,
      domain: {},
      primaryType: 'Mail',
      privateKey: accounts[0].privateKey,
    }),
  ).toMatchInlineSnapshot(
    `"0x83c67e842813570d215c14c7528843d0c5463dbfe5034216049918ce1900942c6352ae1c5ba18ca441862572b5b5696b349e9c06efe5a9a0a54e53a3c68b732300"`,
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
    `"0x8f9c8bb6378e0d1fb9ea8d120d548645107fd8543e805a57eedb5806e91751cc62368e526515d3d4afb5a05b9df579c7407cacd73d7ae55837905195c3f3fe4501"`,
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
    `"0x88a76c56ba8c1f5042171141a25814a1659b342bc7a8fdf9d4003107cb51b6ac538f47ef2101dc74dbfbbae6ae2897c8b5493113e2d54163d28a4bcdcaf31bbd00"`,
  )
})

test('domain: verifyingContract', async () => {
  const hashData = hashTypedData({
    ...typedData.complex,
    domain: {
      verifyingContract: 'net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x',
    },
    primaryType: 'Mail',
  })
  const hash = await signTypedData({
    ...typedData.complex,
    domain: {
      verifyingContract: 'net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x',
    },
    primaryType: 'Mail',
    privateKey: accounts[0].privateKey,
  })
  expect(hash).toBe(Message.sign(accounts[0].privateKey, hashData))
  expect(hash).toMatchInlineSnapshot(
    `"0xc0989bae460caeedae32eb0fa9178cbf33faef9ba42a2063c1f1adc3336ad8a07b2dfa898ffde790c122cf4588ec7b4cdeef37e36567f87ad566bf128d41d8b000"`,
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
    `"0x166c6d585a77fc914ad59cdd3db7d6e1ff86f5a8ce9ead1fa674211044840bcd72f4ed619790ce0d64b8f277b71d9da07978d9121412b7b37cc6da947ec6da5401"`,
  )
})
