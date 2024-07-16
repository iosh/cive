import type { Hex, Transport } from 'viem'
import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain, GetChainParameter } from '../../types/chain.js'
import type { UnionEvaluate, UnionOmit } from '../../types/utils.js'
import {
  type SendTransactionErrorType,
  type SendTransactionParameters,
  type SendTransactionReturnType,
  sendTransaction,
} from './sendTransaction.js'
import type { Abi } from '../../types/abitype.js'
import type { ContractConstructorArgs } from '../../types/contract.js'
import { encodeDeployData } from '../../utils/abi/encodeDeployData.js'

export type DeployContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  ///
  allArgs = ContractConstructorArgs<abi>,
> = UnionOmit<
  SendTransactionParameters<chain, account, chainOverride>,
  'accessList' | 'chain' | 'to' | 'data'
> &
  GetChainParameter<chain, chainOverride> &
  UnionEvaluate<
    readonly [] extends allArgs
      ? { args?: allArgs | undefined }
      : { args: allArgs }
  > & {
    abi: abi
    bytecode: Hex
  }

export type DeployContractReturnType = SendTransactionReturnType

export type DeployContractErrorType = SendTransactionErrorType | ErrorType

export function deployContract<
  const abi extends Abi | readonly unknown[],
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined,
>(
  walletClient: Client<Transport, chain, account>,
  parameters: DeployContractParameters<abi, chain, account, chainOverride>,
): Promise<DeployContractReturnType> {
  const { abi, args, bytecode, ...request } =
    parameters as DeployContractParameters
  const calldata = encodeDeployData({ abi, args, bytecode })
  return sendTransaction(walletClient, {
    ...request,
    data: calldata,
  } as unknown as SendTransactionParameters<chain, account, chainOverride>)
}
