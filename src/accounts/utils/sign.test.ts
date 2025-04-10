import { expect, test } from 'vitest'
import { accounts } from '~test/src/constants.js'
import { sign } from './sign.js'

test('default', async () => {
  expect(
    await sign({
      hash: '0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68',
      privateKey: accounts[0].privateKey,
    }),
  ).toMatchInlineSnapshot(
    `
    {
      "r": "0x32e8275f9adae1f82b50798f9945592cc992c0610dc87c0a93f1cec69c93400a",
      "s": "0x1e906b33e9010c219b67db92b77ba0cc6b0e1a5f633132a0d845f62c3733e0df",
      "v": 0n,
    }
  `,
  )
})
