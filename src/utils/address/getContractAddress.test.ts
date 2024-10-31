import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '../../../test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { Create2Factory } from '../../../test/src/contracts/Create2Factory.js'
import { Simple } from '../../../test/src/contracts/Simple.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { Test721 } from '../../../test/src/contracts/Test721.js'
import {
  deployCreate2Factory,
  deploySimple,
  deployTest20,
  deployTest721,
} from '../../../test/src/utils.js'
import { getNextNonce, simulateContract } from '../../actions/index.js'
import { sayHelloLocalNode } from '../../actions/test/sayHelloLocalNode.js'
import { create2FactoryAddress } from '../../constants/contract.js'
import { encodeDeployData } from '../abi/encodeDeployData.js'
import { wait } from '../wait.js'
import { getContractAddress } from './getContractAddress.js'
import { hexAddressToBase32 } from './hexAddressToBase32.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({
  account: sourceAccount,
})

beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  await wait(1000)
})

afterAll(async () => {
  await devConflux.stop()
})

describe('create', () => {
  test('deploy contract simple', async () => {
    const nonce = await getNextNonce(client, { address: sourceAccount.address })

    const contractAddress = getContractAddress({
      from: sourceAccount.address,
      bytecode: Simple.bytecode,
      nonce,
      networkId: accounts[0].netId,
      verbose: true,
    })

    const { contractCreated } = await deploySimple(client)

    expect(contractAddress).toEqual(contractCreated)
  })
  test('deploy contract 20', async () => {
    const nonce = await getNextNonce(client, { address: sourceAccount.address })

    const contractAddress = getContractAddress({
      from: sourceAccount.address,
      bytecode: encodeDeployData({
        abi: Test20.abi,
        bytecode: Test20.bytecode,
        args: [sourceAccount.address],
      }),
      nonce,
      networkId: accounts[0].netId,
      verbose: true,
    })

    const { contractCreated } = await deployTest20(client)

    expect(contractAddress).toEqual(contractCreated)
  })

  test('deploy contract 721', async () => {
    const nonce = await getNextNonce(client, { address: sourceAccount.address })

    const contractAddress = getContractAddress({
      from: sourceAccount.address,
      bytecode: encodeDeployData({
        abi: Test721.abi,
        bytecode: Test721.bytecode,
        args: [sourceAccount.address],
      }),
      nonce,
      networkId: accounts[0].netId,
      verbose: true,
    })

    const { contractCreated } = await deployTest721(client)

    expect(contractAddress).toEqual(contractCreated)
  })

  test('simple test', async () => {
    expect(
      getContractAddress({
        from: sourceAccount.address,
        bytecode: Simple.bytecode,
        nonce: 1,
        networkId: accounts[0].netId,
        verbose: true,
      }),
    ).toMatchInlineSnapshot(
      `"NET201029:TYPE.CONTRACT:ACDUT7Y6R8AAKK6UA25XFFSFNB7A4C8PKEGRBVTN2W"`,
    )
    expect(
      getContractAddress({
        from: sourceAccount.address,
        bytecode: Simple.bytecode,
        nonce: 100,
        networkId: accounts[0].netId,
        verbose: true,
      }),
    ).toMatchInlineSnapshot(
      `"NET201029:TYPE.CONTRACT:ACGR21YUPRFM3CFDPUTMXN2S5Z68R0GMMJCBHZ1UWG"`,
    )
    expect(
      getContractAddress({
        from: sourceAccount.address,
        bytecode: Simple.bytecode,
        nonce: 100000,
        networkId: accounts[0].netId,
        verbose: true,
      }),
    ).toMatchInlineSnapshot(
      `"NET201029:TYPE.CONTRACT:ACFMW194P9JW4RBN55NCNBDC8H9VECF68A3S4UE5UY"`,
    )
  })
})
describe('create2', () => {
  const salt = 1111n
  test('self deploy create2', async () => {
    const { contractCreated: create2FactoryAddress } =
      await deployCreate2Factory(client)

    const { result } = await simulateContract(client, {
      address: create2FactoryAddress!,
      abi: Create2Factory.abi,
      functionName: 'deploy',
      args: [Create2Factory.bytecode, salt],
    })

    const contractAddress = getContractAddress({
      opcode: 'CREATE2',
      salt: salt,
      bytecode: Create2Factory.bytecode,
      networkId: accounts[0].netId,
      create2FactoryAddress: create2FactoryAddress!,
    })

    expect(result).toEqual(contractAddress)
  })

  test('pre deploy create2', async () => {
    const data = encodeDeployData({
      abi: Test20.abi,
      bytecode: Test20.bytecode,
      args: [sourceAccount.address],
    })

    const { result } = await simulateContract(client, {
      address: hexAddressToBase32({
        hexAddress: create2FactoryAddress,
        networkId: accounts[0].netId,
      })!,
      abi: Create2Factory.abi,
      functionName: 'deploy',
      args: [data, salt],
    })

    const contractAddress = getContractAddress({
      opcode: 'CREATE2',
      salt: salt,
      bytecode: data,
      networkId: accounts[0].netId,
    })

    expect(result).toEqual(contractAddress)
  })
})
