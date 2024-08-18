import type {
  GetAddressErrorType,
  Keccak256ErrorType,
  ToBytesErrorType,
  ToRlpErrorType,
} from 'viem'
import { encodePacked, isHex, keccak256, toBytes, toHex } from 'viem/utils'
import type { Address, HexAddress } from '../../accounts/types.js'
import { create2FactoryAddress } from '../../constants/contract.js'
import type { ErrorType } from '../../errors/utils.js'
import type { ByteArray, Hex } from '../../types/misc.js'
import { base32AddressToHex } from './base32AddressToHex.js'
import { hexAddressToBase32 } from './hexAddressToBase32.js'

// https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-31.md
export type GetCreateAddressOptions = {
  from: Address
  nonce: number
} & (
  | { bytecode: ByteArray | Hex }
  | {
      bytecodeHash: ByteArray | Hex
    }
)

export type GetCreate2AddressOptions = {
  salt: bigint
  /**
   * @description the address of the create2Factory contract
   * @default "0x8a3a92281df6497105513b18543fd3b60c778e40" - CIP-31 deployed in genesis block
   */
  create2FactoryAddress?: Address<undefined, 'contract'> | HexAddress
} & (
  | {
      bytecode: ByteArray | Hex
    }
  | {
      bytecodeHash: ByteArray | Hex
    }
)

export type GetContractAddressOptions<
  NetworkId extends number = number,
  Verbose extends boolean = boolean,
> = {
  networkId: NetworkId extends undefined ? number : NetworkId
  verbose?: Verbose
} & (
  | ({
      opcode?: 'CREATE' | undefined
    } & GetCreateAddressOptions)
  | ({ opcode: 'CREATE2' } & GetCreate2AddressOptions)
)
export type GetCreateAddressErrorType =
  | Keccak256ErrorType
  | GetAddressErrorType
  | ToBytesErrorType
  | ToRlpErrorType
  | ErrorType

export function getContractAddress<
  NetworkId extends number = number,
  Verbose extends boolean = boolean,
>(opts: GetContractAddressOptions<NetworkId, Verbose>) {
  const bytecodeHash = (() => {
    if ('bytecodeHash' in opts) {
      if (isHex(opts.bytecodeHash)) return opts.bytecodeHash
      return toHex(opts.bytecodeHash)
    }

    return keccak256(
      encodePacked(
        ['bytes'],
        [isHex(opts.bytecode) ? opts.bytecode : toHex(opts.bytecode)],
      ),
      'hex',
    )
  })()

  const hexAddress = (() => {
    if (opts.opcode === 'CREATE2') {
      const create2Address = opts.create2FactoryAddress || create2FactoryAddress
      if (isHex(create2Address)) return create2Address

      return base32AddressToHex({ address: create2Address })
    }
    return base32AddressToHex({ address: opts.from })
  })()

  const addressHash = keccak256(
    encodePacked(
      ['bytes1', 'address', 'bytes32', 'bytes32'],
      [
        opts.opcode === 'CREATE2' ? '0xff' : '0x00',
        hexAddress,
        opts.opcode === 'CREATE2'
          ? toHex(opts.salt, { size: 32 })
          : toHex(toBytes(opts.nonce).reverse(), { size: 32 }),
        bytecodeHash,
      ],
    ),
  )

  return hexAddressToBase32<
    typeof opts.networkId,
    'contract',
    typeof opts.verbose
  >({
    hexAddress: `0x8${addressHash.slice(-39)}`,
    networkId: opts.networkId,
    verbose: opts.verbose,
  })
}
