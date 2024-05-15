import { BaseError, type Hash } from "viem"

export type BlockNotFoundErrorType = BlockNotFoundError & {
  name: 'BlockNotFoundError'
}
export class BlockNotFoundError extends BaseError {
  override name = 'BlockNotFoundError'
  constructor({
    blockHash,
    epochNumber,
  }: {
    blockHash?: Hash | undefined
    epochNumber?: bigint | undefined
  }) {
    let identifier = 'Block'
    if (blockHash) identifier = `Block at hash "${blockHash}"`
    if (epochNumber) identifier = `Epoch at number "${epochNumber}"`
    super(`${identifier} could not be found.`)
  }
}
