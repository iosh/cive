import type { RpcSponsor } from "../../types/rpc";
import type { Sponsor } from "../../types/sponsor";

export function formatSponsor(sponsor: RpcSponsor): Sponsor {
  const data = {
    ...sponsor,
    sponsorBalanceForCollateral: BigInt(sponsor.sponsorBalanceForCollateral),
    sponsorBalanceForGas: BigInt(sponsor.sponsorBalanceForGas),
    sponsorGasBound: BigInt(sponsor.sponsorGasBound),
    usedStoragePoints: BigInt(sponsor.usedStoragePoints),
    availableStoragePoints: BigInt(sponsor.availableStoragePoints),
  };

  return data;
}