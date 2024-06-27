export type Vote<TQuantity = bigint, TIndex = number> = {
  amount: TQuantity
  unlockBlockNumber: TIndex
}
