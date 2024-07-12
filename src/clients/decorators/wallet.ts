import type { Abi } from 'abitype'
import type { GetPermissionsReturnType, Transport } from 'viem'
import { type AddChainParameters, addChain, getPermissions } from 'viem/actions'
import type { Account, Address } from '../../accounts/types.js'
import {
  type GetChainIdReturnType,
  getChainId,
} from '../../actions/public/getChainId.js'
import {
  type DeployContractParameters,
  type DeployContractReturnType,
  deployContract,
} from '../../actions/wallet/deployContract.js'
import {
  type GetAddressesReturnType,
  getAddresses,
} from '../../actions/wallet/getAddresses.js'
import {
  type PrepareTransactionRequestParameters,
  type PrepareTransactionRequestRequest,
  type PrepareTransactionRequestReturnType,
  prepareTransactionRequest,
} from '../../actions/wallet/prepareTransactionRequest.js'
import {
  type RequestAddressesReturnType,
  requestAddresses,
} from '../../actions/wallet/requestAddresses.js'
import {
  type SendRawTransactionParameters,
  type SendRawTransactionReturnType,
  sendRawTransaction,
} from '../../actions/wallet/sendRawTransaction.js'
import type { Chain } from '../../types/chain.js'
import type { Client } from '../createClient.js'

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
  addChain: (args: AddChainParameters) => Promise<void>
  getAddresses: () => Promise<GetAddressesReturnType>
  getChainId: () => Promise<GetChainIdReturnType>
  getPermissions: () => Promise<GetPermissionsReturnType>
  requestAddresses: () => Promise<RequestAddressesReturnType>
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
    addChain: (args) => addChain(client, args),
    getAddresses: () => getAddresses(client),
    getChainId: () => getChainId(client),
    getPermissions: () => getPermissions(client),
    requestAddresses: () => requestAddresses(client),
  }
}
