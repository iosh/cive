import { BaseError } from 'viem'

export type InvalidNetworkIdErrorType = InvalidNetworkIdError & {
  name: 'InvalidNetworkIdError'
}

export class InvalidNetworkIdError extends BaseError {
  override name = 'InvalidNetworkIdError'
  constructor({
    networkId,
    message,
  }: {
    networkId: number | string
    message?: string
  }) {
    super(`Invalid network id: ${networkId}. ${message || ''}`)
  }
}

export type ConvertBitExcessPaddingErrorType = ConvertBitExcessPaddingError & {
  name: 'ConvertBitExcessPaddingError'
}

export class ConvertBitExcessPaddingError extends BaseError {
  override name = 'ConvertBitExcessPaddingError'
  constructor() {
    super(`Excess padding`)
  }
}

export type ConvertBitNonZeroPaddingErrorType =
  ConvertBitNonZeroPaddingError & {
    name: 'ConvertBitNonZeroPaddingError'
  }

export class ConvertBitNonZeroPaddingError extends BaseError {
  override name = 'ConvertBitNonZeroPaddingError'
  constructor() {
    super(`Non-zero padding`)
  }
}

export type MixedCaseAddressErrorType = MixedCaseAddressError & {
  name: 'MixedCaseAddressError'
}

export class MixedCaseAddressError extends BaseError {
  override name = 'MixedCaseAddressError'
  constructor({ address }: { address: string }) {
    super(`Mixed case address ${address}`)
  }
}

export type InvalidAddressVersionErrorType = InvalidAddressVersionError & {
  name: 'InvalidAddressVersionError'
}

export class InvalidAddressVersionError extends BaseError {
  override name = 'InvalidAddressVersionError'
  constructor({ address }: { address: string }) {
    super(`Invalid address version ${address}`)
  }
}

export type AddressTypeNotMatchErrorType = AddressTypeNotMatchError & {
  name: 'AddressTypeNotMatchError'
}

export class AddressTypeNotMatchError extends BaseError {
  override name = 'AddressTypeNotMatchError'
  constructor({ address }: { address: string }) {
    super(`Address type not match ${address}`)
  }
}
