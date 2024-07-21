// [!region imports]
import { http, createWalletClient } from 'cive'
import { mainnet } from 'cive/chains'
// [!endregion imports]

export const publicClient = createWalletClient({
  chain: mainnet,
  transport: http(),
})
