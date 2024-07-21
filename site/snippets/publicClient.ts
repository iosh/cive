// [!region imports]
import { http, createPublicClient } from 'cive'
import { mainnet } from 'cive/chains'
// [!endregion imports]

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})
