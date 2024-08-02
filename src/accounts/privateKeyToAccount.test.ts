import { expect, test } from 'vitest'

import { accounts, typedData } from '~test/src/constants.js'

import { PrivateKeyAccount } from 'js-conflux-sdk'
import { parseCFX } from '../utils/unit/parseCFX.js'
import { parseGDrip } from '../utils/unit/parseGDrip.js'
import { privateKeyToAccount } from './privateKeyToAccount.js'

const networkId = 1
test('default', () => {
  const account = privateKeyToAccount(accounts[0].privateKey, { networkId })
  const sdkAccount = new PrivateKeyAccount(accounts[0].privateKey, networkId)

  expect(account.address).toEqual(sdkAccount.address)
  expect(account).toMatchInlineSnapshot(`
    {
      "address": "cfxtest:aam085e78n2f8hy6c02u5tz7vbj6xreef69nx5trzh",
      "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
      "signMessage": [Function],
      "signTransaction": [Function],
      "signTypedData": [Function],
      "source": "privateKey",
      "type": "local",
    }
  `)
})

test('sign message', async () => {
  expect(
    privateKeyToAccount(accounts[0].privateKey, { networkId }),
  ).toMatchInlineSnapshot(
    `
    {
      "address": "cfxtest:aam085e78n2f8hy6c02u5tz7vbj6xreef69nx5trzh",
      "publicKey": "0x048064bd213c0f12a2caf3521e178f70e29fe8a47f4f3ca49370a65547b5401ae75cdd9d2c9ee4461f55cce87b81f8422dfa51a6798b8bcbe5afde60405c8099a2",
      "signMessage": [Function],
      "signTransaction": [Function],
      "signTypedData": [Function],
      "source": "privateKey",
      "type": "local",
    }
  `,
  )
})

test('sign transaction', async () => {
  const account = privateKeyToAccount(accounts[0].privateKey, { networkId })
  expect(
    await account.signTransaction({
      chainId: 1,
      maxFeePerGas: parseGDrip('20'),
      gas: 21000n,
      to: accounts[1].base32Address,
      value: parseCFX('1'),
    }),
  ).toMatchInlineSnapshot(
    `"0x63667802f872ee80808504a817c80082520894153ebbc6bfceeb54d8eff324c781290a952cd60c880de0b6b3a764000080800180c080a0ee0b534593c4353fa5b949c5267ceead9d75529627de012012345b7c616a9e85a035453936c9f7b19992f38078d807b22e1dec77e5fe00b3a9b351fb629be87ef9"`,
  )
})

test('sign typed data', async () => {
  const account = privateKeyToAccount(accounts[0].privateKey, { networkId })
  expect(
    await account.signTypedData({ ...typedData.basic, primaryType: 'Mail' }),
  ).toMatchInlineSnapshot(
    `"0xeb376dca45860063b24144736ec5bd39120d38e280712acb958acdcce3c93c305b0942d29e23474c70132baaff12a47d39c6bceab1255232136d51a9d9f1bd2b01"`,
  )
})
