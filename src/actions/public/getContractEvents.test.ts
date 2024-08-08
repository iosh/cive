import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { deployTest20 } from '../../../test/src/utils.js'
import type { Address } from '../../accounts/types.js'
import { formatGDrip, formatUnits, parseUnits } from '../../utils/index.js'
import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { writeContract } from '../wallet/writeContract.js'
import { getContractEvents } from './getContractEvents.js'

let test20Address: Address
const client = devConflux.getClient({ account: getTestAccount(accounts[0]) })
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  const { contractCreated } = await deployTest20(client)
  test20Address = contractCreated!
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'mint',
    args: [accounts[0].base32Address, parseUnits('1000', 18)],
  })
  await mine(client, { numTxs: 1 })
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  await mine(client, { blocks: 1 })

  const logs = await getContractEvents(client, {
    abi: Test20.abi,
  })

  expect(logs.length).toMatchInlineSnapshot('1')

  expect(logs[0].eventName).toMatchInlineSnapshot(`"Transfer"`)

  expect(logs[0].args).toMatchInlineSnapshot(`
    {
      "from": "net201029:aajaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadput7khz",
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "value": 1000000000000000000000n,
    }
  `)
})

test('args: address', async () => {
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'transfer',
    args: [accounts[1].base32Address, parseUnits('1', 18)],
  })
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'transfer',
    args: [accounts[1].base32Address, parseUnits('1', 18)],
  })
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'approve',
    args: [accounts[1].base32Address, parseUnits('1', 18)],
  })

  await mine(client, { numTxs: 3 })

  const logs = await getContractEvents(client, {
    abi: Test20.abi,
    address: test20Address,
  })

  expect(logs.length).toMatchInlineSnapshot('4')
  expect(logs[0].eventName).toMatchInlineSnapshot(`"Transfer"`)
  expect(logs[0].args).toMatchInlineSnapshot(`
    {
      "from": "net201029:aajaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadput7khz",
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "value": 1000000000000000000000n,
    }
  `)

  expect(logs[1].eventName).toMatchInlineSnapshot(`"Transfer"`)
  expect(logs[1].args).toMatchInlineSnapshot(`
    {
      "from": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "to": "net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa",
      "value": 1000000000000000000n,
    }
  `)
})

test('args: abi', async () => {
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'transfer',
    args: [accounts[1].base32Address, parseUnits('1', 18)],
  })
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'transfer',
    args: [accounts[1].base32Address, parseUnits('1', 18)],
  })
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'transfer',
    args: [accounts[1].base32Address, parseUnits('1', 18)],
  })
  await mine(client, { numTxs: 3 })

  const logs = await getContractEvents(client, {
    abi: Test20.abi,
  })
  expect(logs.length).toBe(7)
})

test('args: args', async () => {
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'transfer',
    args: [accounts[1].base32Address, parseUnits('1', 18)],
  })
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'transfer',
    args: [accounts[1].base32Address, parseUnits('1', 18)],
  })
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'transfer',
    args: [accounts[1].base32Address, parseUnits('1', 18)],
  })
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'approve',
    args: [accounts[1].base32Address, parseUnits('1', 18)],
  })
  await mine(client, { numTxs: 4 })

  const logs = await getContractEvents(client, {
    abi: Test20.abi,
    args: {
      from: accounts[0].base32Address,
      to: accounts[1].base32Address,
    },
  })

  expect(logs.length).toBe(11)
})

test('args: eventName', async () => {
  const logs = await getContractEvents(client, {
    abi: Test20.abi,
    eventName: 'Approval',
  })

  expect(logs.length).toBe(2)
  expect(logs[0].eventName).toMatchInlineSnapshot(`"Approval"`)
  expect(logs[1].eventName).toMatchInlineSnapshot(`"Approval"`)
  expect(logs[0].args).toMatchInlineSnapshot(`
    {
      "owner": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "spender": "net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa",
      "value": 1000000000000000000n,
    }
  `)
  expect(logs[1].args).toMatchInlineSnapshot(`
    {
      "owner": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "spender": "net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa",
      "value": 1000000000000000000n,
    }
  `)
})

test('args: event +args', async () => {
  const logs = await getContractEvents(client, {
    abi: Test20.abi,
    eventName: 'Approval',
    args: {
      spender: accounts[1].base32Address,
    },
  })

  expect(logs.length).toBe(2)
  expect(logs[0].eventName).toMatchInlineSnapshot(`"Approval"`)
  expect(logs[1].eventName).toMatchInlineSnapshot(`"Approval"`)
  expect(logs[0].args).toMatchInlineSnapshot(`
    {
      "owner": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "spender": "net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa",
      "value": 1000000000000000000n,
    }
  `)
  expect(logs[1].args).toMatchInlineSnapshot(`
    {
      "owner": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "spender": "net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa",
      "value": 1000000000000000000n,
    }
  `)
})

test('args: epoch', async () => {
  const epochTagLogs = await getContractEvents(client, {
    abi: Test20.abi,
    fromEpoch: 'latest_state',
    toEpoch: 'latest_state',
  })

  expect(epochTagLogs.length).toMatchInlineSnapshot('11')

  const epochNumberLogs = await getContractEvents(client, {
    abi: Test20.abi,
    fromEpoch: 1n,
    toEpoch: 10n,
  })
  expect(epochNumberLogs.length).toMatchInlineSnapshot('11')
})

test('args: block', async () => {
  const logs = await getContractEvents(client, {
    abi: Test20.abi,
    fromBlock: 1n,
    toBlock: 10n,
  })
  expect(logs.length).toMatchInlineSnapshot('1')
})
