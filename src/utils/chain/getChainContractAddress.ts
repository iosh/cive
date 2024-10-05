import type { Chain, ChainContract } from '../../types/chain.js'
import {
  ChainDoesNotSupportContract,
  type ChainDoesNotSupportContractErrorType,
} from '../errors/chain.js'

export type GetChainContractAddressErrorType =
  ChainDoesNotSupportContractErrorType

export function getChainContractAddress({
  epochNumber,
  chain,
  contract: name,
}: {
  epochNumber?: bigint | undefined
  chain: Chain
  contract: string
}) {
  const contract = (chain?.contracts as Record<string, ChainContract>)?.[name]
  if (!contract)
    throw new ChainDoesNotSupportContract({
      chain,
      contract: { name },
    })

  if (
    epochNumber &&
    contract.epochCreated &&
    contract.epochCreated > epochNumber
  )
    throw new ChainDoesNotSupportContract({
      epochNumber,
      chain,
      contract: {
        name,
        blockCreated: contract.epochCreated,
      },
    })

  return contract.address
}
