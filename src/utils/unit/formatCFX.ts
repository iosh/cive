import { cfxUnits } from '../../constants/unit.js'
import { formatUnits } from './formatUnits.js'

export function formatCFX(drip: bigint, unit: 'drip' | 'gDrip' = 'drip') {
  return formatUnits(drip, cfxUnits[unit])
}
