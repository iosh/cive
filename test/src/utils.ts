import { generateLocalNodeBlock } from '~unit/actions/localNode/generateLocalNodeBlock.js'
import { mine } from '~unit/actions/localNode/mine.js'
import { getTransactionReceipt } from '~unit/actions/public/getTransactionReceipt.js'
import {
  type DeployContractParameters,
  deployContract,
} from '~unit/actions/wallet/deployContract.js'
import type { Client } from '~unit/clients/createClient.js'
import type { Transport } from '~unit/clients/transports/index.js'
import type { Abi } from '~unit/index.js'
import type { Account } from '~unit/types/account.js'
import type { Chain } from '~unit/types/chain.js'
import { getBalance } from '../../src/actions/public/getBalance.js'
import { prepareTransactionRequest } from '../../src/actions/wallet/prepareTransactionRequest.js'
import { accounts } from './constants.js'
import { Multicall3 } from './contracts/Multicall3.js'
import { Test20 } from './contracts/Test20.js'

export async function deploy<const abi extends Abi | readonly unknown[]>(
  client: Client<Transport, Chain, Account>,
  args: DeployContractParameters<abi, (typeof client)['chain'], Account>,
) {
  const hash = await deployContract(client, {
    ...args,
  } as any)
  await mine(client, { numTxs: 1 })
  const { contractCreated } = await getTransactionReceipt(client, {
    hash,
  })
  return { contractCreated }
}

export async function deployTest20(
  client: Client<Transport, Chain, Account>,
  account = accounts[0],
) {
  return deploy(client, {
    abi: Test20.abi,
    bytecode: Test20.bytecode,
    args: [account.base32Address],
  })
}

export async function deployMulticall3(
  client: Client<Transport, Chain, Account>,
) {
  return deploy(client, {
    abi: Multicall3.abi,
    bytecode: Multicall3.bytecode.object,
  })
}
