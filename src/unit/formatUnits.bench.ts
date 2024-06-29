import { bench, describe } from 'vitest'

import { Drip } from 'js-conflux-sdk'
import { formatUnits } from './formatUnits.js'

describe('Format Unit', () => {
  bench('viem: `formatUnits`', () => {
    formatUnits(40000000000000000000n, 18)
  })

  bench('js-conflux-sdk : `drip to cfx`', () => {
    new Drip(40000000000000000000n).toCFX()
  })
})
