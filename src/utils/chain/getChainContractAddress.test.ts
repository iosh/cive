import { expect, test } from 'vitest'

import { mainnet, testnet } from '../../chains/index.js'

import { getChainContractAddress } from './getChainContractAddress.js'

test('default', () => {
  expect(
    getChainContractAddress({ chain: mainnet, contract: 'multicall3' }),
  ).toBe('cfx:acevn2d3dr6vh4jca28c6cmvkktsg7r8n25vp9hnmw')

  expect(
    getChainContractAddress({ chain: testnet, contract: 'multicall3' }),
  ).toBe('cfxtest:acay1u1fj9bz93334efs447tx1x6y5p61a944zyy47')
})
