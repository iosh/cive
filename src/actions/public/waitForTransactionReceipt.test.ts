import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { WaitForTransactionReceiptTimeoutError } from '../../errors/transaction.js'
import { parseCFX, parseGDrip } from '../../utils/index.js'
import { wait } from '../../utils/wait.js'
import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getNextNonce } from './getNextNonce.js'
import { waitForTransactionReceipt } from './waitForTransactionReceipt.js'

const client = devConflux.getClient({ account: getTestAccount(accounts[0]) })
const sourceAccount = accounts[0]
const targetAccount = accounts[1]
let id: Timer
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  await mine(client, { blocks: 10 })
  setInterval(() => mine(client, { blocks: 1 }), 120)
})

afterAll(async () => {
  await devConflux.stop()
  clearInterval(id)
})
test('waits for transaction (send -> wait -> mine)', async () => {
  const hash = await sendTransaction(client, {
    to: targetAccount.base32Address,
    value: parseCFX('1'),
  })
  await mine(client, { numTxs: 1 })
  const { outcomeStatus } = await waitForTransactionReceipt(client, {
    hash,
    retryCount: 100,
  })

  expect(outcomeStatus).toBe('success')
})

test('waits for transaction (send -> mine -> wait)', async () => {
  const hash = await sendTransaction(client, {
    to: targetAccount.base32Address,
    value: parseCFX('1'),
  })
  await mine(client, { numTxs: 1 })
  const { outcomeStatus } = await waitForTransactionReceipt(client, {
    hash,
  })
  expect(outcomeStatus).toBe('success')
})

test('waits for transaction (multiple waterfall)', async () => {
  setTimeout(() => mine(client, { numTxs: 1 }), 500)

  const hash = await sendTransaction(client, {
    to: targetAccount.base32Address,
    value: parseCFX('1'),
  })

  const receipt_1 = await waitForTransactionReceipt(client, {
    hash,
  })
  const receipt_2 = await waitForTransactionReceipt(client, {
    hash,
  })
  const receipt_3 = await waitForTransactionReceipt(client, {
    hash,
  })
  const receipt_4 = await waitForTransactionReceipt(client, {
    hash,
  })

  expect(receipt_1).toEqual(receipt_2)
  expect(receipt_2).toEqual(receipt_3)
  expect(receipt_3).toEqual(receipt_4)
})

test('waits for transaction (multiple parallel)', async () => {
  setTimeout(() => mine(client, { numTxs: 1 }), 500)
  const hash = await sendTransaction(client, {
    to: targetAccount.base32Address,
    value: parseCFX('1'),
  })

  const [receipt_1, receipt_2, receipt_3, receipt_4] = await Promise.all([
    waitForTransactionReceipt(client, {
      hash,
    }),
    waitForTransactionReceipt(client, {
      hash,
    }),
    waitForTransactionReceipt(client, {
      hash,
    }),
    waitForTransactionReceipt(client, {
      hash,
    }),
  ])

  expect(receipt_1).toEqual(receipt_2)
  expect(receipt_2).toEqual(receipt_3)
  expect(receipt_3).toEqual(receipt_4)
})

describe('replaced transactions', () => {
  test('repriced', async () => {
    setTimeout(() => mine(client, { numTxs: 1 }), 500)

    const nonce = await getNextNonce(client, {
      address: sourceAccount.base32Address,
    })

    const hash = await sendTransaction(client, {
      to: targetAccount.base32Address,
      value: parseCFX('1'),
      maxFeePerGas: parseGDrip('10'),
      nonce,
    })

    let replacement: any
    const [receipt] = await Promise.all([
      waitForTransactionReceipt(client, {
        hash,
        onReplaced: (replacement_) => (replacement = replacement_),
        retryCount: 10,
      }),
      (async () => {
        await wait(100)

        // speed up
        await sendTransaction(client, {
          to: targetAccount.base32Address,
          value: parseCFX('1'),
          nonce,
          maxFeePerGas: parseGDrip('20'),
        })
      })(),
    ])

    expect(receipt !== null).toBeTruthy()
    expect(replacement.reason).toBe('repriced')
    expect(replacement.replacedTransaction).toBeDefined()
    expect(replacement.transaction).toBeDefined()
    expect(replacement.transactionReceipt).toBeDefined()
  })

  test('repriced (skipped blocks)', async () => {
    setTimeout(() => mine(client, { numTxs: 1 }), 500)
    const nonce = await getNextNonce(client, {
      address: sourceAccount.base32Address,
    })
    const hash = await sendTransaction(client, {
      to: targetAccount.base32Address,
      value: parseCFX('1'),
      maxFeePerGas: parseGDrip('10'),
      nonce,
    })

    const [receipt] = await Promise.all([
      waitForTransactionReceipt(client, {
        hash,
        retryCount: 15,
      }),
      (async () => {
        // speed up
        await sendTransaction(client, {
          to: targetAccount.base32Address,
          value: parseCFX('1'),
          maxFeePerGas: parseGDrip('20'),
          nonce,
        })
      })(),
    ])

    expect(receipt !== null).toBeTruthy()
  })

  test('cancelled', async () => {
    setTimeout(() => mine(client, { numTxs: 1 }), 500)
    const nonce = await getNextNonce(client, {
      address: sourceAccount.base32Address,
    })
    const hash = await sendTransaction(client, {
      to: targetAccount.base32Address,
      value: parseCFX('1'),
      maxFeePerGas: parseGDrip('10'),
      nonce,
    })

    let replacement: any
    const [receipt] = await Promise.all([
      waitForTransactionReceipt(client, {
        hash,
        onReplaced: (replacement_) => (replacement = replacement_),
        retryCount: 15,
      }),
      (async () => {
        await wait(20)

        // speed up
        await sendTransaction(client, {
          to: targetAccount.base32Address,
          value: parseCFX('2'),
          maxFeePerGas: parseGDrip('20'),
          nonce,
        })
      })(),
    ])
    expect(receipt !== null).toBeTruthy()
    expect(replacement.reason).toBe('replaced')
    expect(replacement.replacedTransaction).toBeDefined()
    expect(replacement.transaction).toBeDefined()
    expect(replacement.transactionReceipt).toBeDefined()
  })
})

describe('args: confirmations', () => {
  test('waits for confirmations', async () => {
    setTimeout(() => mine(client, { numTxs: 1 }), 500)
    const hash = await sendTransaction(client, {
      to: targetAccount.base32Address,
      value: parseCFX('1'),
      maxFeePerGas: parseGDrip('10'),
    })

    const receipt = await waitForTransactionReceipt(client, {
      hash,
      confirmations: 3,
      retryCount: 15,
    })

    expect(receipt !== null).toBeTruthy()
  })

  test('waits for confirmations (replaced)', async () => {
    setTimeout(() => mine(client, { numTxs: 1 }), 500)
    const nonce = await getNextNonce(client, {
      address: sourceAccount.base32Address,
    })

    const hash = await sendTransaction(client, {
      to: targetAccount.base32Address,
      value: parseCFX('1'),
      maxFeePerGas: parseGDrip('10'),
      nonce,
    })

    const [receipt] = await Promise.all([
      waitForTransactionReceipt(client, {
        confirmations: 3,
        hash,
        retryCount: 20,
      }),
      (async () => {
        await wait(20)

        // speed up
        await sendTransaction(client, {
          to: targetAccount.base32Address,
          value: parseCFX('1'),
          nonce,
          maxFeePerGas: parseGDrip('20'),
        })
      })(),
    ])
    expect(receipt !== null).toBeTruthy()
  })

  test('args: timeout', async () => {
    const hash = await sendTransaction(client, {
      to: targetAccount.base32Address,
      value: parseCFX('1'),
    })
    await expect(() =>
      waitForTransactionReceipt(client, {
        hash,
        timeout: 500,
      }),
    ).rejects.toThrowError(WaitForTransactionReceiptTimeoutError)
  })
})
