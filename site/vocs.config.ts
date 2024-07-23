import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'Cive',
  baseUrl: 'https://cive.zyx.ee',
  titleTemplate: '%s · Cive',
  description: 'Build Conflux core space apps with Cive',
  topNav: [{ text: 'Docs', link: '/docs/getting-started', match: '/docs' }],
  sidebar: {
    '/docs/': [
      {
        text: 'Introduction',
        items: [
          { text: 'Installation', link: '/docs/installation' },
          { text: 'Getting Started', link: '/docs/getting-started' },
        ],
      },
      {
        text: 'Clients & Transports',
        items: [
          { text: 'Introduction', link: '/docs/clients/installation' },
          { text: 'Public Client', link: '/docs/clients/public' },
          { text: 'Wallet Client', link: '/docs/clients/wallet' },
          {
            text: 'Transports',
            items: [
              {
                text: 'HTTP',
                link: '/docs/clients/transports/http',
              },
            ],
          },
        ],
      },
      {
        text: 'Public Actions',
        collapsed: true,
        items: [
          { text: 'Introduction', link: '/docs/actions/public/introduction' },
          {
            text: 'Block',
            items: [
              { text: 'getBlock', link: '/docs/actions/public/getBlock' },
              {
                text: 'getBastBlockHash',
                link: '/docs/actions/public/getBastBlockHash',
              },
              {
                text: 'getEpochNumber',
                link: '/docs/actions/public/getEpochNumber',
              },
            ],
          },
          {
            text: 'Fee',
            items: [
              {
                text: 'getGasPrice',
                link: '/docs/actions/public/getGasPrice',
              },
              {
                text: 'estimateMaxPriorityFeePerGas',
                link: '/docs/actions/public/estimateMaxPriorityFeePerGas',
              }
            ],
          },
          {
            text: 'Transaction',
            items: [
              {
                text: 'getTransaction',
                link: '/docs/actions/public/getTransaction',
              },
            ],
          },
        ],
      },
    ],
  },
  rootDir: '.',
})
