import { $ } from 'bun'

async function main() {
  await $`cp -rf ./src/node_modules/abitype/src/ ./src/types/abitype`
  await $`sed -i 's/export interface Register {/import type { Address } from \"..\/..\/accounts\/types.js\"\
export interface Register {\
  addressType: Address'/g ./src/types/abitype/register.ts`
}

await main()
