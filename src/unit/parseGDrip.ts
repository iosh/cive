import { parseUnits } from './parseUnits.js'
import { gDripUnits } from '../constants/unit.js'

export function parseGDrip(cfx: string, unit: 'drip' = 'drip') {
  return parseUnits(cfx, gDripUnits[unit])
}
