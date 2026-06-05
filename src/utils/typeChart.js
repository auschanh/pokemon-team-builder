// Full 18-type effectiveness matrix
// effectiveness[attackingType][defendingType] = multiplier (0, 0.5, 1, or 2)
export const TYPE_NAMES = [
  'normal','fire','water','electric','grass','ice',
  'fighting','poison','ground','flying','psychic','bug',
  'rock','ghost','dragon','dark','steel','fairy',
]

// TODO: fill in the effectiveness chart
// Each key is an attacking type; each nested key is a defending type.
// Values: 0 = immune, 0.5 = not very effective, 1 = normal, 2 = super effective
export const effectiveness = {}

// Returns the damage multiplier when `attackType` hits a Pokémon with `defenseTypes` (array)
export function getEffectiveness(attackType, defenseTypes) {
  return defenseTypes.reduce((mult, defType) => {
    return mult * (effectiveness[attackType]?.[defType] ?? 1)
  }, 1)
}

// Returns an object mapping each attacking type to its max effectiveness against the given types
export function getOffensiveCoverage(defenseTypes) {
  return Object.fromEntries(
    TYPE_NAMES.map((t) => [t, getEffectiveness(t, defenseTypes)])
  )
}
