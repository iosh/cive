import { getMessage } from 'cip-23'
import { expect, test } from 'vitest'
import { typedData } from '~test/src/constants.js'

import { hashTypedData } from './hashTypedData.js'
import { pad, toHex } from 'viem'

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

  expect(hash).toBe(`0x${getMessage(data, true).toString('hex')}`)

  expect(hash).toMatchInlineSnapshot(
    `"0x3c95ec9de8acccb87b0ea58261d330d594b29f60c2cabf93469e736cfb87f372"`,
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
  expect(hash).toBe(`0x${getMessage(data, true).toString('hex')}`)

  expect(hash).toMatchInlineSnapshot(
    `"0x8c216f9c0c18284db3261091cb00d740907c7a3f2591bde36440f1f3d528a145"`,
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
  expect(hash).toBe(`0x${getMessage(data, true).toString('hex')}`)

  expect(hash).toMatchInlineSnapshot(
    `"0xaab224e47a7b69f7c41ae4265647be286e4e76af202feb5d27ba71e89518b899"`,
  )
  expect(
    hashTypedData({
      ...typedData.complex,
      domain: {},
      primaryType: 'Mail',
    }),
  ).toMatchInlineSnapshot(
    `"0xaab224e47a7b69f7c41ae4265647be286e4e76af202feb5d27ba71e89518b899"`,
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
  expect(hash).toBe(`0x${getMessage(data, true).toString('hex')}`)

  expect(hash).toMatchInlineSnapshot(
    `"0xa89f85e69e526ec7e3c77d227d97a85df83c00e0ebea84b819a4ce0e383cecad"`,
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
      verifyingContract: '0x0000000000000000000000000000000000000000',
      salt: pad(toHex(new Uint8Array([1, 2, 3])), { dir: 'right' }),
    },
  })

  expect(hash).toMatchInlineSnapshot(
    `"0xa55e95dd54cec04a32fbfd14d98588a131b23677d131806f52e5d268b8189eed"`,
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
      customVerifyingContract: '0x0000000000000000000000000000000000000000',
      customSalt: pad(toHex(new Uint8Array([1, 2, 3])), { dir: 'right' }),
      extraField: 'stuff',
    },
  })

  expect(hash).toMatchInlineSnapshot(
    `"0x1fc09f7d41b48ea86ea9ed16694c5446dac049e805939d639b8b2354d69c422f"`,
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
      verifyingContract: '0x0000000000000000000000000000000000000000',
      salt: pad(toHex(new Uint8Array([1, 2, 3])), { dir: 'right' }),
    },
    message: {
      data: 'Hello!',
    },
  })

  expect(hash).toMatchInlineSnapshot(
    `"0xa3fc11f2ac42f9ee18f0fc4bebc9fa032a2f97c97e9a3bbab79a226395bcc9b0"`,
  )
})
