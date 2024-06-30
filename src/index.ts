// biome-ignore lint/performance/noBarrelFile: <explanation>
export {
  type Client,
  type ClientConfig,
  type CreateClientErrorType,
  type MulticallBatchOptions,
  createClient,
  rpcSchema,
} from './clients/createClient.js'
export {
  type PublicClient,
  type PublicClientConfig,
  type CreatePublicClientErrorType,
  createPublicClient,
} from './clients/createPublicClient.js'
