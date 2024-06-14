import { Transport } from "viem";
import { Account, Address } from "../../accounts/types.js";
import { Client } from "../createClient.js";
import { Chain } from "../../types/chain.js";
import {
  SendRawTransactionParameters,
  SendRawTransactionReturnType,
  sendRawTransaction,
} from "../../actions/wallet/sendRawTransaction.js";
import {
  PrepareTransactionRequestParameters,
  PrepareTransactionRequestRequest,
  PrepareTransactionRequestReturnType,
  prepareTransactionRequest,
} from "../../actions/wallet/prepareTransactionRequest.js";
import { Abi } from "abitype";
import {
  DeployContractParameters,
  DeployContractReturnType,
  deployContract,
} from "../../actions/wallet/deployContract.js";

export type WalletActions<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined
> = {
  deployContract: <
    const abi extends Abi | readonly unknown[],
    chainOverride extends Chain | undefined
  >(
    args: DeployContractParameters<abi, TChain, TAccount, chainOverride>
  ) => Promise<DeployContractReturnType>;
  prepareTransactionRequest: <
    const TRequest extends PrepareTransactionRequestRequest<
      TChain,
      TChainOverride
    >,
    TChainOverride extends Chain | undefined = undefined,
    TAccountOverride extends Account | Address | undefined = undefined
  >(
    args: PrepareTransactionRequestParameters<
      TChain,
      TAccount,
      TChainOverride,
      TAccountOverride,
      TRequest
    >
  ) => Promise<
    PrepareTransactionRequestReturnType<
      Chain,
      TAccount,
      TChainOverride,
      TAccountOverride,
      // @ts-expect-error
      TRequest
    >
  >;
  sendRawTransaction: (
    args: SendRawTransactionParameters
  ) => Promise<SendRawTransactionReturnType>;
};

export function walletActions<
  TTransport extends Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined
>(
  client: Client<TTransport, TChain, TAccount>
): WalletActions<TChain, TAccount> {
  return {
    deployContract: (args) => deployContract(client, args),
    prepareTransactionRequest: (args) =>
      prepareTransactionRequest(client, args) as any,
    sendRawTransaction: (args) => sendRawTransaction(client, args),
  };
}
