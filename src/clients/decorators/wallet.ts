import type { Abi } from 'abitype'
import type { Transport } from 'viem'
import type { Account, Address } from '../../accounts/types.js'
import {
  type DeployContractParameters,
  type DeployContractReturnType,
  deployContract,
} from '../../actions/wallet/deployContract.js'
import {
  type PrepareTransactionRequestParameters,
  type PrepareTransactionRequestRequest,
  type PrepareTransactionRequestReturnType,
  prepareTransactionRequest,
} from '../../actions/wallet/prepareTransactionRequest.js'
import {
  type SendRawTransactionParameters,
  type SendRawTransactionReturnType,
  sendRawTransaction,
} from '../../actions/wallet/sendRawTransaction.js'
import type { Chain } from '../../types/chain.js'
import type { Client } from '../createClient.js'
import {
  getAddresses,
  type GetAddressesReturnType,
} from '../../actions/wallet/getAddresses.js'
import { getChainId, type GetChainIdReturnType } from '../../actions/public/getChainId.js'

export type WalletActions<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
> = {
  deployContract: <
    const abi extends Abi | readonly unknown[],
    chainOverride extends Chain | undefined,
  >(
    args: DeployContractParameters<abi, TChain, TAccount, chainOverride>,
  ) => Promise<DeployContractReturnType>
  prepareTransactionRequest: <
    const TRequest extends PrepareTransactionRequestRequest<
      TChain,
      TChainOverride
    >,
    TChainOverride extends Chain | undefined = undefined,
    TAccountOverride extends Account | Address | undefined = undefined,
  >(
    args: PrepareTransactionRequestParameters<
      TChain,
      TAccount,
      TChainOverride,
      TAccountOverride,
      TRequest
    >,
  ) => Promise<
    PrepareTransactionRequestReturnType<
      Chain,
      TAccount,
      TChainOverride,
      TAccountOverride,
      // @ts-expect-error
      TRequest
    >
  >
  sendRawTransaction: (
    args: SendRawTransactionParameters,
  ) => Promise<SendRawTransactionReturnType>

  getAddresses: () => Promise<GetAddressesReturnType>
  getChainId: () => Promise<GetChainIdReturnType>
}

export function walletActions<
  TTransport extends Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
>(
  client: Client<TTransport, TChain, TAccount>,
): WalletActions<TChain, TAccount> {
  return {
    deployContract: (args) => deployContract(client, args),
    prepareTransactionRequest: (args) =>
      prepareTransactionRequest(client, args) as any,
    sendRawTransaction: (args) => sendRawTransaction(client, args),
    getAddresses: () => getAddresses(client),
    getChainId: () => getChainId(client),
  }
}
