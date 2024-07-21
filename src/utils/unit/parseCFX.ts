import { cfxUnits } from '../../constants/unit.js'
import { parseUnits } from './parseUnits.js'

export function parseCFX(cfx: string, unit: 'drip' | 'gDrip' = 'drip') {
  return parseUnits(cfx, cfxUnits[unit])
}
