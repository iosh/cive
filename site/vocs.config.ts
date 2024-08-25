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
              {
                text: 'Fallback',
                link: '/docs/clients/transports/fallback',
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
              {
                text: 'getDepositList',
                link: '/docs/actions/public/getDepositList',
              },
              {
                text: 'getAccountPendingInfo',
                link: '/docs/actions/public/getAccountPendingInfo',
              },
              {
                text: 'getAccountPendingTransactions',
                link: '/docs/actions/public/getAccountPendingTransactions',
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
              {
                text: 'getBlockRewardInfo',
                link: '/docs/actions/public/getBlockRewardInfo',
              },
              {
                text: 'getPoSRewards',
                link: '/docs/actions/public/getPoSRewards',
              },
              {
                text: 'watchEpochNumber',
                link: '/docs/actions/public/watchEpochNumber',
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
              {
                text: 'getBlockByHashWithPivotAssumption',
                link: '/docs/actions/public/getBlockByHashWithPivotAssumption',
              },
              {
                text: 'getPoSBlock',
                link: '/docs/actions/public/getPoSBlock',
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
              {
                text: 'createEventFilter',
                link: '/docs/actions/public/createEventFilter',
              },
              {
                text: 'createBlockFilter',
                link: '/docs/actions/public/createBlockFilter',
              },
              {
                text: 'getFilterLogs',
                link: '/docs/actions/public/getFilterLogs',
              },
              {
                text: 'createPendingTransactionFilter',
                link: '/docs/actions/public/createPendingTransactionFilter',
              },
              {
                text: 'getFilterChanges',
                link: '/docs/actions/public/getFilterChanges',
              },
              {
                text: 'uninstallFilter',
                link: '/docs/actions/public/uninstallFilter',
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
              {
                text: 'getFeeBurnt',
                link: '/docs/actions/public/getFeeBurnt',
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
              {
                text: 'getEpochReceipts',
                link: '/docs/actions/public/getEpochReceipts',
              },
              {
                text: 'getPoSTransactionByNumber',
                link: '/docs/actions/public/getPoSTransactionByNumber',
              },
              {
                text: 'waitForTransactionReceipt',
                link: '/docs/actions/public/waitForTransactionReceipt',
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
              {
                text: 'getSupplyInfo',
                link: '/docs/actions/public/getSupplyInfo',
              },
              {
                text: 'getCollateralInfo',
                link: '/docs/actions/public/getCollateralInfo',
              },
            ],
          },
          {
            text: 'PoS',
            items: [
              {
                text: 'getPoSEconomics',
                link: '/docs/actions/public/getPoSEconomics',
              },
              {
                text: 'getPoSRewardByEpoch',
                link: '/docs/actions/public/getPoSRewardByEpoch',
              },
              {
                text: 'getPoSStatus',
                link: '/docs/actions/public/getPoSStatus',
              },
              {
                text: 'getPoSAccount',
                link: '/docs/actions/public/getPoSAccount',
              },
              {
                text: 'getPosCommittee',
                link: '/docs/actions/public/getPosCommittee',
              },
            ],
          },
          {
            text: 'DAO',
            items: [
              {
                text: 'getParamsFromVote',
                link: '/docs/actions/public/getParamsFromVote',
              },
            ],
          },
        ],
      },
      {
        text: 'Wallet Actions',
        collapsed: true,
        items: [
          { text: 'Introduction', link: '/docs/actions/wallet/introduction' },
          {
            text: 'Account',
            items: [
              {
                text: 'getAddresses',
                link: '/docs/actions/wallet/getAddresses',
              },
              {
                text: 'requestAddresses',
                link: '/docs/actions/wallet/requestAddresses',
              },
            ],
          },
          {
            text: 'Chain',
            items: [
              {
                text: 'switchChain',
                link: '/docs/actions/wallet/switchChain',
              },
            ],
          },
          {
            text: 'Data',
            items: [
              {
                text: 'signMessage',
                link: '/docs/actions/wallet/signMessage',
              },
            ],
          },
          {
            text: 'Transaction',
            items: [
              {
                text: 'sendRawTransaction',
                link: '/docs/actions/wallet/sendRawTransaction',
              },
              {
                text: 'prepareTransactionRequest',
                link: '/docs/actions/wallet/prepareTransactionRequest',
              },
            ],
          },
        ],
      },
      {
        text: 'Accounts',
        collapsed: true,
        items: [
          {
            text: 'JSON-RPC Account',
            link: '/docs/accounts/json-rpcAccount',
          },
          {
            text: 'Local Accounts',
            link: '/docs/accounts/localAccounts',
            items: [
              {
                text: 'Private Key',
                link: '/docs/accounts/privateKeyToAccount',
              },
              {
                text: 'Mnemonic',
                link: '/docs/accounts/mnemonicToAccount',
              },
              {
                text: 'Hierarchical Deterministic (HD)',
                link: '/docs/accounts/hdKeyToAccount',
              },
              {
                text: 'Utilities',
                items: [
                  { text: 'signMessage', link: '/docs/accounts/signMessage' },
                  {
                    text: 'signTransaction',
                    link: '/docs/accounts/signTransaction',
                  },
                  {
                    text: 'signTypedData',
                    link: '/docs/accounts/signTypedData',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        text: 'Contract',
        collapsed: true,
        items: [
          {
            text: 'Contract Instances',
            link: '/docs/contract/getContract',
          },
          {
            text: 'Actions',
            items: [
              { text: 'getAdmin', link: '/docs/contract/getAdmin' },
              { text: 'getCode', link: '/docs/contract/getCode' },
              { text: 'getStorageAt', link: '/docs/contract/getStorageAt' },
              { text: 'getStorageRoot', link: '/docs/contract/getStorageRoot' },
              { text: 'getSponsorInfo', link: '/docs/contract/getSponsorInfo' },
              {
                text: 'getContractEvents',
                link: '/docs/contract/getContractEvents',
              },
              {
                text: 'estimateContractGasAndCollateral',
                link: '/docs/contract/estimateContractGasAndCollateral',
              },
              { text: 'deployContract', link: '/docs/contract/deployContract' },
              {
                text: 'createContractEventFilter',
                link: '/docs/contract/createContractEventFilter',
              },
              {
                text: 'readContract',
                link: '/docs/contract/readContract',
              },
              {
                text: 'simulateContract',
                link: '/docs/contract/simulateContract',
              },
              {
                text: 'writeContract',
                link: '/docs/contract/writeContract',
              },
            ],
          },
          {
            text: 'Utilities',
            items: [
              {
                text: 'decodeDeployData',
                link: '/docs/contract/decodeDeployData',
              },
              {
                text: 'decodeEventLog',
                link: '/docs/contract/decodeEventLog',
              },
              {
                text: 'decodeFunctionData',
                link: '/docs/contract/decodeFunctionData',
              },
              {
                text: 'decodeFunctionResult',
                link: '/docs/contract/decodeFunctionResult',
              },
              {
                text: 'decodeDeployData',
                link: '/docs/contract/decodeDeployData',
              },
              {
                text: 'encodeDeployData',
                link: '/docs/contract/encodeDeployData',
              },
            ],
          },
        ],
      },
    ],
  },
  rootDir: '.',
})
