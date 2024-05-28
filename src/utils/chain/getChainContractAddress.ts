import {
  Chain,
  ChainContract,
  ChainDoesNotSupportContract,
  ChainDoesNotSupportContractErrorType,
} from "viem";

export type GetChainContractAddressErrorType =
  ChainDoesNotSupportContractErrorType;

export function getChainContractAddress({
  blockNumber,
  chain,
  contract: name,
}: {
  blockNumber?: bigint | undefined;
  chain: Chain;
  contract: string;
}) {
  const contract = (chain?.contracts as Record<string, ChainContract>)?.[name];
  if (!contract)
    throw new ChainDoesNotSupportContract({
      chain,
      contract: { name },
    });

  if (
    blockNumber &&
    contract.blockCreated &&
    contract.blockCreated > blockNumber
  )
    throw new ChainDoesNotSupportContract({
      blockNumber,
      chain,
      contract: {
        name,
        blockCreated: contract.blockCreated,
      },
    });

  return contract.address;
}
