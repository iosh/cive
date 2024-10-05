import { defineChain } from '../../utils/chain/defineChain.js'

export const testnet = defineChain({
  id: 1,
  name: 'Conflux core space testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CFX',
    symbol: 'CFX',
  },
  rpcUrls: {
    default: {
      http: ['https://test.confluxrpc.com', 'https://test.confluxrpc.org'],
      webSocket: [
        'wss://test.confluxrpc.com/ws',
        'wss://test.confluxrpc.org/ws',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Conflux Scan',
      url: 'https://testnet.confluxscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: 'cfxtest:acay1u1fj9bz93334efs447tx1x6y5p61a944zyy47',
      epochCreated: 190_369_991,
    },
  },
  testnet: true,
})
