import { BaseError, type Chain } from 'viem'

export type ChainDoesNotSupportContractErrorType =
  ChainDoesNotSupportContract & {
    name: 'ChainDoesNotSupportContract'
  }
export class ChainDoesNotSupportContract extends BaseError {
  override name = 'ChainDoesNotSupportContract'
  constructor({
    blockNumber,
    chain,
    contract,
  }: {
    blockNumber?: bigint | undefined
    chain: Chain
    contract: { name: string; blockCreated?: number | undefined }
  }) {
    super(
      `Chain "${chain.name}" does not support contract "${contract.name}".`,
      {
        metaMessages: [
          'This could be due to any of the following:',
          ...(blockNumber &&
          contract.blockCreated &&
          contract.blockCreated > blockNumber
            ? [
                `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`,
              ]
            : [
                `- The chain does not have the contract "${contract.name}" configured.`,
              ]),
        ],
      },
    )
  }
}

export type ChainMismatchErrorType = ChainMismatchError & {
  name: 'ChainMismatchError'
}
export class ChainMismatchError extends BaseError {
  override name = 'ChainMismatchError'

  constructor({
    chain,
    currentChainId,
  }: {
    chain: Chain
    currentChainId: number
  }) {
    super(
      `The current chain of the wallet (id: ${currentChainId}) does not match the target chain for the transaction (id: ${chain.id} – ${chain.name}).`,
      {
        metaMessages: [
          `Current Chain ID:  ${currentChainId}`,
          `Expected Chain ID: ${chain.id} – ${chain.name}`,
        ],
      },
    )
  }
}

export type ChainNotFoundErrorType = ChainNotFoundError & {
  name: 'ChainNotFoundError'
}
export class ChainNotFoundError extends BaseError {
  override name = 'ChainNotFoundError'

  constructor() {
    super(
      [
        'No chain was provided to the request.',
        'Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient.',
      ].join('\n'),
    )
  }
}

export type ClientChainNotConfiguredErrorType =
  ClientChainNotConfiguredError & {
    name: 'ClientChainNotConfiguredError'
  }
export class ClientChainNotConfiguredError extends BaseError {
  override name = 'ClientChainNotConfiguredError'

  constructor() {
    super('No chain was provided to the Client.')
  }
}

export type InvalidChainIdErrorType = InvalidChainIdError & {
  name: 'InvalidChainIdError'
}
export class InvalidChainIdError extends BaseError {
  override name = 'InvalidChainIdError'

  constructor({ chainId }: { chainId?: number | string | undefined }) {
    super(
      typeof chainId === 'number' || typeof chainId === 'string'
        ? `Chain ID "${chainId}" is invalid.`
        : 'Chain ID is invalid.',
    )
  }
}

export type InvalidChainNameErrorType = InvalidChainNameError & {
  name: 'InvalidChainNameError'
}
export class InvalidChainNameError extends BaseError {
  override name = 'InvalidChainNameError'
  constructor({ chainName }: { chainName?: string | undefined }) {
    super(
      typeof chainName === 'string'
        ? `Chain name "${chainName}" is invalid.should be passed by 'cfx', 'cfxtest' or 'net[n], net1 or net1029 are invalid`
        : 'Chain name is invalid.',
    )
  }
}
