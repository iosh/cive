import { gDripUnits } from '../../constants/unit.js'
import { formatUnits } from './formatUnits.js'

export function formatGDrip(drip: bigint, unit: 'drip' = 'drip') {
  return formatUnits(drip, gDripUnits[unit])
}
