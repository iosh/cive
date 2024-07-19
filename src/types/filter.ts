import type { EIP1193RequestFn, Hash, Hex, LogTopic } from 'viem'
import type { Address } from '../accounts/types.js'
import type { EpochNumber, EpochTag } from './block.js'

import type { Abi } from '../types/abitype.js'
import type { MaybeExtractEventArgsFromAbi } from './contract.js'
import type { PublicRpcSchema } from './eip1193.js'
import type { Filter as Filter_ } from './utils.js'

export type LogFilter<TQuantity = bigint> = {
  fromBlock?: TQuantity
  toBlock?: TQuantity
  address?: Address | Address[]
  topics?: LogTopic[]
} & (
  | {
      fromEpoch?: EpochNumber<TQuantity> | EpochTag
      toEpoch?: EpochNumber<TQuantity> | EpochTag
      blockHashes?: never | undefined
    }
  | {
      fromEpoch?: never | undefined
      toEpoch?: never | undefined
      blockHashes?: Hash[]
    }
)

export type FilterType = 'transaction' | 'block' | 'event'
type FilterRpcSchema = Filter_<
  PublicRpcSchema,
  {
    Method: 'cfx_getFilterChanges' | 'cfx_getFilterLogs' | 'cfx_uninstallFilter'
  }
>

export type Filter<
  TFilterType extends FilterType = 'event',
  TAbi extends Abi | readonly unknown[] | undefined = undefined,
  TEventName extends string | undefined = undefined,
  TArgs extends
    | MaybeExtractEventArgsFromAbi<TAbi, TEventName>
    | undefined = MaybeExtractEventArgsFromAbi<TAbi, TEventName>,
  TStrict extends boolean | undefined = undefined,
  TFromEpoch extends EpochNumber | EpochTag | undefined = undefined,
  TToEpoch extends EpochNumber | EpochTag | undefined = undefined,
> = {
  id: Hex
  request: EIP1193RequestFn<FilterRpcSchema>
  type: TFilterType
} & (TFilterType extends 'event'
  ? {
      fromEpoch?: TFromEpoch | undefined
      toEpoch?: TToEpoch | undefined
    } & (TAbi extends Abi
      ? undefined extends TEventName
        ? {
            abi: TAbi
            args?: never | undefined
            eventName?: never | undefined
            strict: TStrict
          }
        : TArgs extends MaybeExtractEventArgsFromAbi<TAbi, TEventName>
          ? {
              abi: TAbi
              args: TArgs
              eventName: TEventName
              strict: TStrict
            }
          : {
              abi: TAbi
              args?: never | undefined
              eventName: TEventName
              strict: TStrict
            }
      : {
          abi?: never | undefined
          args?: never | undefined
          eventName?: never | undefined
          strict?: never | undefined
        })
  : {})
