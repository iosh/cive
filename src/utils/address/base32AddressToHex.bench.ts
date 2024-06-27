import { decode } from '@conflux-dev/conflux-address-js'
import { bench } from 'vitest'
import { base32AddressToHex } from './base32AddressToHex.js'
bench('base32AddressToHex', () => {
  const base32Address = 'net7876:aamue88kha4th1am7t3uvt94kr18t02xhac258u0wc'
  base32AddressToHex({
    address: base32Address,
  })
})

bench('decode base32AddressToHex decode', () => {
  const base32Address = 'net7876:aamue88kha4th1am7t3uvt94kr18t02xhac258u0wc'
  decode(base32Address)
})
