import {
  Eip1559FeesNotSupportedError,
  GetTransactionRequestKzgParameter,
  MaxFeePerGasTooLowError,
  Transport,
} from "viem";
import { FormattedTransactionRequest } from "../../utils/formatters/transactionRequest.js";
import {
  ExactPartial,
  IsNever,
  Prettify,
  UnionOmit,
  UnionRequiredBy,
} from "../../types/utils.js";
import { Account, Address } from "../../accounts/types.js";
import { DeriveAccount, GetAccountParameter } from "../../types/account.js";
import {
  GetTransactionType,
  getTransactionType,
} from "../../utils/transaction/getTransactionType.js";
import {
  TransactionRequest,
  TransactionRequestEIP1559,
  TransactionRequestEIP2930,
  TransactionRequestLegacy,
  TransactionSerializable,
} from "../../types/transaction.js";
import { AccountNotFoundErrorType } from "../../errors/account.js";
import {
  AssertRequestErrorType,
  AssertRequestParameters,
  assertRequest,
} from "../../utils/transaction/assertRequest.js";
import { ParseAccountErrorType, parseAccount } from "../../accounts/index.js";
import { getBlock as getBlock_ } from "../public/getBlock.js";
import {
  EstimateGasAndCollateralParameters,
  estimateGasAndCollateral,
} from "../public/estimateGasAndCollateral.js";
import { getAction } from "../../utils/getAction.js";
import { getStatus } from "../public/getStatus.js";
import { Client } from "../../clients/createClient.js";
import { txPoolNextNonce } from "../public/txPoolNextNonce.js";
import { getNextNonce } from "../public/getNextNonce.js";
import { Block, EpochNumber } from "../../types/block.js";
import { getEpochNumber } from "../public/getEpochNumber.js";
import { Chain, DeriveChain, GetChainParameter } from "../../types/chain.js";
import { internal_estimateFeesPerGas } from "../public/estimateFeesPerGas.js";
import { decodeBase32Address } from "../../utils/address/decodeBase32Address.js";
import {
  transactionGas,
  transactionStorageLimit,
} from "../../constants/transaction.js";
import { GetBlocksByEpochErrorType } from "../public/getBlocksByEpoch.js";

export const defaultParameters = [
  "chainId",
  "fees",
  "gas",
  "nonce",
  "type",
  "epochHeight",
  "storageLimit",
] as const;

export type PrepareTransactionRequestParameterType =
  | "chainId"
  | "fees"
  | "gas"
  | "nonce"
  | "type"
  | "epochHeight"
  | "storageLimit";
type ParameterTypeToParameters<
  parameterType extends PrepareTransactionRequestParameterType
> = parameterType extends "fees"
  ? "maxFeePerGas" | "maxPriorityFeePerGas" | "gasPrice"
  : parameterType;

export type PrepareTransactionRequestRequest<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  ///
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>
> = UnionOmit<FormattedTransactionRequest<_derivedChain>, "from"> &
  GetTransactionRequestKzgParameter & {
    parameters?: readonly PrepareTransactionRequestParameterType[] | undefined;
  };

export type PrepareTransactionRequestParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  accountOverride extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
  request extends PrepareTransactionRequestRequest<
    chain,
    chainOverride
  > = PrepareTransactionRequestRequest<chain, chainOverride>
> = request &
  GetAccountParameter<account, accountOverride, false> &
  GetChainParameter<chain, chainOverride> &
  GetTransactionRequestKzgParameter<request> & { chainId?: number | undefined };

export type PrepareTransactionRequestReturnType<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  accountOverride extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
  request extends PrepareTransactionRequestRequest<
    chain,
    chainOverride
  > = PrepareTransactionRequestRequest<chain, chainOverride>,
  ///
  _derivedAccount extends Account | Address | undefined = DeriveAccount<
    account,
    accountOverride
  >,
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
  _transactionType = request["type"] extends string | undefined
    ? request["type"]
    : GetTransactionType<request> extends "legacy"
    ? unknown
    : GetTransactionType<request>,
  _transactionRequest extends TransactionRequest =
    | (_transactionType extends "legacy" ? TransactionRequestLegacy : never)
    | (_transactionType extends "eip1559" ? TransactionRequestEIP1559 : never)
    | (_transactionType extends "eip2930" ? TransactionRequestEIP2930 : never)
> = Prettify<
  UnionRequiredBy<
    Extract<
      UnionOmit<FormattedTransactionRequest<_derivedChain>, "from"> &
        (_derivedChain extends Chain
          ? { chain: _derivedChain }
          : { chain?: undefined }) &
        (_derivedAccount extends Account
          ? { account: _derivedAccount; from: Address }
          : { account?: undefined; from?: undefined }),
      IsNever<_transactionRequest> extends true
        ? unknown
        : ExactPartial<_transactionRequest>
    > & { chainId?: number | undefined },
    ParameterTypeToParameters<
      request["parameters"] extends readonly PrepareTransactionRequestParameterType[]
        ? request["parameters"][number]
        : (typeof defaultParameters)[number]
    >
  >
>;

export type PrepareTransactionRequestErrorType =
  | AccountNotFoundErrorType
  | AssertRequestErrorType
  | ParseAccountErrorType
  | GetBlocksByEpochErrorType
  | EstimateGasAndCollateralParameters;

export async function prepareTransactionRequest<
  chain extends Chain | undefined,
  account extends Account | undefined,
  const request extends PrepareTransactionRequestRequest<chain, chainOverride>,
  accountOverride extends Account | Address | undefined = undefined,
  chainOverride extends Chain | undefined = undefined
>(
  client: Client<Transport, chain, account>,
  args: PrepareTransactionRequestParameters<
    chain,
    account,
    chainOverride,
    accountOverride,
    request
  >
): Promise<
  PrepareTransactionRequestReturnType<
    chain,
    account,
    chainOverride,
    accountOverride,
    request
  >
> {
  const {
    account: account_ = client.account,
    chain,
    chainId,
    gas,
    nonce,
    parameters = defaultParameters,
    type,
    epochHeight,
    storageLimit,
    to,
    data,
    accessList,
  } = args;

  const account = account_ ? parseAccount(account_) : undefined;

  const request = {
    ...args,
    ...(account ? { from: account?.address } : {}),
    to,
    data,
    accessList,
  };

  let block: Block | undefined;
  async function getBlock(epochNumber: EpochNumber): Promise<Block> {
    if (block) return block;
    block = await getAction(
      client,
      getBlock_,
      "getBlock"
    )({ epochNumber: epochNumber });
    return block;
  }

  if (parameters.includes("nonce") && typeof nonce === "undefined" && account) {
    /**
     * The execution of conflux transactions will be delayed for several seconds.
     * During this period, the nonce obtained by getNextNonce will still be old,
     * while txPoolNextNonce will provide the correct nonce.
     * but not all RPC nodes support txPoolNextNonce.
     */
    try {
      request.nonce = await getAction(
        client,
        txPoolNextNonce,
        "txPoolNextNonce"
      )({
        address: account.address,
      });
    } catch (e) {
      request.nonce = await getAction(
        client,
        getNextNonce,
        "getNextNonce"
      )({
        address: account.address,
      });
    }
  }

  if (parameters.includes("chainId")) {
    if (chain) {
      request.chainId = chain.id;
    } else if (typeof chainId !== "undefined") {
      request.chainId = chainId;
    } else {
      const nodeStatus = await getAction(client, getStatus, "getChainId")({});
      request.chainId = nodeStatus.chainId;
    }
  }

  if (parameters.includes("epochHeight")) {
    if (typeof epochHeight !== "undefined") {
      request.epochHeight = epochHeight;
    } else {
      request.epochHeight = await getAction(
        client,
        getEpochNumber,
        "getEpochNumber"
      )({});
    }
  }

  if (
    (parameters.includes("fees") || parameters.includes("type")) &&
    typeof type === "undefined"
  ) {
    try {
      request.type = getTransactionType(
        request as TransactionSerializable
      ) as any;
    } catch {
      // infer type from block
      const block = await getBlock(request.epochHeight!);
      request.type =
        typeof block?.baseFeePerGas === "bigint" ? "eip1559" : "legacy";
    }
  }

  if (
    (parameters.includes("gas") && typeof gas === "undefined") ||
    (parameters.includes("storageLimit") && typeof storageLimit === "undefined")
  ) {
    const isToUser = to && decodeBase32Address({ address: to }).type === "user";

    if (isToUser && !data && !accessList) {
      request.gas = transactionGas;
      request.storageLimit = transactionStorageLimit;
    } else {
      const { gasLimit, storageCollateralized } = await getAction(
        client,
        estimateGasAndCollateral,
        "estimateGasAndCollateral"
      )({
        ...request,
        account: account
          ? { address: account.address, type: "json-rpc" }
          : undefined,
      });

      if (typeof gas === "undefined") {
        request.gas = gasLimit;
      }
      if (typeof storageLimit === "undefined") {
        request.storageLimit = storageCollateralized;
      }
    }
  }

  if (parameters.includes("fees")) {
    if (request.type !== "legacy" && request.type !== "eip2930") {
      // EIP-1559 fees
      if (
        typeof request.maxFeePerGas === "undefined" ||
        typeof request.maxPriorityFeePerGas === "undefined"
      ) {
        const block = await getBlock(request.epochHeight!);
        const { maxFeePerGas, maxPriorityFeePerGas } =
          await internal_estimateFeesPerGas(client, {
            block: block as Block,
            chain,
            request: request as PrepareTransactionRequestParameters,
          });

        if (
          typeof args.maxPriorityFeePerGas === "undefined" &&
          args.maxFeePerGas &&
          args.maxFeePerGas < maxPriorityFeePerGas
        )
          throw new MaxFeePerGasTooLowError({
            maxPriorityFeePerGas,
          });

        request.maxPriorityFeePerGas = maxPriorityFeePerGas;
        request.maxFeePerGas = maxFeePerGas;
      }
    } else {
      // Legacy fees
      if (
        typeof args.maxFeePerGas !== "undefined" ||
        typeof args.maxPriorityFeePerGas !== "undefined"
      )
        throw new Eip1559FeesNotSupportedError();

      const block = await getBlock(request.epochHeight!);
      const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(
        client,
        {
          block: block as Block,
          chain,
          request: request as PrepareTransactionRequestParameters,
          type: "legacy",
        }
      );
      request.gasPrice = gasPrice_;
    }
  }

  assertRequest(request as AssertRequestParameters);

  delete request.parameters;

  return request as any;
}
