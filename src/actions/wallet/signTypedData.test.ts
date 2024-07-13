import { expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, typedData } from '~test/src/constants.js'
import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import { signTypedData } from './signTypedData.js'

const client = devConflux.getClient()

test('default: local', async () => {
  const signature = await signTypedData(client, {
    ...typedData.basic,
    account: privateKeyToAccount(accounts[0].privateKey, {
      networkId: accounts[0].netId,
    }),
    primaryType: 'Mail',
  })

  expect(signature).toMatchInlineSnapshot(
    `"0x48154bb5d9403ccaf991ada81e1d61142ba85b85702f390d3945bcca57cfad9025d826045e1a9c8dca343f69a8f24d94e7f20143ddd115e3d2acee25d2d590811c"`,
  )
})
