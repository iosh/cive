import { afterAll, beforeAll, expect, test, vi } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'

import { parseCFX } from '../../utils/unit/parseCFX.js'
import { parseGDrip } from '../../utils/unit/parseGDrip.js'
import { mine } from '../test/mine.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'
import * as getBlock from '../public/getBlock.js'
import { prepareTransactionRequest } from './prepareTransactionRequest.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({ account: sourceAccount })
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const { nonce: _nonce, ...request } = await prepareTransactionRequest(
    client,
    {
      account: sourceAccount,
      to: sourceAccount.address,
      value: parseCFX('1'),
    },
  )
  expect(request).toMatchInlineSnapshot(`
    {
      "accessList": undefined,
      "account": {
        "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
        "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "privateKey",
        "type": "local",
      },
      "chainId": 201029,
      "data": undefined,
      "epochHeight": 0n,
      "from": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "gas": 21000n,
      "gasPrice": 1200000000n,
      "storageLimit": 0n,
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "type": "legacy",
      "value": 1000000000000000000n,
    }
  `)
})

test('1559', async () => {
  await mine(client, { blocks: 5 })
  await mine(client, { blocks: 5 })
  const block = await getBlock.getBlock(client)
  const {
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce: _nonce,
    ...rest
  } = await prepareTransactionRequest(client, {
    to: sourceAccount.address,
    value: parseCFX('1'),
  })
  expect(maxFeePerGas).toEqual(
    (block.baseFeePerGas! * 120n) / 100n + maxPriorityFeePerGas!,
  )
  expect(rest).toMatchInlineSnapshot(`
    {
      "accessList": undefined,
      "chainId": 201029,
      "data": undefined,
      "epochHeight": 10n,
      "from": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "gas": 21000n,
      "storageLimit": 0n,
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "type": "eip1559",
      "value": 1000000000000000000n,
    }
  `)
})

test('args: account', async () => {
  const {
    maxFeePerGas: _maxFeePerGas,
    nonce: _nonce,
    ...rest
  } = await prepareTransactionRequest(client, {
    account: sourceAccount,
    to: sourceAccount.address,
    value: parseCFX('1'),
  })

  expect(rest).toMatchInlineSnapshot(`
    {
      "accessList": undefined,
      "account": {
        "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
        "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "privateKey",
        "type": "local",
      },
      "chainId": 201029,
      "data": undefined,
      "epochHeight": 10n,
      "from": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "gas": 21000n,
      "maxPriorityFeePerGas": 0n,
      "storageLimit": 0n,
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "type": "eip1559",
      "value": 1000000000000000000n,
    }
  `)
})

test('args: chain', async () => {
  const {
    maxFeePerGas: _maxFeePerGas,
    nonce: _nonce,
    ...rest
  } = await prepareTransactionRequest(client, {
    account: sourceAccount,
    to: sourceAccount.address,
    value: parseCFX('1'),
  })
  expect(rest).toMatchInlineSnapshot(`
    {
      "accessList": undefined,
      "account": {
        "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
        "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "privateKey",
        "type": "local",
      },
      "chainId": 201029,
      "data": undefined,
      "epochHeight": 10n,
      "from": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "gas": 21000n,
      "maxPriorityFeePerGas": 0n,
      "storageLimit": 0n,
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "type": "eip1559",
      "value": 1000000000000000000n,
    }
  `)
})

test('args: chainId', async () => {
  const {
    maxFeePerGas: _maxFeePerGas,
    nonce: _nonce,
    ...rest
  } = await prepareTransactionRequest(client, {
    account: sourceAccount,
    to: sourceAccount.address,
    chainId: 69,
    value: parseCFX('1'),
  })
  expect(rest).toMatchInlineSnapshot(`
    {
      "accessList": undefined,
      "account": {
        "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
        "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "privateKey",
        "type": "local",
      },
      "chainId": 69,
      "data": undefined,
      "epochHeight": 10n,
      "from": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "gas": 21000n,
      "maxPriorityFeePerGas": 0n,
      "storageLimit": 0n,
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "type": "eip1559",
      "value": 1000000000000000000n,
    }
  `)
})

test('args: nonce', async () => {
  const { maxFeePerGas: _maxFeePerGas, ...rest } =
    await prepareTransactionRequest(client, {
      account: sourceAccount,
      to: sourceAccount.address,
      nonce: 5,
      value: parseCFX('1'),
    })
  expect(rest).toMatchInlineSnapshot(`
    {
      "accessList": undefined,
      "account": {
        "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
        "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "privateKey",
        "type": "local",
      },
      "chainId": 201029,
      "data": undefined,
      "epochHeight": 10n,
      "from": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "gas": 21000n,
      "maxPriorityFeePerGas": 0n,
      "nonce": 5,
      "storageLimit": 0n,
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "type": "eip1559",
      "value": 1000000000000000000n,
    }
  `)
})

test('args: gasPrice', async () => {
  vi.spyOn(getBlock, 'getBlock').mockResolvedValueOnce({} as any)

  const { nonce: _nonce, ...request } = await prepareTransactionRequest(
    client,
    {
      account: sourceAccount,
      to: sourceAccount.address,
      gasPrice: parseGDrip('10'),
      value: parseCFX('1'),
    },
  )
  expect(request).toMatchInlineSnapshot(`
    {
      "accessList": undefined,
      "account": {
        "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
        "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "privateKey",
        "type": "local",
      },
      "chainId": 201029,
      "data": undefined,
      "epochHeight": 10n,
      "from": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "gas": 21000n,
      "gasPrice": 10000000000n,
      "storageLimit": 0n,
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "type": "legacy",
      "value": 1000000000000000000n,
    }
  `)
})

test('args: gasPrice (on chain w/ block.baseFeePerGas)', async () => {
  const { nonce: _nonce, ...request } = await prepareTransactionRequest(
    client,
    {
      account: sourceAccount,
      to: sourceAccount.address,
      gasPrice: parseGDrip('10'),
      value: parseCFX('1'),
    },
  )
  expect(request).toMatchInlineSnapshot(`
    {
      "accessList": undefined,
      "account": {
        "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
        "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "privateKey",
        "type": "local",
      },
      "chainId": 201029,
      "data": undefined,
      "epochHeight": 10n,
      "from": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "gas": 21000n,
      "gasPrice": 10000000000n,
      "storageLimit": 0n,
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "type": "legacy",
      "value": 1000000000000000000n,
    }
  `)
})

test('args: maxFeePerGas', async () => {
  const { nonce: _nonce, ...rest } = await prepareTransactionRequest(client, {
    account: sourceAccount,
    to: sourceAccount.address,
    maxFeePerGas: parseGDrip('100'),
    value: parseCFX('1'),
  })
  expect(rest).toMatchInlineSnapshot(`
    {
      "accessList": undefined,
      "account": {
        "address": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
        "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "privateKey",
        "type": "local",
      },
      "chainId": 201029,
      "data": undefined,
      "epochHeight": 10n,
      "from": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "gas": 21000n,
      "maxFeePerGas": 100000000000n,
      "maxPriorityFeePerGas": 0n,
      "storageLimit": 0n,
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "type": "eip1559",
      "value": 1000000000000000000n,
    }
  `)
})
