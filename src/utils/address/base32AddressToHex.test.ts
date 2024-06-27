import { describe, expect, test } from 'vitest'

import { decode } from '@conflux-dev/conflux-address-js'
import { base32AddressToHex } from './base32AddressToHex.js'

import { bytesToHex } from 'viem'
import type { Address } from '../../accounts/types.js'

const mainNetworkBase32Addresses = [
  'cfx:aarc9abycue0hhzgyrr53m6cxedgccrmmyybjgh4xg',
  'CFX:TYPE.USER:AARC9ABYCUE0HHZGYRR53M6CXEDGCCRMMYYBJGH4XG',
  'cfx:aajg4wt2mbmbb44sp6szd783ry0jtad5bea80xdy7p',
  'CFX:TYPE.USER:AAJG4WT2MBMBB44SP6SZD783RY0JTAD5BEA80XDY7P',
  'cfx:acag4wt2mbmbb44sp6szd783ry0jtad5bex25t8vc9',
  'CFX:TYPE.CONTRACT:ACAG4WT2MBMBB44SP6SZD783RY0JTAD5BEX25T8VC9',
] as const

const testNetworkBase32Addresses = [
  'cfxtest:aan6jzja3gkvas5tm1j9uc623fj85j45hu6ec5g92p',
  'cfxtest:aasbu655bea2khk45ws7wm1m15t3251peyyxu0jf9u',
  'cfxtest:aak0h6jhye4jgf8be5credzt2gtgb708xjpuy2rjr1',
  'CFXTEST:TYPE.USER:AAMSC9WYG1E3UK0NFY5512HB1X8860HJGPMHUXV9YB',
  'cfxtest:aamsc9wyg1e3uk0nfy5512hb1x8860hja6xa46crba',
  'CFXTEST:TYPE.USER:AAMSC9WYG1E3UK0NFY5512HB1X8860HJA6XA46CRBA',
  'CFXTEST:TYPE.USER:AAKSC9WYG1E3UK0NFY5512HB1X8860HJA6XSSB9F51',
] as const

const customNetworkBase32Addresses = [
  'net10086:aaag4wt2mbmbb44sp6szd783ry0jtad5benr1ap5gp',
  'net9999:aara9vcg9zwf55yjb831b47c5ax4jgr6auddessxsz',
  'net9999:aamue88kha4th1am7t3uvt94kr18t02xha4fm5gjbg',
  'net9999:aajg4wt2mbmbb44sp6szd783ry0jtad5bea7etkeak',
  'net7876:aarc9abycue0hhzgyrr53m6cxedgccrmmyp9n95y7h',
  'net7876:aamue88kha4th1am7t3uvt94kr18t02xhac258u0wc',
]
describe('cover base32 address to hex', () => {
  test('main network', () => {
    for (let index = 0; index < mainNetworkBase32Addresses.length; index++) {
      const base32Address = mainNetworkBase32Addresses[index]
      expect(
        base32AddressToHex({
          address: base32Address as Address,
        }),
      ).toEqual(bytesToHex(decode(base32Address).hexAddress))
    }
  })
  test('test network', () => {
    for (let index = 0; index < testNetworkBase32Addresses.length; index++) {
      const base32Address = testNetworkBase32Addresses[index]
      expect(
        base32AddressToHex({
          address: base32Address as Address,
        }),
      ).toEqual(bytesToHex(decode(base32Address).hexAddress))
    }
  })

  test('custom network', () => {
    for (let index = 0; index < customNetworkBase32Addresses.length; index++) {
      const base32Address = customNetworkBase32Addresses[index]
      expect(
        base32AddressToHex({
          address: base32Address as Address,
        }),
      ).toEqual(bytesToHex(decode(base32Address).hexAddress))
    }
  })
})
