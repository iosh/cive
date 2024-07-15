import type { Abi, TypedData } from 'abitype'
import type {
  GetPermissionsReturnType,
  Transport,
  WatchAssetParameters,
  WatchAssetReturnType,
} from 'viem'
import {
  type AddChainParameters,
  addChain,
  getPermissions,
  watchAsset,
} from 'viem/actions'
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
  type RequestPermissionsParameters,
  type RequestPermissionsReturnType,
  requestPermissions,
} from '../../actions/wallet/requestPermissions.js'
import {
  type SendRawTransactionParameters,
  type SendRawTransactionReturnType,
  sendRawTransaction,
} from '../../actions/wallet/sendRawTransaction.js'
import {
  type SendTransactionParameters,
  type SendTransactionReturnType,
  sendTransaction,
} from '../../actions/wallet/sendTransaction.js'
import type { Chain } from '../../types/chain.js'
import type { Client } from '../createClient.js'

import {
  type SignMessageParameters,
  type SignMessageReturnType,
  signMessage,
} from '../../actions/wallet/signMessage.js'

import {
  type SignTransactionParameters,
  type SignTransactionReturnType,
  signTransaction,
} from '../../actions/wallet/signTransaction.js'
import {
  type SignTypedDataParameters,
  type SignTypedDataReturnType,
  signTypedData,
} from '../../actions/wallet/signTypedData.js'
import {
  type SwitchChainParameters,
  switchChain,
} from '../../actions/wallet/switchChain.js'

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
  requestPermissions: (
    args: RequestPermissionsParameters,
  ) => Promise<RequestPermissionsReturnType>
  sendTransaction: (
    args: SendTransactionParameters<TChain, TAccount>,
  ) => Promise<SendTransactionReturnType>
  signMessage: (
    args: SignMessageParameters<TAccount>,
  ) => Promise<SignMessageReturnType>
  signTransaction: (
    args: SignTransactionParameters<TChain, TAccount>,
  ) => Promise<SignTransactionReturnType>
  signTypedData: <
    const TTypedData extends TypedData | { [key: string]: unknown },
    TPrimaryType extends string,
  >(
    args: SignTypedDataParameters<TTypedData, TPrimaryType, TAccount>,
  ) => Promise<SignTypedDataReturnType>
  switchChain: (args: SwitchChainParameters) => Promise<void>
  watchAsset: (args: WatchAssetParameters) => Promise<WatchAssetReturnType>
}

export function walletActions<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
>(client: Client<transport, chain, account>): WalletActions<chain, account> {
  return {
    deployContract: (args) => deployContract(client, args),
    prepareTransactionRequest: (args) =>
      prepareTransactionRequest(client, args) as any,
    sendRawTransaction: (args) => sendRawTransaction(client, args),
    addChain: (args) => addChain(client as any, args),
    getAddresses: () => getAddresses(client),
    getChainId: () => getChainId(client),
    getPermissions: () => getPermissions(client as any),
    requestAddresses: () => requestAddresses(client),
    requestPermissions: (args) => requestPermissions(client, args),
    signTransaction: (args) => signTransaction(client, args),
    sendTransaction: (args) => sendTransaction(client, args),
    signMessage: (args) => signMessage(client, args),
    signTypedData: (args) => signTypedData(client, args),
    switchChain: (args) => switchChain(client, args),
    watchAsset: (args) => watchAsset(client as any, args),
  }
}
