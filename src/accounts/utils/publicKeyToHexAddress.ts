import { type Hex, keccak256 } from 'viem'
import type { HexAddress } from '../types.js'

export function publicKeyToHexAddress(publicKey: Hex): HexAddress {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26)
  return `0x1${address.substring(1)}`
}
