import type { Transport } from 'viem'
import { hexToBigInt } from 'viem/utils'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import { observe } from '../../types/observe.js'
import type { HasTransportType } from '../../types/transport.js'
import { getAction } from '../../utils/getAction.js'
import { type PollErrorType, poll } from '../../utils/poll.js'
import { stringify } from '../../utils/stringify.js'
import {
  type GetEpochNumberParameters,
  type GetEpochNumberReturnType,
  getEpochNumber,
} from './getEpochNumber.js'

export type OnEpochNumberParameter = GetEpochNumberReturnType
export type OnEpochNumberFn = (
  epochNumber: OnEpochNumberParameter,
  prevEpochNumber: OnEpochNumberParameter | undefined,
) => void

export type WatchEpochNumberParameters<
  transport extends Transport = Transport,
> = {
  /** The callback to call when a new Epoch number is received. */
  onEpochNumber: OnEpochNumberFn
  /** The callback to call when an error occurred when trying to get for a new Epoch. */
  onError?: ((error: Error) => void) | undefined
  epochTag?: GetEpochNumberParameters['epochTag']
} & (
  | (HasTransportType<transport, 'webSocket'> extends true
      ? {
          emitMissed?: undefined
          emitOnBegin?: undefined
          /** Whether or not the WebSocket Transport should poll the JSON-RPC, rather than using `eth_subscribe`. */
          poll?: false | undefined
          pollingInterval?: undefined
        }
      : never)
  | {
      /** Whether or not to emit the missed Epoch numbers to the callback. */
      emitMissed?: boolean | undefined
      /** Whether or not to emit the latest Epoch number to the callback when the subscription opens. */
      emitOnBegin?: boolean | undefined
      poll?: true | undefined
      /** Polling frequency (in ms). Defaults to Client's pollingInterval config. */
      pollingInterval?: number | undefined
    }
)

export type WatchEpochNumberReturnType = () => void

export type WatchEpochNumberErrorType = PollErrorType | ErrorType

export function watchEpochNumber<
  chain extends Chain | undefined,
  transport extends Transport,
>(
  client: Client<transport, chain>,
  {
    emitOnBegin = false,
    emitMissed = false,
    onEpochNumber,
    onError,
    poll: poll_,
    pollingInterval = client.pollingInterval,
    epochTag,
  }: WatchEpochNumberParameters<transport>,
): WatchEpochNumberReturnType {
  const enablePolling = (() => {
    if (typeof poll_ !== 'undefined') return poll_
    if (client.transport.type === 'webSocket') return false
    if (
      client.transport.type === 'fallback' &&
      client.transport.transports[0].config.type === 'webSocket'
    )
      return false
    return true
  })()
  let prevEpochNumber: GetEpochNumberReturnType | undefined

  const pollEpochNumber = () => {
    const observerId = stringify([
      'watchEpochNumber',
      client.uid,
      emitOnBegin,
      emitMissed,
      pollingInterval,
    ])

    return observe(observerId, { onEpochNumber, onError }, (emit) =>
      poll(
        async () => {
          try {
            const epochNumber = await getAction(
              client,
              getEpochNumber,
              'getEpochNumber',
            )({ cacheTime: 0, epochTag })
            if (prevEpochNumber) {
              // If the current epoch number is the same as the previous,
              // we can skip.
              if (epochNumber === prevEpochNumber) return

              // If we have missed out on some previous epochs, and the
              // `emitMissed` flag is truthy, let's emit those epochs.
              if (epochNumber - prevEpochNumber > 1 && emitMissed) {
                for (let i = prevEpochNumber + 1n; i < epochNumber; i++) {
                  emit.onEpochNumber(i, prevEpochNumber)
                  prevEpochNumber = i
                }
              }
            }
            // If the next epoch number is greater than the previous,
            // it is not in the past, and we can emit the new epoch number.
            if (!prevEpochNumber || epochNumber > prevEpochNumber) {
              emit.onEpochNumber(epochNumber, prevEpochNumber)
              prevEpochNumber = epochNumber
            }
          } catch (error) {
            emit.onError?.(error as Error)
          }
        },
        {
          emitOnBegin,
          interval: pollingInterval,
        },
      ),
    )
  }

  const subscribeEpochNumber = () => {
    const observerId = stringify([
      'watchEpochNumber',
      client.uid,
      emitOnBegin,
      emitMissed,
    ])

    return observe(observerId, { onEpochNumber, onError }, (emit) => {
      let active = true
      let unsubscribe = () => (active = false)
      ;(async () => {
        try {
          const transport = (() => {
            if (client.transport.type === 'fallback') {
              const transport = client.transport.transports.find(
                (transport: ReturnType<Transport>) =>
                  transport.config.type === 'webSocket',
              )
              if (!transport) return client.transport
              return transport.value
            }
            return client.transport
          })()

          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ['newHeads'],
            onData(data: any) {
              if (!active) return
              const epochNumber = hexToBigInt(data.result?.number)
              emit.onEpochNumber(epochNumber, prevEpochNumber)
              prevEpochNumber = epochNumber
            },
            onError(error: Error) {
              emit.onError?.(error)
            },
          })
          unsubscribe = unsubscribe_
          if (!active) unsubscribe()
        } catch (err) {
          onError?.(err as Error)
        }
      })()
      return () => unsubscribe()
    })
  }
  return enablePolling ? pollEpochNumber() : subscribeEpochNumber()
}
