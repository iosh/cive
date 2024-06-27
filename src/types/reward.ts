import type { Hash } from 'viem'
import type { Address } from '../accounts/types.js'

export type Reward<TQuantity = bigint, TIndex = number> = {
  blockHash: Hash
  author: Address
  totalReward: TQuantity
  baseReward: TQuantity
  txFee: TIndex
}
