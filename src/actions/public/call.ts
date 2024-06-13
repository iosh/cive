import {
  AssertRequestErrorType,
  BaseError,
  ChainDoesNotSupportContract,
  ClientChainNotConfiguredError,
  DecodeFunctionResultErrorType,
  EncodeFunctionDataErrorType,
  GetChainContractAddressErrorType,
  Hex,
  InvalidBytesBooleanError,
  InvalidBytesBooleanErrorType,
  NumberToHexErrorType,
  RawContractError,
  RpcStateMapping,
  StateAssignmentConflictErrorType,
  StateMapping,
  Transport,
  decodeFunctionData,
  encodeFunctionData,
  getChainContractAddress,
  multicall3Abi,
  numberToHex,
} from "viem";
import {
  FormattedTransactionRequest,
  formatTransactionRequest,
} from "../../utils/formatters/transactionRequest.js";
import { ExactPartial, UnionOmit } from "../../types/utils.js";
import { Address } from "../../accounts/types.js";
import { EpochNumber, EpochTag } from "../../types/block.js";
import {
  GetCallErrorReturnType,
  RequestErrorType,
  getCallError,
} from "viem/utils";
import {
  ParseAccountErrorType,
  parseAccount,
} from "../../accounts/utils/parseAccount.js";
import { Client } from "../../clients/createClient.js";
import { TransactionRequest } from "../../types/transaction.js";
import { RpcTransactionRequest } from "../../types/rpc.js";
import { ErrorType } from "../../errors/utils.js";
import { aggregate3Signature } from "../../constants/contract.js";
import {
  CreateBatchSchedulerErrorType,
  createBatchScheduler,
} from "../../utils/promise/createBatchScheduler.js";
import { Chain } from "../../types/chain.js";

export type FormattedCall<
  TChain extends Chain | undefined = Chain | undefined
> = FormattedTransactionRequest<TChain>;

export type CallParameters<
  TChain extends Chain | undefined = Chain | undefined
> = UnionOmit<FormattedCall<TChain>, "from"> & {
  account?: Address | Address | undefined;
  batch?: boolean | undefined;
} & (
    | {
        /**
         * @default 'latest_state'
         */
        epochTag?: EpochTag | undefined;
        epochNumber?: never | undefined;
      }
    | {
        epochTag?: never | undefined;
        epochNumber?: EpochNumber | undefined;
      }
  );

export type CallReturnType = { data: Hex | undefined };

export type CallErrorType = GetCallErrorReturnType<
  | ParseAccountErrorType
  | AssertRequestErrorType
  | NumberToHexErrorType
  | ScheduleMulticallErrorType
  | RequestErrorType
>;

export async function call<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  args: CallParameters<TChain>
): Promise<CallReturnType> {
  const {
    account: account_ = client.account,
    batch = Boolean(client.batch?.multicall),
    epochNumber,
    epochTag = "latest_state",
    data,
    gas,
    gasPrice,
    storageLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value,
    ...rest
  } = args;
  const account = account_ ? parseAccount(account_) : undefined;

  try {
    const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;
    const epoch = _epochNumber || epochTag;

    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;

    const request = format({
      from: account?.address,
      data,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value,
      storageLimit,
    } as TransactionRequest);

    if (batch && shouldPerformMulticall({ request })) {
      try {
        return await scheduleMulticall(client, {
          ...request,
          epochNumber,
          epochTag,
        } as unknown as ScheduleMulticallParameters<TChain>);
      } catch (err) {
        if (
          !(err instanceof ClientChainNotConfiguredError) &&
          !(err instanceof ChainDoesNotSupportContract)
        )
          throw err;
      }
    }

    const response = await client.request({
      method: "cfx_call",
      params: [request as ExactPartial<RpcTransactionRequest>, epoch],
    });
    if (response === "0x") return { data: undefined };
    return { data: response };
  } catch (err) {
    const data = getRevertErrorData(err);
    throw getCallError(err as ErrorType, {
      ...args,
      account,
      chain: client.chain,
    });
  }
}

// We only want to perform a scheduled multicall if:
// - The request has calldata,
// - The request has a target address,
// - The target address is not already the aggregate3 signature,
// - The request has no other properties (`nonce`, `gas`, etc cannot be sent with a multicall).
function shouldPerformMulticall({ request }: { request: TransactionRequest }) {
  const { data, to, ...request_ } = request;
  if (!data) return false;
  if (data.startsWith(aggregate3Signature)) return false;
  if (!to) return false;
  if (
    Object.values(request_).filter((x) => typeof x !== "undefined").length > 0
  )
    return false;
  return true;
}

type ScheduleMulticallParameters<TChain extends Chain | undefined> = Pick<
  CallParameters<TChain>,
  "epochNumber" | "epochTag"
> & {
  data: Hex;
  multicallAddress?: Address | undefined;
  to: Address;
};

export type ScheduleMulticallErrorType =
  | GetChainContractAddressErrorType
  | NumberToHexErrorType
  | CreateBatchSchedulerErrorType
  | EncodeFunctionDataErrorType
  | DecodeFunctionResultErrorType
  | ErrorType;

async function scheduleMulticall<TChain extends Chain | undefined>(
  client: Client<Transport>,
  args: ScheduleMulticallParameters<TChain>
) {
  const { batchSize = 1024, wait = 0 } =
    typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
  const {
    epochNumber,
    epochTag = "latest_state",
    data,
    multicallAddress: multicallAddress_,
    to,
  } = args;

  let multicallAddress = multicallAddress_;
  if (!multicallAddress) {
    if (!client.chain) throw new ClientChainNotConfiguredError();

    multicallAddress = getChainContractAddress({
      epochNumber,
      chain: client.chain,
      contract: "multicall3",
    });
  }

  const epochNumberHex = epochNumber ? numberToHex(epochNumber) : undefined;
  const block = epochNumberHex || epochTag;

  const { schedule } = createBatchScheduler({
    id: `${client.uid}.${block}`,
    wait,
    shouldSplitBatch(args) {
      const size = args.reduce((size, { data }) => size + (data.length - 2), 0);
      return size > batchSize * 2;
    },
    fn: async (
      requests: {
        data: Hex;
        to: Address;
      }[]
    ) => {
      const calls = requests.map((request) => ({
        allowFailure: true,
        callData: request.data,
        target: request.to,
      }));

      const calldata = encodeFunctionData({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3",
      });

      const data = await client.request({
        method: "cfx_call",
        params: [
          {
            data: calldata,
            to: multicallAddress,
          },
          block,
        ],
      });

      return decodeFunctionData({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3",
        data: data || "0x",
      });
    },
  });

  const [{ returnData, success }] = await schedule({ data, to });

  if (!success) throw new RawContractError({ data: returnData });
  if (returnData === "0x") return { data: undefined };
  return { data: returnData };
}

export type GetRevertErrorDataErrorType = ErrorType;

export function getRevertErrorData(err: unknown) {
  if (!(err instanceof BaseError)) return undefined;
  const error = err.walk() as RawContractError;
  return typeof error?.data === "object" ? error.data?.data : error.data;
}

export type ParseStateMappingErrorType = InvalidBytesBooleanErrorType;

export function parseStateMapping(
  stateMapping: StateMapping | undefined
): RpcStateMapping | undefined {
  if (!stateMapping || stateMapping.length === 0) return undefined;
  return stateMapping.reduce((acc, { slot, value }) => {
    if (slot.length !== 66)
      throw new InvalidBytesBooleanError({
        size: slot.length,
        targetSize: 66,
        type: "hex",
      });
    if (value.length !== 66)
      throw new InvalidBytesBooleanError({
        size: value.length,
        targetSize: 66,
        type: "hex",
      });
    acc[slot] = value;
    return acc;
  }, {} as RpcStateMapping);
}
