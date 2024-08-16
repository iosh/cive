import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '../../../test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { Create2Factory } from '../../../test/src/contracts/Create2Factory.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { Test712 } from '../../../test/src/contracts/Test721.js'
import { Test1155 } from '../../../test/src/contracts/Test1155.js'
import { deployCreate2Factory, deployTest20 } from '../../../test/src/utils.js'
import { getNextNonce, simulateContract } from '../../actions/index.js'
import { sayHelloLocalNode } from '../../actions/localNode/sayHelloLocalNode.js'
import { create2FactoryAddress } from '../../constants/contract.js'
import { encodeDeployData } from '../abi/encodeDeployData.js'
import { getContractAddress } from './getContractAddress.js'
import { hexAddressToBase32 } from './hexAddressToBase32.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({
  account: sourceAccount,
})

beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

describe('create', () => {
  test('deploy contract', async () => {
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

  test('simple test', async () => {
    expect(
      getContractAddress({
        from: sourceAccount.address,
        bytecode: encodeDeployData({
          abi: Test20.abi,
          bytecode: Test20.bytecode,
          args: [sourceAccount.address],
        }),
        nonce: 1,
        networkId: accounts[0].netId,
        verbose: true,
      }),
    ).toMatchInlineSnapshot(
      `"NET201029:TYPE.CONTRACT:ACGN3EWKZ66RTH0UVJC25R3VRUJEBC71DP16X2UBY7"`,
    )
    expect(
      getContractAddress({
        from: sourceAccount.address,
        bytecode: encodeDeployData({
          abi: Test712.abi,
          bytecode: Test712.bytecode,
          args: [sourceAccount.address],
        }),
        nonce: 2,
        networkId: accounts[0].netId,
        verbose: true,
      }),
    ).toMatchInlineSnapshot(
      `"NET201029:TYPE.CONTRACT:ACDX8JGH6T2UUB5J3G3F3YBKX03EKW55J63HDNMKFJ"`,
    )
    expect(
      getContractAddress({
        from: sourceAccount.address,
        bytecode: encodeDeployData({
          abi: Test1155.abi,
          bytecode: Test1155.bytecode,
          args: [sourceAccount.address],
        }),
        nonce: 3,
        networkId: accounts[0].netId,
        verbose: true,
      }),
    ).toMatchInlineSnapshot(
      `"NET201029:TYPE.CONTRACT:ACB9P2SHBXR8S22E0WJCY9DMK9SNF7766U8YDW96S9"`,
    )
    expect(
      getContractAddress({
        from: sourceAccount.address,
        bytecode: encodeDeployData({
          abi: Test20.abi,
          bytecode: Test20.bytecode,
          args: [sourceAccount.address],
        }),
        nonce: 4,
        networkId: accounts[0].netId,
        verbose: true,
      }),
    ).toMatchInlineSnapshot(
      `"NET201029:TYPE.CONTRACT:ACHR66JYCR2KH3NYR3947KHZJ219R1A92PYJU66J6Y"`,
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
      from: sourceAccount.address,
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
      from: sourceAccount.address,
      bytecode: data,
      networkId: accounts[0].netId,
    })

    expect(result).toEqual(contractAddress)
  })
})
