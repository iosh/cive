import { BaseError, type Hash } from "viem";

export type BlockNotFoundErrorType = BlockNotFoundError & {
  name: "BlockNotFoundError";
};
export class BlockNotFoundError extends BaseError {
  override name = "BlockNotFoundError";
  constructor({
    blockHash,
    epochNumber,
    blockNumber,
  }: {
    blockHash?: Hash | undefined;
    epochNumber?: bigint | undefined;
    blockNumber?: bigint | undefined;
  }) {
    let identifier = "Block";
    if (blockHash) identifier = `Block at hash "${blockHash}"`;
    if (epochNumber || blockNumber)
      identifier = `Epoch at number "${epochNumber || blockNumber}"`;
    super(`${identifier} could not be found.`);
  }
}
