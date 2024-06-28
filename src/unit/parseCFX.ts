import { parseUnits } from './parseUnits.js'
import { cfxUnits } from '../constants/unit.js'

export function parseCFX(cfx: string, unit: 'drip' | 'gDrip' = 'drip') {
  return parseUnits(cfx, cfxUnits[unit])
}
