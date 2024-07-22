import { $ } from 'bun'

async function main() {
  await $`rm -rf ./src/types/abitype`
  await $`cp -rf ./src/node_modules/abitype/src/ ./src/types/abitype`
}

await main()
