import { defineChain } from '../../utils/chain/defineChain.js'

export const mainnet = defineChain({
  id: 1029,
  name: 'Conflux core space',
  nativeCurrency: {
    decimals: 18,
    name: 'CFX',
    symbol: 'CFX',
  },
  rpcUrls: {
    default: {
      http: ['https://main.confluxrpc.com', 'https://main.confluxrpc.org'],
      webSocket: [
        'wss://main.confluxrpc.com/ws',
        'wss://main.confluxrpc.org/ws',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Conflux Scan',
      url: 'https://confluxscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: 'cfx:acevn2d3dr6vh4jca28c6cmvkktsg7r8n25vp9hnmw',
      epochCreated: 106_231_941,
    },
  },
  fees: {
    baseFeeMultiplier: 1,
  },
})
