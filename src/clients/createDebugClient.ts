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
import { DebugRpcSchema } from "../types/eip1193.js";
import { DebugActions, debugActions } from "./decorators/debug.js";
import { ErrorType } from "../errors/utils.js";
import { ParseAccount } from "../types/account.js";

export type DebugClientConfig<
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

export type TestClient<
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
      ? [...DebugRpcSchema, ...rpcSchema]
      : DebugRpcSchema,
    DebugActions
  >
>;

export type CreateTestClientErrorType = CreateClientErrorType | ErrorType;

export function createTestClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
>(
  parameters: DebugClientConfig<transport, chain, accountOrAddress, rpcSchema>
): DebugClientConfig<
  transport,
  chain,
  ParseAccount<accountOrAddress>,
  rpcSchema
>;

export function createTestClient(parameters: DebugClientConfig): TestClient {
  const { key = "debug", name = "Debug Client" } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    type: "DebugClient",
  });
  return client.extend((config) => ({
    ...debugActions(config),
  }));
}
