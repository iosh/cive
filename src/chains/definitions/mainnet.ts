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
})
