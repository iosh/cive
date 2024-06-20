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
import { LocalNodeActions, localNodeActions } from "./decorators/localNode.js";
import { ErrorType } from "../errors/utils.js";
import { ParseAccount } from "../types/account.js";

export type LocalClientConfig<
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
  includeActions extends boolean = true,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Client<
    transport,
    chain,
    account,
    rpcSchema extends RpcSchema
      ? [...LocalNodeRpcSchema, ...rpcSchema]
      : LocalNodeRpcSchema,
    includeActions extends true ? LocalNodeActions : Record<string, unknown>
  >
>;

export type CreateLocalNodeClientErrorType = CreateClientErrorType | ErrorType;

export function createLocalNodeClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
>(
  parameters: LocalClientConfig<transport, chain, accountOrAddress, rpcSchema>
): LocalNodeClient<
  transport,
  chain,
  ParseAccount<accountOrAddress>,
  true,
  rpcSchema
>;

export function createLocalNodeClient(
  parameters: LocalClientConfig
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