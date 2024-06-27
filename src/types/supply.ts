export type Supply<TQuantity = BigInt> = {
  totalIssued: TQuantity
  totalCollateral: TQuantity
  totalStaking: TQuantity
  totalCirculating: TQuantity
  totalEspaceTokens: TQuantity
}
