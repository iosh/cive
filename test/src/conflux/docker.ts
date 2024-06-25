import Docker from "dockerode";
import path from "path";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

export type NodeOptions = {
  httpPort: number;
  wsPort: number;
};

export const DockerImageName = "confluxchain/conflux-rust:2.3.5";

export let currentNode: Docker.Container | null = null;

export async function createNode() {
  const node = await docker.createContainer({
    Image: DockerImageName,
    name: `cfx-node`,
    HostConfig: {
      NetworkMode: "host",
      Binds: [
        `${path.join(path.resolve(), "./conflux.toml")}:/root/run/conflux.toml`,
        `${path.join(
          path.resolve(),
          "./genesis_secrets.txt"
        )}:/root/run/genesis_secret.txt`,
      ],
    },
  });
  await node.start()
  currentNode = node;
}

export async function remove() {
  console.log("has current node", currentNode);
  if (currentNode) {
    await currentNode.stop();
    await currentNode.remove();
    currentNode = null
  }
}

export async function recreateNode() {
  console.log("try remove");
  await remove();
  console.log("try create");
  await createNode();
}
