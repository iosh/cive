import { BaseError } from 'viem'
import { formatAbiItem } from 'viem/utils'
import type { Abi } from '../types/abitype.js'
export type AbiItemAmbiguityErrorType = AbiItemAmbiguityError & {
  name: 'AbiItemAmbiguityError'
}

export class AbiItemAmbiguityError extends BaseError {
  override name = 'AbiItemAmbiguityError'
  constructor(
    x: { abiItem: Abi[number]; type: string },
    y: { abiItem: Abi[number]; type: string },
  ) {
    super('Found ambiguous types in overloaded ABI items.', {
      metaMessages: [
        `\`${x.type}\` in \`${formatAbiItem(x.abiItem)}\`, and`,
        `\`${y.type}\` in \`${formatAbiItem(y.abiItem)}\``,
        '',
        'These types encode differently and cannot be distinguished at runtime.',
        'Remove one of the ambiguous items in the ABI.',
      ],
    })
  }
}
