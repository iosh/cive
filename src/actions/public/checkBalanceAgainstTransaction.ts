import { type Transport, numberToHex } from 'viem'
import type { NumberToHexErrorType, RequestErrorType } from 'viem/utils'
import type { Address } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { EpochNumber, EpochTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
export type CheckBalanceAgainstTransactionParameters = {
  accountAddress: Address
  contractAddress: Address
  gasLimit: number
  gasPrice: number
  storageLimit: number
} & (
  | {
      /**
       * @default 'latest_state'
       */
      epochTag?: EpochTag | undefined
      epochNumber?: never | undefined
    }
  | {
      epochTag?: never | undefined
      epochNumber?: EpochNumber | undefined
    }
)

export type CheckBalanceAgainstTransactionReturnType = {
  isBalanceEnough: boolean
  willPayCollateral: boolean
  willPayTxFee: boolean
}

export type CheckBalanceAgainstTransactionErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType

export async function checkBalanceAgainstTransaction<
  TChain extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    accountAddress,
    contractAddress,
    gasLimit,
    gasPrice,
    storageLimit,
    epochTag = 'latest_state',
    epochNumber,
  }: CheckBalanceAgainstTransactionParameters,
): Promise<CheckBalanceAgainstTransactionReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined
  const result = await client.request({
    method: 'cfx_checkBalanceAgainstTransaction',
    params: [
      accountAddress,
      contractAddress,
      numberToHex(gasLimit),
      numberToHex(gasPrice),
      numberToHex(storageLimit),
      _epochNumber || epochTag,
    ],
  })

  return result
}
