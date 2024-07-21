import { HDWallet } from '@conflux-dev/hdwallet'
import { PrivateKeyAccount } from 'js-conflux-sdk'
import { expect, test } from 'vitest'
import { accounts, typedData } from '~test/src/constants.js'
import { parseCFX } from '../utils/unit/parseCFX.js'
import { parseGDrip } from '../utils/unit/parseGDrip.js'
import { mnemonicToAccount } from './mnemonicToAccount.js'
const mnemonic =
  'advance income refuse grain method capable upset coast minor situate such library'

const networkId = 1

test('default', () => {
  const account = mnemonicToAccount(mnemonic, { networkId })
  const privateKey = new HDWallet(mnemonic).getPrivateKeyByIndex(0)
  const pkAccount = new PrivateKeyAccount(privateKey, networkId)

  expect(account.address).toEqual(pkAccount.address)

  expect(account).toMatchInlineSnapshot(`
    {
      "address": "cfxtest:aakzfmewzz3gcv37kbvnn23e7vga6ejm6u6cdj8gp8",
      "getHdKey": [Function],
      "publicKey": "0x0440e211139de5952e076d3a953ab71ea91dd9bc3d893623af3e8b942e6c4f3b4ee92d4e514ea4a565ca1cf76f47600d5e5581a2b75b4c6e7f98f1344e95868cbe",
      "signMessage": [Function],
      "signTransaction": [Function],
      "signTypedData": [Function],
      "source": "hd",
      "type": "local",
    }
  `)
})

test('args: addressIndex', () => {
  const account1 = mnemonicToAccount(mnemonic, {
    addressIndex: 1,
    networkId,
  })

  expect(account1.address).toEqual(
    new PrivateKeyAccount(
      new HDWallet(mnemonic).getPrivateKeyByIndex(1),
      networkId,
    ).address,
  )
  expect(account1.address).toMatchInlineSnapshot(
    `"cfxtest:aap1pakbabjsupgfbn4937fhc4nsm1pgajz17chrbg"`,
  )

  const account2 = mnemonicToAccount(mnemonic, {
    addressIndex: 2,
    networkId,
  })

  expect(account2.address).toEqual(
    new PrivateKeyAccount(
      new HDWallet(mnemonic).getPrivateKeyByIndex(2),
      networkId,
    ).address,
  )
  expect(account2.address).toMatchInlineSnapshot(
    `"cfxtest:aamcutmx48kkmwzbfs2cnzfxb5fuuf9pkawus87vva"`,
  )

  const account3 = mnemonicToAccount(mnemonic, {
    addressIndex: 3,
    networkId,
  })

  expect(account3.address).toEqual(
    new PrivateKeyAccount(
      new HDWallet(mnemonic).getPrivateKeyByIndex(3),
      networkId,
    ).address,
  )
  expect(account3.address).toMatchInlineSnapshot(
    `"cfxtest:aanctru4uprdhcju25cxmt9wkg20sn9xwefjs4x90d"`,
  )

  const account4 = mnemonicToAccount(mnemonic, {
    addressIndex: 4,
    networkId,
  })

  expect(account4.address).toEqual(
    new PrivateKeyAccount(
      new HDWallet(mnemonic).getPrivateKeyByIndex(4),
      networkId,
    ).address,
  )
  expect(account4.address).toMatchInlineSnapshot(
    `"cfxtest:aak1m6eza2w0n2h8kvr9vha9una359pxneumhtz6vs"`,
  )
  const account5 = mnemonicToAccount(mnemonic, {
    addressIndex: 5,
    networkId,
  })

  expect(account5.address).toEqual(
    new PrivateKeyAccount(
      new HDWallet(mnemonic).getPrivateKeyByIndex(5),
      networkId,
    ).address,
  )
  expect(account5.address).toMatchInlineSnapshot(
    `"cfxtest:aap36ybybr70evym7pp0cmj6n2zx4kgp9ugjb5cksm"`,
  )
})

test(`path: m/44'/503'/0'/0/index`, () => {
  expect(
    mnemonicToAccount(mnemonic, {
      path: `m/44'/503'/0'/0/${1}`,
      networkId,
    }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aap1pakbabjsupgfbn4937fhc4nsm1pgajz17chrbg"`,
  )

  expect(
    mnemonicToAccount(mnemonic, {
      path: `m/44'/503'/0'/0/${2}`,
      networkId,
    }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aamcutmx48kkmwzbfs2cnzfxb5fuuf9pkawus87vva"`,
  )
  expect(
    mnemonicToAccount(mnemonic, {
      path: `m/44'/503'/0'/0/${3}`,
      networkId,
    }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aanctru4uprdhcju25cxmt9wkg20sn9xwefjs4x90d"`,
  )

  expect(
    mnemonicToAccount(mnemonic, {
      path: `m/44'/503'/0'/0/${4}`,
      networkId,
    }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aak1m6eza2w0n2h8kvr9vha9una359pxneumhtz6vs"`,
  )
  expect(
    mnemonicToAccount(mnemonic, {
      path: `m/44'/503'/0'/0/${5}`,
      networkId,
    }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aap36ybybr70evym7pp0cmj6n2zx4kgp9ugjb5cksm"`,
  )
})

test('args: accountIndex', () => {
  expect(
    mnemonicToAccount(mnemonic, { accountIndex: 1, networkId }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aama29b8ezyvr4a3x8jfdenm7ccr645wr2h2a0vmf5"`,
  )
  expect(
    mnemonicToAccount(mnemonic, { accountIndex: 2, networkId }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aaj29z41d821447k40ukwcjkyvrem0gp5j4yg4zw7v"`,
  )
  expect(
    mnemonicToAccount(mnemonic, { accountIndex: 3, networkId }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aant5tdfc7hv6axyfn6annp73655rwdh2umb7pcg02"`,
  )
})

test('args: changeIndex', () => {
  expect(
    mnemonicToAccount(mnemonic, { changeIndex: 1, networkId }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aamt5s5ugtaypyjgdznwxxebxc832ehhhybnampk1p"`,
  )
  expect(
    mnemonicToAccount(mnemonic, { changeIndex: 2, networkId }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aan3nyue8a92scr4byw1nznz4ya7mbcjeemefcjes6"`,
  )
  expect(
    mnemonicToAccount(mnemonic, { changeIndex: 3, networkId }).address,
  ).toMatchInlineSnapshot(
    `"cfxtest:aaj1847xzcy0jdnkn93nzuxvnuetc8x34pgstt4rm8"`,
  )
})

test('sign message', async () => {
  const account = mnemonicToAccount(mnemonic, { networkId })
  expect(
    await account.signMessage({ message: 'hello world' }),
  ).toMatchInlineSnapshot(
    `"0x06526845f4507614d6ae149da128149e4c17f95ac36a90b3fafcb120c2e430e271d96c685d406f1fb58478f1e5786aebf2187c1cf10fc81a50f0aea54dfa2acd1b"`,
  )
})

test('sign transaction', async () => {
  const account = mnemonicToAccount(mnemonic, { networkId })
  expect(
    await account.signTransaction({
      chainId: 1,
      maxFeePerGas: parseGDrip('20'),
      gas: 21000n,
      to: accounts[1].base32Address,
      value: parseCFX('1'),
    }),
  ).toMatchInlineSnapshot(
    `"0x63667802f872ee80808504a817c80082520894153ebbc6bfceeb54d8eff324c781290a952cd60c880de0b6b3a764000080800180c080a0b13218913d57bafa7ed4f2872de613b2b42ca3b5e57a4cb34c76945b7d5e0f4aa07b17db9c384b2ada896c4f23769bfdbf49a784908e953e7bb85735d0591443dc"`,
  )
})

test('sign typed data', async () => {
  const account = mnemonicToAccount(mnemonic, { networkId })
  expect(
    await account.signTypedData({ ...typedData.basic, primaryType: 'Mail' }),
  ).toMatchInlineSnapshot(
    `"0x62467c20d6cd1ea4c1c2b0156d7118b926bf089787775951f02c9c5909a1936826cedb8fb9c00e11f332cc7fd965e74becd50f5e58fed10d851ed9721a403ffc1c"`,
  )
})
