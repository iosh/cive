import type { WatchContractEventParameters } from 'viem'
import type { Account } from '../accounts/types.js'
import type { Client } from '../clients/createClient.js'
import type {
  Abi,
  AbiEvent,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  Address,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from '../types/abitype.js'
import type { Chain } from '../types/chain.js'
import type {
  AbiEventParametersToPrimitiveTypes,
  ContractEventName,
  ContractFunctionArgs,
  ContractFunctionName,
  MaybeExtractEventArgsFromAbi,
} from '../types/contract.js'
import type {
  IsNarrowable,
  IsNever,
  IsUndefined,
  Or,
  Prettify,
  UnionOmit,
} from '../types/utils.js'

import type { Transport } from '../clients/transports/createTransport.js'
import type { ErrorType } from '../errors/utils.js'
import { getAction } from '../utils/getAction.js'
import {
  type CreateContractEventFilterParameters,
  type CreateContractEventFilterReturnType,
  createContractEventFilter,
} from './public/createContractEventFilter.js'
import {
  type EstimateContractGasAndCollateralParameters,
  type EstimateContractGasAndCollateralReturnType,
  estimateContractGasAndCollateral,
} from './public/estimateContractGasAndCollateral.js'
import {
  type GetContractEventsParameters,
  type GetContractEventsReturnType,
  getContractEvents,
} from './public/getContractEvents.js'
import {
  type ReadContractParameters,
  type ReadContractReturnType,
  readContract,
} from './public/readContract.js'
import {
  type SimulateContractParameters,
  type SimulateContractReturnType,
  simulateContract,
} from './public/simulateContract.js'
import {
  type WriteContractParameters,
  type WriteContractReturnType,
  writeContract,
} from './wallet/writeContract.js'

type KeyedClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> =
  | {
      public?: Client<transport, chain> | undefined
      wallet: Client<transport, chain, account>
    }
  | {
      public: Client<transport, chain>
      wallet?: Client<transport, chain, account> | undefined
    }

export type GetContractParameters<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  abi extends Abi | readonly unknown[] = Abi,
  client extends
    | Client<transport, chain, account>
    | KeyedClient<transport, chain, account> =
    | Client<transport, chain, account>
    | KeyedClient<transport, chain, account>,
  address extends Address = Address,
> = {
  /** Contract ABI */
  abi: abi
  /** Contract address */
  address: address
  /** The Client.
   *
   * If you pass in a [`publicClient`](https://cive.zyx.ee/docs/clients/public), the following methods are available:
   *
   * - [`createEventFilter`](https://cive.zyx.ee/docs/actions/public/createEventFilter#createeventfilter)
   * - [`estimateGasAndCollateral`](https://cive.zyx.ee/docs/actions/public/estimateContractGasAndCollateral#estimateContractGasAndCollateral)
   * - [`getEvents`](https://cive.zyx.ee/docs/contract/getContractEvents)
   * - [`read`](http://localhost:5173/docs/contract/readContract#readcontract)
   * - [`simulate`](http://localhost:5173/docs/contract/simulateContract#simulatecontract)
   * - [`watchEvent`](TODO)
   *
   * If you pass in a [`walletClient`](https://viem.sh/docs/clients/wallet), the following methods are available:
   *
   * - [`estimateGasAndCollateral`](https://cive.zyx.ee/docs/actions/public/estimateContractGasAndCollateral#estimateContractGasAndCollateral)
   * - [`write`](http://localhost:5173/docs/contract/writeContract#writecontract)
   */
  client: client
}

export type GetContractReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  client extends Client | KeyedClient = Client | KeyedClient,
  address extends Address = Address,
  //
  _eventNames extends string = abi extends Abi
    ? Abi extends abi
      ? string
      : ExtractAbiEventNames<abi>
    : string,
  _readFunctionNames extends string = abi extends Abi
    ? Abi extends abi
      ? string
      : ExtractAbiFunctionNames<abi, 'pure' | 'view'>
    : string,
  _writeFunctionNames extends string = abi extends Abi
    ? Abi extends abi
      ? string
      : ExtractAbiFunctionNames<abi, 'nonpayable' | 'payable'>
    : string,
  _narrowable extends boolean = IsNarrowable<abi, Abi>,
  _publicClient extends Client | unknown = client extends {
    public: Client
  }
    ? client['public']
    : client,
  _walletClient extends Client | unknown = client extends {
    wallet: Client
  }
    ? client['wallet']
    : client,
> = Prettify<
  Prettify<
    (_publicClient extends Client
      ? (IsNever<_readFunctionNames> extends true
          ? unknown
          : {
              read: {
                [functionName in _readFunctionNames]: GetReadFunction<
                  _narrowable,
                  abi,
                  functionName extends ContractFunctionName<
                    abi,
                    'pure' | 'view'
                  >
                    ? functionName
                    : never
                >
              }
            }) &
          (IsNever<_writeFunctionNames> extends true
            ? unknown
            : {
                estimateGasAndCollateral: {
                  [functionName in _writeFunctionNames]: GetEstimateGasAndCollateral<
                    _narrowable,
                    _publicClient['chain'],
                    undefined,
                    abi,
                    functionName extends ContractFunctionName<
                      abi,
                      'nonpayable' | 'payable'
                    >
                      ? functionName
                      : never
                  >
                }

                simulate: {
                  [functionName in _writeFunctionNames]: GetSimulateFunction<
                    _narrowable,
                    _publicClient['chain'],
                    _walletClient extends Client
                      ? _walletClient['account']
                      : _publicClient['account'],
                    abi,
                    functionName extends ContractFunctionName<
                      abi,
                      'nonpayable' | 'payable'
                    >
                      ? functionName
                      : never
                  >
                }
              }) &
          (IsNever<_eventNames> extends true
            ? unknown
            : {
                createEventFilter: {
                  [EventName in _eventNames]: GetEventFilter<
                    _narrowable,
                    abi,
                    EventName extends ContractEventName<abi> ? EventName : never
                  >
                }

                getEvents: {
                  [EventName in _eventNames]: GetEventsFunction<
                    _narrowable,
                    abi,
                    EventName extends ContractEventName<abi> ? EventName : never
                  >
                }

                // watchEvent: {
                //   [EventName in _eventNames]: GetWatchEvent<
                //     _narrowable,
                //     abi,
                //     EventName extends ContractEventName<abi> ? EventName : never
                //   >
                // }
              })
      : unknown) &
      (_walletClient extends Client
        ? IsNever<_writeFunctionNames> extends true
          ? unknown
          : {
              estimateGasAndCollateral: {
                [functionName in _writeFunctionNames]: GetEstimateGasAndCollateral<
                  _narrowable,
                  _walletClient['chain'],
                  _walletClient['account'],
                  abi,
                  functionName extends ContractFunctionName<
                    abi,
                    'nonpayable' | 'payable'
                  >
                    ? functionName
                    : never
                >
              }

              write: {
                [functionName in _writeFunctionNames]: GetWriteFunction<
                  _narrowable,
                  _walletClient['chain'],
                  _walletClient['account'],
                  abi,
                  functionName extends ContractFunctionName<
                    abi,
                    'nonpayable' | 'payable'
                  >
                    ? functionName
                    : never
                >
              }
            }
        : unknown)
  > & { address: address; abi: abi }
>

export type GetContractErrorType = ErrorType

export function getContract<
  transport extends Transport,
  address extends Address,
  const abi extends Abi | readonly unknown[],
  const client extends
    | Client<transport, chain, account>
    | KeyedClient<transport, chain, account>,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
>({
  abi,
  address,
  client: client_,
}: GetContractParameters<
  transport,
  chain,
  account,
  abi,
  client,
  address
>): GetContractReturnType<abi, client, address> {
  const client = client_ as
    | Client<transport, chain, account>
    | KeyedClient<transport, chain, account>

  const [publicClient, walletClient] = (() => {
    if (!client) return [undefined, undefined]
    if ('public' in client && 'wallet' in client)
      return [client.public as Client, client.wallet as Client]
    if ('public' in client) return [client.public as Client, undefined]
    if ('wallet' in client) return [undefined, client.wallet as Client]
    return [client, client]
  })()

  const hasPublicClient = publicClient !== undefined && publicClient !== null
  const hasWalletClient = walletClient !== undefined && walletClient !== null

  const contract: {
    [_ in
      | 'abi'
      | 'address'
      | 'createEventFilter'
      | 'estimateGasAndCollateral'
      | 'getEvents'
      | 'read'
      | 'simulate'
      //   | 'watchEvent'
      | 'write']?: unknown
  } = {}

  let hasReadFunction = false
  let hasWriteFunction = false
  let hasEvent = false
  for (const item of abi as Abi) {
    if (item.type === 'function')
      if (item.stateMutability === 'view' || item.stateMutability === 'pure')
        hasReadFunction = true
      else hasWriteFunction = true
    else if (item.type === 'event') hasEvent = true
    // Exit early if all flags are `true`
    if (hasReadFunction && hasWriteFunction && hasEvent) break
  }
  if (hasPublicClient) {
    if (hasReadFunction)
      contract.read = new Proxy(
        {},
        {
          get(_, functionName: string) {
            return (
              ...parameters: [
                args?: readonly unknown[] | undefined,
                options?: UnionOmit<
                  ReadContractParameters,
                  'abi' | 'address' | 'functionName' | 'args'
                >,
              ]
            ) => {
              const { args, options } = getFunctionParameters(parameters)
              return getAction(
                publicClient,
                readContract,
                'readContract',
              )({
                abi,
                address,
                functionName,
                args,
                ...options,
              } as ReadContractParameters)
            }
          },
        },
      )

    if (hasWriteFunction)
      contract.simulate = new Proxy(
        {},
        {
          get(_, functionName: string) {
            return (
              ...parameters: [
                args?: readonly unknown[],
                options?: UnionOmit<
                  SimulateContractParameters,
                  'abi' | 'address' | 'functionName' | 'args'
                >,
              ]
            ) => {
              const { args, options } = getFunctionParameters(parameters)
              return getAction(
                publicClient,
                simulateContract,
                'simulateContract',
              )({
                abi,
                address,
                functionName,
                args,
                ...options,
              } as SimulateContractParameters)
            }
          },
        },
      )

    if (hasEvent) {
      contract.createEventFilter = new Proxy(
        {},
        {
          get(_, eventName: string) {
            return (
              ...parameters: [
                args?: readonly unknown[] | object,
                options?: Omit<
                  CreateContractEventFilterParameters,
                  'abi' | 'address' | 'eventName' | 'args'
                >,
              ]
            ) => {
              const abiEvent = (abi as readonly AbiEvent[]).find(
                (x: AbiEvent) => x.type === 'event' && x.name === eventName,
              )
              const { args, options } = getEventParameters(
                parameters,
                abiEvent!,
              )
              return getAction(
                publicClient,
                createContractEventFilter,
                'createContractEventFilter',
              )({
                abi,
                address,
                eventName,
                args,
                ...options,
              } as CreateContractEventFilterParameters)
            }
          },
        },
      )
      contract.getEvents = new Proxy(
        {},
        {
          get(_, eventName: string) {
            return (
              ...parameters: [
                args?: readonly unknown[] | object,
                options?: Omit<
                  GetContractEventsParameters,
                  'abi' | 'address' | 'eventName'
                >,
              ]
            ) => {
              const abiEvent = (abi as readonly AbiEvent[]).find(
                (x: AbiEvent) => x.type === 'event' && x.name === eventName,
              )
              const { args, options } = getEventParameters(
                parameters,
                abiEvent!,
              )
              return getAction(
                publicClient,
                getContractEvents,
                'getContractEvents',
              )({
                abi,
                address,
                eventName,
                args,
                ...options,
              } as unknown as GetContractEventsParameters)
            }
          },
        },
      )
      //   contract.watchEvent = new Proxy(
      //     {},
      //     {
      //       get(_, eventName: string) {
      //         return (
      //           ...parameters: [
      //             args?: readonly unknown[] | object,
      //             options?: Omit<
      //               WatchContractEventParameters,
      //               'abi' | 'address' | 'eventName'
      //             >,
      //           ]
      //         ) => {
      //           const abiEvent = (abi as readonly AbiEvent[]).find(
      //             (x: AbiEvent) => x.type === 'event' && x.name === eventName,
      //           )
      //           const { args, options } = getEventParameters(
      //             parameters,
      //             abiEvent!,
      //           )
      //           return getAction(
      //             publicClient,
      //             watchContractEvent,
      //             'watchContractEvent',
      //           )({
      //             abi,
      //             address,
      //             eventName,
      //             args,
      //             ...options,
      //           } as unknown as WatchContractEventParameters)
      //         }
      //       },
      //     },
      //   )
    }
  }

  if (hasWalletClient) {
    if (hasWriteFunction)
      contract.write = new Proxy(
        {},
        {
          get(_, functionName: string) {
            return (
              ...parameters: [
                args?: readonly unknown[],
                options?: UnionOmit<
                  WriteContractParameters,
                  'abi' | 'address' | 'functionName' | 'args'
                >,
              ]
            ) => {
              const { args, options } = getFunctionParameters(parameters)
              return getAction(
                walletClient,
                writeContract,
                'writeContract',
              )({
                abi,
                address,
                functionName,
                args,
                ...(options as any),
              })
            }
          },
        },
      )
  }

  if (hasPublicClient || hasWalletClient)
    if (hasWriteFunction)
      contract.estimateGasAndCollateral = new Proxy(
        {},
        {
          get(_, functionName: string) {
            return (
              ...parameters: [
                args?: readonly unknown[],
                options?: UnionOmit<
                  EstimateContractGasAndCollateralParameters,
                  'abi' | 'address' | 'functionName' | 'args'
                >,
              ]
            ) => {
              const { args, options } = getFunctionParameters(parameters)
              const client = (publicClient ?? walletClient)!
              return getAction(
                client,
                estimateContractGasAndCollateral,
                'estimateContractGasAndCollateral',
              )({
                abi,
                address,
                functionName,
                args,
                ...options,
                account:
                  (options as EstimateContractGasAndCollateralParameters)
                    .account ?? (walletClient as unknown as Client).account,
              } as any)
            }
          },
        },
      )
  contract.address = address
  contract.abi = abi

  return contract as unknown as GetContractReturnType<abi, client, address>
}

/**
 * @internal exporting for testing only
 */
export function getFunctionParameters(
  values: [args?: readonly unknown[] | undefined, options?: object | undefined],
) {
  const hasArgs = values.length && Array.isArray(values[0])
  const args = hasArgs ? values[0]! : []
  const options = (hasArgs ? values[1] : values[0]) ?? {}
  return { args, options }
}

/**
 * @internal exporting for testing only
 */
export function getEventParameters(
  values: [args?: object | unknown[], options?: object],
  abiEvent: AbiEvent,
) {
  let hasArgs = false
  // If first item is array, must be `args`
  if (Array.isArray(values[0])) hasArgs = true
  // Check if first item is `args` or `options`
  else if (values.length === 1) {
    // if event has indexed inputs, must have `args`
    hasArgs = abiEvent.inputs.some((x) => x.indexed)
    // If there are two items in array, must have `args`
  } else if (values.length === 2) {
    hasArgs = true
  }

  const args = hasArgs ? values[0]! : undefined
  const options = (hasArgs ? values[1] : values[0]) ?? {}
  return { args, options }
}
type GetReadFunction<
  narrowable extends boolean,
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<
    abi,
    'pure' | 'view',
    functionName
  > = ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  abiFunction extends AbiFunction = abi extends Abi
    ? ExtractAbiFunction<abi, functionName>
    : AbiFunction,
  //
  _args = AbiParametersToPrimitiveTypes<abiFunction['inputs']>,
  _options = Prettify<
    UnionOmit<
      ReadContractParameters<abi, functionName, args>,
      'abi' | 'address' | 'args' | 'functionName'
    >
  >,
> = narrowable extends true
  ? (
      ...parameters: _args extends readonly []
        ? [options?: _options]
        : [args: _args, options?: _options]
    ) => Promise<ReadContractReturnType<abi, functionName, args>>
  : (
      ...parameters:
        | [options?: _options]
        | [args: readonly unknown[], options?: _options]
    ) => Promise<ReadContractReturnType>

type GetEstimateGasAndCollateral<
  narrowable extends boolean,
  chain extends Chain | undefined,
  account extends Account | undefined,
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  > = ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
  abiFunction extends AbiFunction = abi extends Abi
    ? ExtractAbiFunction<abi, functionName>
    : AbiFunction,
  //
  _args = AbiParametersToPrimitiveTypes<abiFunction['inputs']>,
  _options = Prettify<
    UnionOmit<
      EstimateContractGasAndCollateralParameters<
        abi,
        functionName,
        args,
        chain
      >,
      'abi' | 'address' | 'args' | 'functionName'
    >
  >,
  // For making `options` parameter required if `account`
  IsOptionsRequired = IsUndefined<account>,
> = narrowable extends true
  ? (
      ...parameters: _args extends readonly []
        ? IsOptionsRequired extends true
          ? [options: _options]
          : [options?: _options]
        : [
            args: _args,
            ...parameters: IsOptionsRequired extends true
              ? [options: _options]
              : [options?: _options],
          ]
    ) => Promise<EstimateContractGasAndCollateralReturnType>
  : (
      ...parameters:
        | (IsOptionsRequired extends true
            ? [options: _options]
            : [options?: _options])
        | [
            args: readonly unknown[],
            ...parameters: IsOptionsRequired extends true
              ? [options: _options]
              : [options?: _options],
          ]
    ) => Promise<EstimateContractGasAndCollateralReturnType>

type GetSimulateFunction<
  narrowable extends boolean,
  chain extends Chain | undefined,
  account extends Account | undefined,
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  > = ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
  abiFunction extends AbiFunction = abi extends Abi
    ? ExtractAbiFunction<abi, functionName>
    : AbiFunction,
  //
  _args = AbiParametersToPrimitiveTypes<abiFunction['inputs']>,
> = narrowable extends true
  ? <
      chainOverride extends Chain | undefined = undefined,
      accountOverride extends Account | Address | undefined = undefined,
    >(
      ...parameters: _args extends readonly []
        ? [
            options?: Omit<
              SimulateContractParameters<
                abi,
                functionName,
                args,
                chain,
                chainOverride,
                accountOverride
              >,
              'abi' | 'address' | 'args' | 'functionName'
            >,
          ]
        : [
            args: _args,
            options?: Omit<
              SimulateContractParameters<
                abi,
                functionName,
                args,
                chain,
                chainOverride,
                accountOverride
              >,
              'abi' | 'address' | 'args' | 'functionName'
            >,
          ]
    ) => Promise<
      SimulateContractReturnType<
        abi,
        functionName,
        args,
        chain,
        account,
        chainOverride,
        accountOverride
      >
    >
  : <
      chainOverride extends Chain | undefined = undefined,
      accountOverride extends Account | Address | undefined = undefined,
    >(
      ...parameters:
        | [
            options?: Omit<
              SimulateContractParameters<
                abi,
                functionName,
                args,
                chain,
                chainOverride,
                accountOverride
              >,
              'abi' | 'address' | 'args' | 'functionName'
            >,
          ]
        | [
            args: readonly unknown[],
            options?: Omit<
              SimulateContractParameters<
                abi,
                functionName,
                args,
                chain,
                chainOverride,
                accountOverride
              >,
              'abi' | 'address' | 'args' | 'functionName'
            >,
          ]
    ) => Promise<SimulateContractReturnType>

type GetWriteFunction<
  narrowable extends boolean,
  chain extends Chain | undefined,
  account extends Account | undefined,
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  > = ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
  abiFunction extends AbiFunction = abi extends Abi
    ? ExtractAbiFunction<abi, functionName>
    : AbiFunction,
  //
  _args = AbiParametersToPrimitiveTypes<abiFunction['inputs']>,
  // For making `options` parameter required if `account` or `chain` is undefined
  _isOptionsRequired = Or<[IsUndefined<account>, IsUndefined<chain>]>,
> = narrowable extends true
  ? <
      chainOverride extends Chain | undefined,
      options extends Prettify<
        UnionOmit<
          WriteContractParameters<
            abi,
            functionName,
            args,
            chain,
            account,
            chainOverride
          >,
          'abi' | 'address' | 'args' | 'functionName'
        >
      >,
    >(
      ...parameters: _args extends readonly []
        ? _isOptionsRequired extends true
          ? [options: options]
          : [options?: options]
        : [
            args: _args,
            ...parameters: _isOptionsRequired extends true
              ? [options: options]
              : [options?: options],
          ]
    ) => Promise<WriteContractReturnType>
  : <
      chainOverride extends Chain | undefined,
      options extends Prettify<
        UnionOmit<
          WriteContractParameters<
            abi,
            functionName,
            args,
            chain,
            account,
            chainOverride
          >,
          'abi' | 'address' | 'args' | 'functionName'
        >
      >,
      Rest extends unknown[] = _isOptionsRequired extends true
        ? [options: options]
        : [options?: options],
    >(
      ...parameters: Rest | [args: readonly unknown[], ...parameters: Rest]
    ) => Promise<WriteContractReturnType>

type GetEventFilter<
  narrowable extends boolean,
  abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi>,
  abiEvent extends AbiEvent = abi extends Abi
    ? ExtractAbiEvent<abi, eventName>
    : AbiEvent,
  //
  _args = AbiEventParametersToPrimitiveTypes<abiEvent['inputs']>,
  _options = Prettify<
    Omit<
      CreateContractEventFilterParameters<abi, eventName>,
      'abi' | 'address' | 'args' | 'eventName' | 'strict'
    >
  >,
  IndexedInputs = Extract<abiEvent['inputs'][number], { indexed: true }>,
> = narrowable extends true
  ? <
      const args extends
        | MaybeExtractEventArgsFromAbi<abi, eventName>
        | undefined,
      strict extends boolean | undefined = undefined,
    >(
      ...parameters: IsNever<IndexedInputs> extends true
        ? [options?: _options & { strict?: strict }]
        : [
            args: _args | (_args extends args ? Readonly<args> : never),
            options?: _options & { strict?: strict },
          ]
    ) => Promise<
      CreateContractEventFilterReturnType<abi, eventName, args, strict>
    >
  : <strict extends boolean | undefined = undefined>(
      ...parameters:
        | [options?: _options & { strict?: strict }]
        | [
            args: readonly unknown[] | CreateContractFilterOptions,
            options?: _options & { strict?: strict },
          ]
    ) => Promise<CreateContractEventFilterReturnType>

type GetEventsFunction<
  narrowable extends boolean,
  abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi>,
  abiEvent extends AbiEvent = abi extends Abi
    ? ExtractAbiEvent<abi, eventName>
    : AbiEvent,
  //
  _args = AbiEventParametersToPrimitiveTypes<abiEvent['inputs']>,
  _options = Prettify<
    Omit<
      GetContractEventsParameters<abi, eventName>,
      'abi' | 'address' | 'args' | 'eventName'
    >
  >,
  IndexedInputs = Extract<abiEvent['inputs'][number], { indexed: true }>,
> = narrowable extends true
  ? (
      ...parameters: IsNever<IndexedInputs> extends true
        ? [options?: _options]
        : [args?: _args, options?: _options]
    ) => Promise<GetContractEventsReturnType<abi, eventName>>
  : (
      ...parameters:
        | [options?: _options]
        | [
            args?: readonly unknown[] | WatchContractEventOptions,
            options?: _options,
          ]
    ) => Promise<GetContractEventsReturnType<abi, eventName>>

// type GetWatchEvent<
//   narrowable extends boolean,
//   abi extends Abi | readonly unknown[],
//   eventName extends ContractEventName<abi>,
//   abiEvent extends AbiEvent = abi extends Abi
//     ? ExtractAbiEvent<abi, eventName>
//     : AbiEvent,
//   //
//   _args = AbiEventParametersToPrimitiveTypes<abiEvent['inputs']>,
//   _options = Prettify<
//     Omit<
//       WatchContractEventParameters<abi, eventName>,
//       'abi' | 'address' | 'args' | 'eventName'
//     >
//   >,
//   _indexedInputs = Extract<abiEvent['inputs'][number], { indexed: true }>,
// > = narrowable extends true
//   ? (
//       ...parameters: IsNever<_indexedInputs> extends true
//         ? [options: _options]
//         : [args: _args, options: _options]
//     ) => WatchContractEventReturnType
//   : (
//       ...parameters:
//         | [options?: _options]
//         | [
//             args: readonly unknown[] | WatchContractEventOptions,
//             options?: _options,
//           ]
//     ) => WatchContractEventReturnType

type CreateContractFilterOptions =
  RemoveProperties<CreateContractEventFilterParameters>
type WatchContractEventOptions = RemoveProperties<WatchContractEventParameters>

type RemoveProperties<T extends object> = Prettify<
  {
    [key: string]: unknown
  } & {
    [_ in keyof T]?: never
  }
>
