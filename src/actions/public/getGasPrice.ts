import type { RequestErrorType } from 'viem/utils'
import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'

export type GetGasPriceReturnType = bigint
export type GetGaspriceErrorType = RequestErrorType | ErrorType

/**
 * Returns the current price per gas in Drip.
 * - Docs: https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_gasprice
 * - JSON-RPC Method: [`cfx_gasprice`](https://doc.confluxnetwork.org/docs/core/build/json-rpc/cfx-namespace#cfx_gasprice)
 * @param client
 * @returns The gas price (in drip). {@link GetGasPriceReturnType}
 */

export async function getGasPrice<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(client: Client<Transport, TChain, TAccount>): Promise<GetGasPriceReturnType> {
  const gasPrice = await client.request({
    method: 'cfx_gasPrice',
  })

  return BigInt(gasPrice)
}
