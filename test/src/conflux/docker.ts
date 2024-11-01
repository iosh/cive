import { createServer, type CreateServerReturnType } from '@xcfx/node'
import { TEST_CHAIN_ID, TEST_EVM_CHAIN_ID, TEST_GENESIS_SECRETS } from '../constants.js'

export type NodeOptions = {
  httpPort: number
  wsPort: number
  udpAndTcpPort: number
}

export const DockerImageName = 'confluxchain/conflux-rust:2.4.0'

export let currentNode: CreateServerReturnType

export async function createNode({
  httpPort,
  wsPort,
  udpAndTcpPort,
}: NodeOptions) {
  const node = await createServer({
    nodeType: 'full',
    jsonrpcHttpPort: httpPort,
    jsonrpcWsPort: wsPort,
    chainId: TEST_CHAIN_ID,
    evmChainId: TEST_EVM_CHAIN_ID,
    devPackTxImmediately: false,
    genesisSecrets: TEST_GENESIS_SECRETS,
    tcpPort: udpAndTcpPort,
    udpPort: udpAndTcpPort,
  })

  await node.start()
  currentNode = node
}

export async function remove() {
  if (currentNode) {
    await currentNode.stop()
    currentNode = null
  }
}
