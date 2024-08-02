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
    `"0xeb376dca45860063b24144736ec5bd39120d38e280712acb958acdcce3c93c305b0942d29e23474c70132baaff12a47d39c6bceab1255232136d51a9d9f1bd2b01"`,
  )
})
