import { getMessage } from 'cip-23'
import { expect, test } from 'vitest'
import { accounts, typedData } from '~test/src/constants.js'

import { pad, toHex } from 'viem'
import { hashTypedData } from './hashTypedData.js'

test('default', () => {
  const data = {
    ...typedData.basic,
    primaryType: 'Mail',
    types: {
      ...typedData.basic.types,
      CIP23Domain: typedData.CIP23Domain,
    },
  }
  const hash = hashTypedData({
    ...typedData.basic,
    primaryType: 'Mail',
  })

  expect(hash).toBe(
    `0x${getMessage({ ...data, domain: { ...data.domain, verifyingContract: accounts[0].hexAddress }, message: { ...data.message, from: { ...data.message.from, wallet: accounts[0].hexAddress }, to: { ...data.message.to, wallet: accounts[0].hexAddress } } }, true).toString('hex')}`,
  )

  expect(hash).toMatchInlineSnapshot(
    `"0xf055cded65f6001fad77807e8b0584f54a5a5a1f0811513260091801dfef0fac"`,
  )
})

test('complex', () => {
  const data = {
    ...typedData.complex,
    primaryType: 'Mail',
    types: {
      ...typedData.complex.types,
      CIP23Domain: typedData.CIP23Domain,
    },
  }
  const hash = hashTypedData({
    ...typedData.complex,
    primaryType: 'Mail',
  })
  expect(hash).toBe(
    `0x${getMessage({ ...data, domain: { ...data.domain, verifyingContract: accounts[0].hexAddress }, message: { ...data.message, from: { ...data.message.from, wallet: accounts[0].hexAddress }, to: { ...data.message.to, wallet: accounts[0].hexAddress } } }, true).toString('hex')}`,
  )

  expect(hash).toMatchInlineSnapshot(
    `"0x18248b023f30c4c88bedb290d7f6bbd7ae957300a8e680021f3ae942cbd43a8a"`,
  )
})

test('no domain', () => {
  const data = {
    ...typedData.complex,
    primaryType: 'Mail',
    types: {
      ...typedData.complex.types,
      CIP23Domain: [],
    },
  }
  const hash = hashTypedData({
    ...typedData.complex,
    domain: undefined,
    primaryType: 'Mail',
  })
  expect(hash).toBe(
    `0x${getMessage({ ...data, domain: { ...data.domain, verifyingContract: accounts[0].hexAddress }, message: { ...data.message, from: { ...data.message.from, wallet: accounts[0].hexAddress }, to: { ...data.message.to, wallet: accounts[0].hexAddress } } }, true).toString('hex')}`,
  )

  expect(hash).toMatchInlineSnapshot(
    `"0xde2d71e298abc720fca9129529436e1b90fa6d3320eba5ce1bd8f34a75ce82b9"`,
  )
  expect(
    hashTypedData({
      ...typedData.complex,
      domain: {},
      primaryType: 'Mail',
    }),
  ).toMatchInlineSnapshot(
    `"0xde2d71e298abc720fca9129529436e1b90fa6d3320eba5ce1bd8f34a75ce82b9"`,
  )
})

test('domain: empty name', () => {
  const data = {
    ...typedData.complex,
    primaryType: 'Mail',
    types: {
      ...typedData.complex.types,
      CIP23Domain: [
        {
          name: 'name',
          type: 'string',
        },
      ],
    },
    domain: { name: '' },
  }

  const hash = hashTypedData({
    ...typedData.complex,
    domain: { name: '' },
    primaryType: 'Mail',
  })
  expect(hash).toBe(
    `0x${getMessage({ ...data, domain: { ...data.domain, verifyingContract: accounts[0].hexAddress }, message: { ...data.message, from: { ...data.message.from, wallet: accounts[0].hexAddress }, to: { ...data.message.to, wallet: accounts[0].hexAddress } } }, true).toString('hex')}`,
  )

  expect(hash).toMatchInlineSnapshot(
    `"0xcb940477d5ab0deb2c93a45f88a09364e1fe2e80d5f7d4e98738f5b1feadd235"`,
  )
})

test('minimal valid typed message', () => {
  const data = {
    types: {
      CIP23Domain: [],
    },
    primaryType: 'CIP23Domain',
    domain: {},
  } as const
  const hash = hashTypedData(data)

  expect(hash).toMatchInlineSnapshot(
    `"0x1d8420c8219e0be91d1804bd0f45e74f5b99048407578b90b349d7e591c0db25"`,
  )
})

test('typed message with a domain separator that uses all fields.', () => {
  const hash = hashTypedData({
    types: {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
        {
          name: 'salt',
          type: 'bytes32',
        },
      ],
    },
    primaryType: 'CIP23Domain',
    domain: {
      name: 'example.metamask.io',
      version: '1',
      chainId: 1,
      verifyingContract: accounts[0].base32Address,
      salt: pad(toHex(new Uint8Array([1, 2, 3])), { dir: 'right' }),
    },
  })

  expect(hash).toMatchInlineSnapshot(
    `"0x52b51a03dd27562e72e27e8ce57ab34bfc18d1c6798dc92158240ace4634296e"`,
  )
})

test('typed message with only custom domain seperator fields', () => {
  const hash = hashTypedData({
    types: {
      CIP23Domain: [
        {
          name: 'customName',
          type: 'string',
        },
        {
          name: 'customVersion',
          type: 'string',
        },
        {
          name: 'customChainId',
          type: 'uint256',
        },
        {
          name: 'customVerifyingContract',
          type: 'address',
        },
        {
          name: 'customSalt',
          type: 'bytes32',
        },
        {
          name: 'extraField',
          type: 'string',
        },
      ],
    },
    primaryType: 'CIP23Domain',
    domain: {
      customName: 'example.metamask.io',
      customVersion: '1',
      customChainId: 1n,
      customVerifyingContract: accounts[0].base32Address,
      customSalt: pad(toHex(new Uint8Array([1, 2, 3])), { dir: 'right' }),
      extraField: 'stuff',
    },
  })

  expect(hash).toMatchInlineSnapshot(
    `"0x94984e53d4b3f7cfd5c076142f66d0db158bf77216a37e7796d29dab1fc40c93"`,
  )
})

test('typed message with data', () => {
  const hash = hashTypedData({
    types: {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
        {
          name: 'salt',
          type: 'bytes32',
        },
      ],
      Message: [{ name: 'data', type: 'string' }],
    },
    primaryType: 'Message',
    domain: {
      name: 'example.metamask.io',
      version: '1',
      chainId: 1,
      verifyingContract: accounts[0].base32Address,
      salt: pad(toHex(new Uint8Array([1, 2, 3])), { dir: 'right' }),
    },
    message: {
      data: 'Hello!',
    },
  })

  expect(hash).toMatchInlineSnapshot(
    `"0x570aabe3e46bbe195b224875b58d5e406b089c8e85e05729e9f94275849ee337"`,
  )
})
