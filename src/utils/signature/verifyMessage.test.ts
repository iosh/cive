import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { mnemonicToAccount } from '../../accounts/mnemonicToAccount.js'
import { signMessage } from '../../actions/wallet/signMessage.js'
import { hexAddressToBase32 } from '../address/hexAddressToBase32.js'
import { verifyMessage } from './verifyMessage.js'

const client = devConflux.getClient({ account: getTestAccount(accounts[0]) })
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

const sourceAccount = getTestAccount(accounts[0])
test('default', async () => {
  let signature = await signMessage(client, {
    account: sourceAccount,
    message: 'hello world',
  })
  expect(
    await verifyMessage({
      address: sourceAccount.address,
      message: 'hello world',
      signature,
    }),
  ).toBeTruthy()

  signature = await signMessage(client!, {
    account: sourceAccount,
    message: 'cive 🥰',
  })
  expect(
    await verifyMessage({
      address: sourceAccount.address,
      message: 'cive 🥰',
      signature,
    }),
  ).toBeTruthy()
})

test('raw message', async () => {
  expect(
    await verifyMessage({
      address: sourceAccount.address,
      message: { raw: '0x68656c6c6f20776f726c64' },
      signature: await signMessage(client, {
        account: sourceAccount,
        message: { raw: '0x68656c6c6f20776f726c64' },
      }),
    }),
  ).toBe(true)
})

test('signer address', async () => {
  const account = mnemonicToAccount(
    'advance income refuse grain method capable upset coast minor situate such library',
    { networkId: accounts[0].netId },
  )
  const signature = await signMessage(client, {
    account,
    message: 'hello world',
  })

  expect(
    await verifyMessage({
      address: account.address,
      message: 'hello world',
      signature,
    }),
  ).toBe(true)
  expect(
    await verifyMessage({
      address: account.address,
      message: 'hello world1',
      signature,
    }),
  ).toBe(false)
  expect(
    await verifyMessage({
      address: hexAddressToBase32({
        hexAddress: '0x8352a892ad7261473d4862b5e324ec4c0e110ae4',
        networkId: accounts[0].netId,
      }),
      message: 'hello world',
      signature,
    }),
  ).toBe(false)
})
