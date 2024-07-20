import { defineChain } from '../../utils/chain/defineChain.js'

export const localhostNode = /*#__PURE__*/ defineChain({
  id: 201_029,
  name: 'Localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'CFX',
    symbol: 'CFX',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:12537'],
      webSocket: ['ws://127.0.0.1:12535'],
    },
  },
})
