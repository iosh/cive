import { BaseError } from "viem";

export type InvalidNetworkIdErrorType = InvalidNetworkIdError & {
  name: "InvalidNetworkIdError";
};

export class InvalidNetworkIdError extends BaseError {
  override name = "InvalidNetworkIdError";
  constructor({ networkId }: { networkId: number }) {
    super(`Invalid network id: ${networkId}.`);
  }
}

export type ConvertBitExcessPaddingErrorType = ConvertBitExcessPaddingError & {
  name: "ConvertBitExcessPaddingError";
};

export class ConvertBitExcessPaddingError extends BaseError {
  override name = "ConvertBitExcessPaddingError";
  constructor() {
    super(`Excess padding`);
  }
}

export type ConvertBitNonZeroPaddingErrorType =
  ConvertBitNonZeroPaddingError & {
    name: "ConvertBitNonZeroPaddingError";
  };

export class ConvertBitNonZeroPaddingError extends BaseError {
  override name = "ConvertBitNonZeroPaddingError";
  constructor() {
    super(`Non-zero padding`);
  }
}
