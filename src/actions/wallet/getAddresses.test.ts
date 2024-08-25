import { expect, test, vi } from 'vitest'
import { accounts } from '~test/src/constants.js'
import { provider } from '../../../test/src/provider/index.js'
import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import { localhostNode } from '../../chains/definitions/localhost.js'
import { createClient } from '../../clients/createClient.js'
import { custom } from '../../clients/transports/custom.js'
import { http } from '../../clients/transports/http.js'
import { getAddresses } from './getAddresses.js'

test('mock rpc', async () => {
  const client = createClient({
    chain: localhostNode,
    transport: http(),
  })
  client.request = vi.fn(async () => {
    return [accounts[1].base32Address] as any
  })
  expect(await getAddresses(client)).toMatchInlineSnapshot(`
    [
      "net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa",
    ]
  `)
})

test('local account', async () => {
  const client = createClient({
    account: privateKeyToAccount(accounts[0].privateKey, {
      networkId: accounts[0].netId,
    }),
    chain: localhostNode,
    transport: http(),
  })

  expect(await getAddresses(client)).toMatchInlineSnapshot(`
    [
      "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
    ]
  `)
})

test('json-rpc account', async () => {
  const client = createClient({
    account: accounts[0].base32Address,
    chain: localhostNode,
    transport: custom(provider),
  })

  expect(await getAddresses(client)).toMatchInlineSnapshot(`
    [
      "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa",
      "net201029:aas350p711z3zn9zyc57trh4hdp88erdvyan0hnmds",
      "net201029:aamyr3kc7d4j9ch2h9t96czmyra5yme6njbzdtv67w",
      "net201029:aam5ys3wbyk1r31864udmpu2a7rjxm4e12nx9fr12s",
      "net201029:aat3d7dgv959xbj8u4jhhh5bt14kk2g5ejvvcm842d",
      "net201029:aaru84xbk8f3vzfvn51th0zs69rdrmkbhyjuxp9cd1",
      "net201029:aat8z345h5caymd1yud1bud1cv4tc71h52m8y4s509",
      "net201029:aaj37d934v6ezne422mma7hp878r3g0djavkw4kucz",
      "net201029:aasx0w0rxyyv9esazsz27c29a7jujttj4j007me0pv",
    ]
  `)
})
