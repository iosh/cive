import type { Address } from '../accounts/types.ts'

declare module 'viem/node_modules/abitype' {
  export interface Register {
    addressType: Address
  }
}
declare module 'abitype' {
  export interface Register {
    addressType: Address
  }
}
