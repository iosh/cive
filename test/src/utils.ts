import { getTransactionReceipt } from '~cive/actions/public/getTransactionReceipt.js'
import { mine } from '~cive/actions/test/mine.js'
import {
  type DeployContractParameters,
  deployContract,
} from '~cive/actions/wallet/deployContract.js'
import type { Client } from '~cive/clients/createClient.js'
import type { Transport } from '~cive/clients/transports/index.js'
import type { Abi } from '~cive/index.js'
import type { Account } from '~cive/types/account.js'
import type { Chain } from '~cive/types/chain.js'
import { getBalance } from '../../src/actions/public/getBalance.js'
import { prepareTransactionRequest } from '../../src/actions/wallet/prepareTransactionRequest.js'
import { accounts } from './constants.js'
import { Create2Factory } from './contracts/Create2Factory.js'
import { Multicall3 } from './contracts/Multicall3.js'
import { Simple } from './contracts/Simple.js'
import { Test20 } from './contracts/Test20.js'
import { Test721 } from './contracts/Test721.js'

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
export async function deployTest721(
  client: Client<Transport, Chain, Account>,
  account = accounts[0],
) {
  return deploy(client, {
    abi: Test721.abi,
    bytecode: Test721.bytecode,
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

export async function deployCreate2Factory(
  client: Client<Transport, Chain, Account>,
) {
  return deploy(client, {
    abi: Create2Factory.abi,
    bytecode: Create2Factory.bytecode,
  })
}

export async function deploySimple(client: Client<Transport, Chain, Account>) {
  return deploy(client, {
    abi: Simple.abi,
    bytecode: Simple.bytecode,
  })
}
