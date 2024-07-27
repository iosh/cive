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
            text: 'Account',
            items: [
              {
                text: 'getBalance',
                link: '/docs/actions/public/getBalance',
              },
              {
                text: 'getStakingBalance',
                link: '/docs/actions/public/getStakingBalance',
              },
              {
                text: 'getNextNonce',
                link: '/docs/actions/public/getNextNonce',
              },
              {
                text: 'getAccount',
                link: '/docs/actions/public/getAccount',
              },
              {
                text: 'checkBalanceAgainstTransaction',
                link: '/docs/actions/public/checkBalanceAgainstTransaction',
              },
            ],
          },
          {
            text: 'Epoch',
            items: [
              {
                text: 'getInterestRate',
                link: '/docs/actions/public/getInterestRate',
              },
              {
                text: 'getAccumulateInterestRate',
                link: '/docs/actions/public/getAccumulateInterestRate',
              },
              {
                text: 'getSkippedBlocksByEpoch',
                link: '/docs/actions/public/getSkippedBlocksByEpoch',
              },
            ],
          },
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
              {
                text: 'getBlocksByEpoch',
                link: '/docs/actions/public/getBlocksByEpoch',
              },
              {
                text: 'getConfirmationRiskByHash',
                link: '/docs/actions/public/getConfirmationRiskByHash',
              },
            ],
          },
          {
            text: 'Call',
            items: [
              {
                text: 'call',
                link: '/docs/actions/public/call',
              },
            ],
          },
          {
            text: 'Filters & Logs',
            items: [
              {
                text: 'getLogs',
                link: '/docs/actions/public/getLogs',
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
              },
              {
                text: 'getFeeHistory',
                link: '/docs/actions/public/getFeeHistory',
              },
              {
                text: 'getCollateralForStorage',
                link: '/docs/actions/public/getCollateralForStorage',
              },
              {
                text: 'estimateGasAndCollateral',
                link: '/docs/actions/public/estimateGasAndCollateral',
              },
            ],
          },
          {
            text: 'Transaction',
            items: [
              {
                text: 'getTransaction',
                link: '/docs/actions/public/getTransaction',
              },
              {
                text: 'getTransactionReceipt',
                link: '/docs/actions/public/getTransactionReceipt',
              },
            ],
          },
          {
            text: 'Node',
            items: [
              { text: 'getStatus', link: '/docs/actions/public/getStatus' },
              {
                text: 'getClientVersion',
                link: '/docs/actions/public/getClientVersion',
              },
            ],
          },
        ],
      },
      {
        text: 'Wallet Actions',
        items: [
          { text: 'Introduction', link: '/docs/actions/wallet/introduction' },
          {
            text: 'sendRawTransaction',
            link: '/docs/actions/wallet/sendRawTransaction',
          },
        ],
      },
      {
        text: 'Contract',
        items: [
          {
            text: 'Actions',
            items: [
              { text: 'getAdmin', link: '/docs/contract/getAdmin' },
              { text: 'getCode', link: '/docs/contract/getCode' },
              { text: 'getStorageAt', link: '/docs/contract/getStorageAt' },
              { text: 'getStorageRoot', link: '/docs/contract/getStorageRoot' },
              { text: 'getSponsorInfo', link: '/docs/contract/getSponsorInfo' },
            ],
          },
        ],
      },
    ],
  },
  rootDir: '.',
})
