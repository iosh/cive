import { privateKeyToAccount } from '~cive/accounts/privateKeyToAccount.js'

export const accounts = [
  {
    privateKey:
      '0x34fce6e29a7b0dbd92f51a3d0a3d4db83f55958ff6552e6f0d4ee3ef21cd2d3e',
    hexAddress: '0x156f6c9df2f05f1e9c15b10dbebd8851c9b4842f',
    netId: 201029,
    base32Address: 'net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x',
    balance: 10000000000000000000000n,
  },
  {
    privateKey:
      '0xd6a7c99b9036ab9fda511a49e8401783f00960103622659b381dd0174f63880c',
    hexAddress: '0x153ebbc6bfceeb54d8eff324c781290a952cd60c',
    netId: 201029,
    base32Address: 'net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa',
    balance: 10000000000000000000000n,
  },
  {
    privateKey:
      '0x306c52752a5b6169606f20e61d1c7c192cfb7342d55b2b737c639309918c6a59',
    hexAddress: '0x1d9dd99dbdeb9aaff5a0b7d7b4fa38d9ef11a38d',
    netId: 201029,
    base32Address: 'net201029:aas350p711z3zn9zyc57trh4hdp88erdvyan0hnmds',
    balance: 10000000000000000000000n,
  },
  {
    privateKey:
      '0xaac8c722ef208be93da651876c0df21b7f837d65e381ca335cab15e069ce8861',
    hexAddress: '0x1546e522e8f48f88f83fdffe0aaaa341ba289c5a',
    netId: 201029,
    base32Address: 'net201029:aamyr3kc7d4j9ch2h9t96czmyra5yme6njbzdtv67w',
    balance: 10000000000000000000000n,
  },
  {
    privateKey:
      '0x6e87d48346aeae3456037263ac2df038339ee0a8493cc007cb9f3c0d3f3aadab',
    hexAddress: '0x15ba3b320d1376e6fee6a0353218075a89ab44be',
    netId: 201029,
    base32Address: 'net201029:aam5ys3wbyk1r31864udmpu2a7rjxm4e12nx9fr12s',
    balance: 10000000000000000000000n,
  },
  {
    privateKey:
      '0x64ffb5a4a0dba5bc8a2783e701c7466a80e2e266613b63fd47dc6bf03f89581b',
    hexAddress: '0x1f91f4668ff7f9851e8690739f617df494e0db22',
    netId: 201029,
    base32Address: 'net201029:aat3d7dgv959xbj8u4jhhh5bt14kk2g5ejvvcm842d',
    balance: 10000000000000000000000n,
  },
  {
    privateKey:
      '0xdec3911f8beaa9995f61b0a41f6834bc7f3da62f1da6d09c49bdb34576644d8d',
    hexAddress: '0x1b0f6a614f8b98d4b15eeef3daaee7da36a9213d',
    netId: 201029,
    base32Address: 'net201029:aaru84xbk8f3vzfvn51th0zs69rdrmkbhyjuxp9cd1',
    balance: 10000000000000000000000n,
  },
  {
    privateKey:
      '0x6624e0de6a6407809b1f91fa21fd673d5664c61b581114a4f9600ed6d2327f46',
    hexAddress: '0x1feae75b3ec40a2877a40770c0771474f176e7de',
    netId: 201029,
    base32Address: 'net201029:aat8z345h5caymd1yud1bud1cv4tc71h52m8y4s509',
    balance: 10000000000000000000000n,
  },
  {
    privateKey:
      '0x041816c55f0f6e295ee9faf56335db23bbce65274de7c7f715c28da2be485030',
    hexAddress: '0x119e8ff9d4784aac9ac614a074ecf77cdc9ac340',
    netId: 201029,
    base32Address: 'net201029:aaj37d934v6ezne422mma7hp878r3g0djavkw4kucz',
    balance: 10000000000000000000000n,
  },
  {
    privateKey:
      '0xf4e88fd5c0fda9f96df2c238190e0869e6a520cb0ac51c5eaf3814828004707a',
    hexAddress: '0x1d3b4acd9d291f91c0abab8e8b1f0751043de8d2',
    netId: 201029,
    base32Address: 'net201029:aasx0w0rxyyv9esazsz27c29a7jujttj4j007me0pv',
    balance: 10000000000000000000000n,
  },
] as const

export function getTestAccount(account: (typeof accounts)[number]) {
  return privateKeyToAccount(account.privateKey, {
    networkId: account.netId,
  })
}

export const typedData = {
  CIP23Domain: [
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
  ],
  basic: {
    domain: {
      name: 'CFX Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0x0000000000000000000000000000000000000000',
    },
    types: {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    },
    message: {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    },
  },
  complex: {
    domain: {
      name: 'Ether Mail 🥵',
      version: '1.1.1',
      chainId: 1,
      verifyingContract: '0x0000000000000000000000000000000000000000',
    },
    types: {
      Name: [
        { name: 'first', type: 'string' },
        { name: 'last', type: 'string' },
      ],
      Person: [
        { name: 'name', type: 'Name' },
        { name: 'wallet', type: 'address' },
        { name: 'favoriteColors', type: 'string[3]' },
        { name: 'foo', type: 'uint256' },
        { name: 'age', type: 'uint8' },
        { name: 'isCool', type: 'bool' },
      ],
      Mail: [
        { name: 'timestamp', type: 'uint256' },
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
        { name: 'hash', type: 'bytes' },
      ],
    },
    message: {
      timestamp: 1234567890n,
      contents: 'Hello, Bob! 🖤',
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      from: {
        name: {
          first: 'Cow',
          last: 'Burns',
        },
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        age: 69,
        foo: 123123123123123123n,
        favoriteColors: ['red', 'green', 'blue'],
        isCool: false,
      },
      to: {
        name: { first: 'Bob', last: 'Builder' },
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        age: 70,
        foo: 123123123123123123n,
        favoriteColors: ['orange', 'yellow', 'green'],
        isCool: true,
      },
    },
  },
} as const
