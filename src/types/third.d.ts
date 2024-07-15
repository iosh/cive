declare module '@conflux-dev/conflux-address-js/lib/cip37/base32.js' {
  export function polyMod(bytes: Uint8Array): Uint8Array
  export function convertBit(
    buffer: Uint8Array,
    inBits: number,
    outBits: number,
    isPad?: boolean,
  ): number[]
}
