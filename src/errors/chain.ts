import { BaseError } from 'viem'

export type ChainNotFoundErrorType = ChainIdNotFoundError & {
  name: 'ChainIdNotFoundError'
}
export class ChainIdNotFoundError extends BaseError {
  override name = 'ChainIdNotFoundError'
  constructor() {
    super('Chain id is not found.')
  }
}
