import { describe, expect, test } from 'vitest'

import { getAddress } from './getAddress.js'
import { accounts } from '~test/src/constants.js'

test('cfx address', () => {
  expect(
    'cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fd2xr1kenu2',
  ).toMatchInlineSnapshot(`"cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fd2xr1kenu2"`)

  expect(
    'CFX:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FD2XR1KENU2',
  ).toMatchInlineSnapshot(
    `"CFX:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FD2XR1KENU2"`,
  )

  expect(
    'cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fcehf0crkg1',
  ).toMatchInlineSnapshot(`"cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fcehf0crkg1"`)

  expect(
    'CFX:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FCEHF0CRKG1',
  ).toMatchInlineSnapshot(
    `"CFX:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FCEHF0CRKG1"`,
  )
  expect(
    'cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fdjuyu7dwxj',
  ).toMatchInlineSnapshot(`"cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fdjuyu7dwxj"`)

  expect(
    'CFX:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FDJUYU7DWXJ',
  ).toMatchInlineSnapshot(
    `"CFX:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FDJUYU7DWXJ"`,
  )
})

test('cfxtest address', () => {
  expect(
    'cfxtest:aajp88pjc5mnxspgrrkxb5zerjpdun3fd23ge3cbyw',
  ).toMatchInlineSnapshot(
    `"cfxtest:aajp88pjc5mnxspgrrkxb5zerjpdun3fd23ge3cbyw"`,
  )

  expect(
    'CFXTEST:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FD23GE3CBYW',
  ).toMatchInlineSnapshot(
    `"CFXTEST:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FD23GE3CBYW"`,
  )

  expect(
    'cfxtest:aajp88pjc5mnxspgrrkxb5zerjpdun3fcersfwndc7',
  ).toMatchInlineSnapshot(
    `"cfxtest:aajp88pjc5mnxspgrrkxb5zerjpdun3fcersfwndc7"`,
  )

  expect(
    'CFXTEST:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FCERSFWNDC7',
  ).toMatchInlineSnapshot(
    `"CFXTEST:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FCERSFWNDC7"`,
  )

  expect(
    'cfxtest:aajp88pjc5mnxspgrrkxb5zerjpdun3fdj49drf21c',
  ).toMatchInlineSnapshot(
    `"cfxtest:aajp88pjc5mnxspgrrkxb5zerjpdun3fdj49drf21c"`,
  )

  expect(
    'CFXTEST:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FDJ49DRF21C',
  ).toMatchInlineSnapshot(
    `"CFXTEST:TYPE.USER:AAJP88PJC5MNXSPGRRKXB5ZERJPDUN3FDJ49DRF21C"`,
  )
})

test('net address', () => {
  expect(accounts[0].base32Address).toMatchInlineSnapshot(
    `"net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x"`,
  )
  expect(accounts[1].base32Address).toMatchInlineSnapshot(
    `"net201029:aamx7s8g19hs0zg2793wkv6bfefkmng0bubdy0txaa"`,
  )
  expect(accounts[2].base32Address).toMatchInlineSnapshot(
    `"net201029:aas350p711z3zn9zyc57trh4hdp88erdvyan0hnmds"`,
  )
  expect(accounts[3].base32Address).toMatchInlineSnapshot(
    `"net201029:aamyr3kc7d4j9ch2h9t96czmyra5yme6njbzdtv67w"`,
  )
  expect(accounts[4].base32Address).toMatchInlineSnapshot(
    `"net201029:aam5ys3wbyk1r31864udmpu2a7rjxm4e12nx9fr12s"`,
  )
  expect(accounts[5].base32Address).toMatchInlineSnapshot(
    `"net201029:aat3d7dgv959xbj8u4jhhh5bt14kk2g5ejvvcm842d"`,
  )
  expect(accounts[6].base32Address).toMatchInlineSnapshot(
    `"net201029:aaru84xbk8f3vzfvn51th0zs69rdrmkbhyjuxp9cd1"`,
  )
})

describe('errors', () => {
  test('invalid address', () => {
    expect(() =>
      getAddress('cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fd2'),
    ).toThrowError(`Address "cfx:aajp88pjc5mnxspgrrkxb5zerjpdun3fd2" is invalid.`)
    expect(() =>
      getAddress('net201029:aaru84xbk8f3vzfvn51th0zs69rdrmkbhyjuxp'),
    ).toThrowError(`Address "net201029:aaru84xbk8f3vzfvn51th0zs69rdrmkbhyjuxp"`)
    expect(() =>
      getAddress('cfxtest:aajp88pjc5mnxspgrrkxb5zerjpdun3fdj49drf'),
    ).toThrowError(`Address "cfxtest:aajp88pjc5mnxspgrrkxb5zerjpdun3fdj49drf"`)
  })
})
