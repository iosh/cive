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
        'wss://test.confluxrpc.org/com',
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
  testnet: true,
})
