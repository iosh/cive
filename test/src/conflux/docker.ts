import path from 'node:path'
import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export type NodeOptions = {
  httpPort: number
  wsPort: number
}

export const DockerImageName = 'confluxchain/conflux-rust:2.4.0'

export let currentNode: Docker.Container | null = null

export async function createNode({ httpPort, wsPort }: NodeOptions) {
  const node = await docker.createContainer({
    Image: DockerImageName,
    name: `cfx-node-${httpPort}-${wsPort}`,
    HostConfig: {
      Binds: [
        `${path.join(
          path.resolve(),
          './test/src/conflux/conflux.toml',
        )}:/root/run/conflux.toml`,
        `${path.join(
          path.resolve(),
          './test/src/conflux/genesis_secrets.txt',
        )}:/root/run/genesis_secrets.txt`,
        `${path.join(
          path.resolve(),
          './test/src/conflux/initial_nodes.json',
        )}:/root/run/initial_nodes.json`,
        `${path.join(
          path.resolve(),
          './test/src/conflux/pos_config.yaml',
        )}:/root/run/pos_config/pos_config.yaml`,
        `${path.join(
          path.resolve(),
          './test/src/conflux/genesis_file',
        )}:/root/run/pos_config/genesis_file`,
      ],
      PortBindings: {
        '12537/tcp': [{ HostPort: `${httpPort}` }],
        '12535/tcp': [{ HostPort: `${wsPort}` }],
      },
    },
  })
  await node.start()
  currentNode = node
}

export async function remove() {
  if (currentNode) {
    await currentNode.remove({ force: true })
    currentNode = null
  }
}
