import { Chain } from "~unit/types/chain.js";
import {
  ClientConfig,
  Client,
  createClient,
} from "~unit/clients/createClient.js";
import { ParseAccount } from "~unit/types/account.js";
import { ExactPartial } from "~unit/types/utils.js";
import { Account, Address } from "~unit/accounts/types.js";
import { Transport, http, webSocket } from "~unit/clients/transports/index.js";
import { accounts } from "./accounts.js";




type DefineConfluxParameters<chain extends Chain> = {
  chain: chain;
  forkBlockNumber: bigint;
  forkUrl: string;
  port: number;
};

type DefineConfluxReturnType<chain extends Chain> = {
  chain: chain;
  clientConfig: ClientConfig<Transport, chain, undefined>;
  forkBlockNumber: bigint;
  forkUrl: string;
  getClient<
    config extends ExactPartial<
      Omit<ClientConfig, "account" | "chain"> & {
        account?: true | Address | Account | undefined;
        chain?: false | undefined;
      }
    >
  >(
    config?: config | undefined
  ): Client<
    config["transport"] extends Transport ? config["transport"] : Transport,
    config["chain"] extends false ? undefined : chain,
    config["account"] extends Address
      ? ParseAccount<config["account"]>
      : config["account"] extends Account
      ? config["account"]
      : config["account"] extends true
      ? ParseAccount<(typeof accounts)[0]['base32Address']>
      : undefined,
    undefined,
    { mode: "anvil" }
  >;
  rpcUrl: {
    http: string;
    ipc: string;
    ws: string;
  };
  restart(): Promise<void>;
  start(): Promise<() => Promise<void>>;
};

function defineConflux<const chain extends Chain>(
  parameters: DefineConfluxParameters<chain>
): DefineConfluxReturnType<chain> {
  const {
    chain: chain_,
    forkUrl,
    forkBlockNumber,
    port,
    ...options
  } = parameters;
  const rpcUrl = {
    http: `http://127.0.0.1:${port}/${poolId}`,
    ipc: `/tmp/anvil-${poolId}.ipc`,
    ws: `ws://127.0.0.1:${port}/${poolId}`,
  } as const;

  const chain = {
    ...chain_,
    name: `${chain_.name} (Local)`,
    rpcUrls: {
      default: {
        http: [rpcUrl.http],
        webSocket: [rpcUrl.ws],
      },
    },
  } as const satisfies Chain;

  const clientConfig = {
    batch: {
      multicall: process.env.VITE_BATCH_MULTICALL === "true",
    },
    chain,
    pollingInterval: 100,
    transport(args) {
      const { config, request, value } = (() => {
        if (process.env.VITE_NETWORK_TRANSPORT_MODE === "webSocket")
          return webSocket(rpcUrl.ws)(args);
        return http(rpcUrl.http)(args);
      })();

      return {
        config,
        async request({ method, params }: any, opts: any = {}) {
          return request({ method, params }, opts);
        },
        value,
      };
    },
  } as const satisfies ClientConfig;

  return {
    chain,
    clientConfig,
    forkBlockNumber,
    forkUrl,
    getClient(config) {
      return (
        createClient({
          ...clientConfig,
          ...config,
          account:
            config?.account === true ? accounts[0].base32Address : config?.account,
          chain: config?.chain === false ? undefined : chain,
          transport: clientConfig.transport,
        }) as any
      ).extend(() => ({ mode: "anvil" })) as never;
    },
    rpcUrl,
    async restart() {
      await fetch(`${rpcUrl.http}/restart`);
    },
    async start() {
      // TODO
    },
  } as const;
}
