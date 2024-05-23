export type Deposit<TQuantity = bigint, TIndex = number> = {
  accumulatedInterestRate: TQuantity
  amount: TQuantity
  depositTime: TIndex
};
