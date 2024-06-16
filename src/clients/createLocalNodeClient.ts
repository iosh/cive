import { RpcSchema, Transport } from "viem";
import { Chain } from "../types/chain.js";
import { Account, Address } from "../accounts/types.js";
import { Prettify } from "../types/utils.js";
import {
  Client,
  ClientConfig,
  CreateClientErrorType,
  createClient,
} from "./createClient.js";
import { LocalNodeRpcSchema } from "../types/eip1193.js";
import { localNodeActions } from "./decorators/localNode.js";
import { ErrorType } from "../errors/utils.js";
import { ParseAccount } from "../types/account.js";

export type LocalNodeClientConfig<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Pick<
    ClientConfig<transport, chain, accountOrAddress, rpcSchema>,
    | "account"
    | "cacheTime"
    | "chain"
    | "key"
    | "name"
    | "pollingInterval"
    | "rpcSchema"
    | "transport"
  >
>;

export type LocalNodeClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Client<
    transport,
    chain,
    account,
    rpcSchema extends RpcSchema
      ? [...LocalNodeRpcSchema, ...rpcSchema]
      : LocalNodeRpcSchema,
    LocalNodeActions
  >
>;

export type CreateTestClientErrorType = CreateClientErrorType | ErrorType;

export function createLocalNodeClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
>(
  parameters: LocalNodeClientConfig<
    transport,
    chain,
    accountOrAddress,
    rpcSchema
  >
): LocalNodeClientConfig<
  transport,
  chain,
  ParseAccount<accountOrAddress>,
  rpcSchema
>;

export function createLocalNodeClient(
  parameters: LocalNodeClientConfig
): LocalNodeClient {
  const { key = "localNode", name = "Local Node Client" } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    type: "LocalNodeClient",
  });
  return client.extend((config) => ({
    ...localNodeActions(config),
  }));
}
