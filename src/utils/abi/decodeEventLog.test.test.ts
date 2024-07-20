import { assertType, expect, test } from 'vitest'

import { accounts } from '../../../test/src/constants.js'
import { hexAddressToBase32 } from '../address/hexAddressToBase32.js'
import { decodeEventLog } from './decodeEventLog.js'

test('Transfer()', () => {
  const event = decodeEventLog({
    abi: [
      {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [],
        name: 'Approve',
        type: 'event',
      },
    ],
    topics: [
      '0x406dade31f7ae4b5dbc276258c28dde5ae6d5c2773c5745802c493a2360e55e0',
    ],
    networkId: accounts[0].netId,
  })
  assertType<typeof event>({ eventName: 'Transfer' })
  expect(event).toEqual({
    eventName: 'Transfer',
  })
})

test('named args: Transfer(address,address,uint256)', () => {
  const event = decodeEventLog({
    abi: [
      {
        inputs: [
          {
            indexed: true,
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ],
    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
      '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
    ],
    networkId: accounts[0].netId,
  })
  assertType<typeof event>({
    eventName: 'Transfer',
    args: {
      from: accounts[0].base32Address,
      to: accounts[1].base32Address,
      tokenId: 1n,
    },
  })
  expect(event).toEqual({
    eventName: 'Transfer',
    args: {
      from: hexAddressToBase32({
        hexAddress: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
        networkId: accounts[0].netId,
      }),
      to: hexAddressToBase32({
        hexAddress: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
        networkId: accounts[0].netId,
      }),
      tokenId: 1n,
    },
  })
})
test('named args with a missing name: Transfer(address,address,uint256)', () => {
  const event = decodeEventLog({
    abi: [
      {
        inputs: [
          {
            indexed: true,
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            name: '',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ],
    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
      '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
    ],
    networkId: accounts[0].netId,
  })
  assertType<typeof event>({
    eventName: 'Transfer',
    args: [accounts[0].base32Address, accounts[1].base32Address, 1n],
  })
  expect(event).toEqual({
    args: [
      hexAddressToBase32({
        hexAddress: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
        networkId: accounts[0].netId,
      }),
      hexAddressToBase32({
        hexAddress: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
        networkId: accounts[0].netId,
      }),
      1n,
    ],
    eventName: 'Transfer',
  })
})

test('unnamed args: Transfer(address,address,uint256)', () => {
  const event = decodeEventLog({
    abi: [
      {
        inputs: [
          {
            indexed: true,
            type: 'address',
          },
          {
            indexed: true,
            type: 'address',
          },
          {
            indexed: false,
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ],
    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
      '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac',
    ],
    networkId: accounts[0].netId,
  })
  assertType<typeof event>({
    eventName: 'Transfer',
    args: [accounts[0].base32Address, accounts[1].base32Address, 1n],
  })
  expect(event).toEqual({
    args: [
      hexAddressToBase32({
        hexAddress: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
        networkId: accounts[0].netId,
      }),
      hexAddressToBase32({
        hexAddress: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
        networkId: accounts[0].netId,
      }),
      1n,
    ],
    eventName: 'Transfer',
  })
})
test('Foo(string)', () => {
  const event = decodeEventLog({
    abi: [
      {
        inputs: [
          {
            indexed: true,
            name: 'message',
            type: 'string',
          },
        ],
        name: 'Foo',
        type: 'event',
      },
    ],
    topics: [
      '0x9f0b7f1630bdb7d474466e2dfef0fb9dff65f7a50eec83935b68f77d0808f08a',
      '0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8',
    ],
    networkId: accounts[0].netId,
  })
  assertType<typeof event>({
    eventName: 'Foo',
    args: {
      message:
        '0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8',
    },
  })
  expect(event).toEqual({
    args: {
      message:
        '0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8',
    },
    eventName: 'Foo',
  })
})

test('args: eventName', () => {
  const event = decodeEventLog({
    abi: [
      {
        inputs: [
          {
            indexed: true,
            type: 'address',
          },
          {
            indexed: true,
            type: 'address',
          },
          {
            indexed: false,
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          {
            indexed: true,
            name: 'message',
            type: 'string',
          },
        ],
        name: 'Foo',
        type: 'event',
      },
    ],
    eventName: 'Foo',
    topics: [
      '0x9f0b7f1630bdb7d474466e2dfef0fb9dff65f7a50eec83935b68f77d0808f08a',
      '0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8',
    ],
    networkId: accounts[0].netId,
  })
  assertType<typeof event>({
    eventName: 'Foo',
    args: {
      message:
        '0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8',
    },
  })
  expect(event).toEqual({
    args: {
      message:
        '0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8',
    },
    eventName: 'Foo',
  })
})

test('args: data – named (address,address,uint256)', () => {
  const event = decodeEventLog({
    abi: [
      {
        inputs: [
          {
            indexed: true,
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ],
    eventName: 'Transfer',
    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045',
      '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    ],
    networkId: accounts[0].netId,
  })
  assertType<typeof event>({
    eventName: 'Transfer',
    args: {
      from: accounts[0].base32Address,
      to: accounts[0].base32Address,
      tokenId: 1n,
    },
  })
  expect(event).toEqual({
    eventName: 'Transfer',
    args: {
      from: hexAddressToBase32({
        hexAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        networkId: accounts[0].netId,
      }),
      to: hexAddressToBase32({
        hexAddress: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        networkId: accounts[0].netId,
      }),
      tokenId: 1n,
    },
  })
})

test('args: data – unnamed (address,address,uint256)', () => {
  const event = decodeEventLog({
    abi: [
      {
        inputs: [
          {
            indexed: true,
            type: 'address',
          },
          {
            indexed: true,
            type: 'address',
          },
          {
            indexed: false,
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ],
    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
    eventName: 'Transfer',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045',
      '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    ],
    networkId: accounts[0].netId,
  })
  assertType<typeof event>({
    eventName: 'Transfer',
    args: [accounts[0].base32Address, accounts[0].base32Address, 1n],
  })
  expect(event).toEqual({
    eventName: 'Transfer',
    args: [
      hexAddressToBase32({
        hexAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        networkId: accounts[0].netId,
      }),
      hexAddressToBase32({
        hexAddress: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        networkId: accounts[0].netId,
      }),
      1n,
    ],
  })
})
