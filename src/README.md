# CIVE
Cive is an interface for the Conflux Core Space, built on Viem.


## Install

```bash
pnpm add cive
```


## Usage

```ts
// 1. Import modules
import { createPublicClient, http } from "cive";
import { mainnet } from "cive/chains";

// 2. Set up client
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// 3. consume an action
const block = await publicClient.getBlock();

```

## Docs

[Head to the documentation](https://cive.zyx.ee/) to read and learn more about cive.