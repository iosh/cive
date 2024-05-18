import type { Address } from "abitype";

export type Sponsor<TQuantity = bigint> = {
  sponsorBalanceForCollateral: TQuantity;
  sponsorBalanceForGas: TQuantity;
  sponsorGasBound: TQuantity;
  sponsorForCollateral: Address;
  sponsorForGas: Address;
  usedStoragePoints: TQuantity;
  availableStoragePoints: TQuantity;
};
