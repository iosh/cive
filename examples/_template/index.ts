import { http, createPublicClient } from 'cive'
import { mainnet } from 'cive/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const epochNumber = await client.getEpochNumber()

export default [`epoch number: ${epochNumber}`]
