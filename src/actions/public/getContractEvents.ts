import type { Transport } from 'viem'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Abi, Address } from '../../types/abitype.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type {
  ContractEventArgs,
  ContractEventName,
} from '../../types/contract.js'
import type { Log } from '../../types/log.js'
import type { Hash } from '../../types/misc.js'
import { getAction } from '../../utils/getAction.js'
import {
  type GetAbiItemErrorType,
  type GetAbiItemParameters,
  getAbiItem,
} from '../../utils/index.js'
import {
  type GetLogsErrorType,
  type GetLogsParameters,
  getLogs,
} from './getLogs.js'

export type GetContractEventsParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> | undefined =
    | ContractEventName<abi>
    | undefined,
  strict extends boolean | undefined = undefined,
> = {
  /** The address of the contract. */
  address?: Address | Address[] | undefined
  /** Contract ABI. */
  abi: abi
  args?:
    | ContractEventArgs<
        abi,
        eventName extends ContractEventName<abi>
          ? eventName
          : ContractEventName<abi>
      >
    | undefined
  /** Contract event. */
  eventName?: eventName | ContractEventName<abi> | undefined
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict | boolean | undefined
} & (
  | {
      /**
       * @default latest_checkpoint
       */
      fromEpoch?:
        | EpochNumber
        | Exclude<EpochTag, 'latest_finalized' | 'latest_mined'>
      /**
       * @default latest_state
       */
      toEpoch?:
        | EpochNumber
        | Exclude<EpochTag, 'latest_finalized' | 'latest_mined'>

      toBlock?: never | undefined

      fromBlock?: never | undefined

      blockHashes?: never | undefined
    }
  | {
      fromEpoch?: never | undefined

      toEpoch?: never | undefined

      toBlock: EpochNumber

      fromBlock: EpochNumber

      blockHashes?: never | undefined
    }
  | {
      fromEpoch?: never | undefined

      toEpoch?: never | undefined

      toBlock?: never | undefined

      fromBlock?: never | undefined

      blockHashes: Hash[]
    }
)

export type GetContractEventsReturnType<
  abi extends Abi | readonly unknown[] = readonly unknown[],
  eventName extends ContractEventName<abi> | undefined =
    | ContractEventName<abi>
    | undefined,
  strict extends boolean | undefined = undefined,
> = Log<bigint, number, undefined, strict, abi, eventName>[]

export type GetContractEventsErrorType =
  | GetAbiItemErrorType
  | GetLogsErrorType
  | ErrorType

export async function getContractEvents<
  chain extends Chain | undefined,
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi> | undefined = undefined,
  strict extends boolean | undefined = undefined,
>(
  client: Client<Transport, chain>,
  parameters: GetContractEventsParameters<abi, eventName, strict>,
): Promise<GetContractEventsReturnType<abi, eventName, strict>> {
  const {
    abi,
    address,
    args,
    blockHashes,
    eventName,
    fromBlock,
    toBlock,
    strict,
  } = parameters
  const event = eventName
    ? getAbiItem({ abi, name: eventName } as GetAbiItemParameters)
    : undefined
  const events = !event
    ? (abi as Abi).filter((x) => x.type === 'event')
    : undefined
  return getAction(
    client,
    getLogs,
    'getLogs',
  )({
    address,
    args,
    blockHashes,
    event,
    events,
    fromBlock,
    toBlock,
    strict,
  } as {} as GetLogsParameters) as unknown as GetContractEventsReturnType<
    abi,
    eventName,
    strict
  >
}
