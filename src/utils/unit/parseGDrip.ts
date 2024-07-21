import { gDripUnits } from '../../constants/unit.js'
import { parseUnits } from './parseUnits.js'

export function parseGDrip(cfx: string, unit: 'drip' = 'drip') {
  return parseUnits(cfx, gDripUnits[unit])
}
