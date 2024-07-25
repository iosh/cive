import 'cive/window'

// ---cut---
// [!region imports]
import { createWalletClient, custom } from 'cive'
import { mainnet } from 'cive/chains'
// [!endregion imports]

export const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.fluent!),
})
