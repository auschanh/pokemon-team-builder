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
export const effectiveness = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5},
  fire:   { fire: 0.5, water: 0.5, grass: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2},
  water:  { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5},
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5},
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5},
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5},
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, dark: 2, steel: 2, fairy: 0.5},
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2},
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2},
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5},
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5},
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, ice: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
}

// Returns the damage multiplier when `attackType` hits a Pokémon with `defenseTypes` (array)
export function getEffectiveness(attackType, defenseTypes) {
  return defenseTypes.reduce((mult, defType) => {
    return mult * (effectiveness[attackType]?.[defType] ?? 1)
  }, 1)
}

// Defensive: given a Pokémon's types, returns how every attacking type fares against it.
// e.g. getIncomingEffectiveness(['fire', 'flying']) → { rock: 4, water: 2, ground: 0, ... }
export function getIncomingEffectiveness(defenseTypes) {
  return Object.fromEntries(
    TYPE_NAMES.map((t) => [t, getEffectiveness(t, defenseTypes)])
  )
}

// Offensive: given an attacking type, returns how effective it is against every possible defending type.
// e.g. getOutgoingEffectiveness('fire') → { grass: 2, steel: 2, water: 0.5, ... }
export function getOutgoingEffectiveness(attackType) {
  return Object.fromEntries(
    TYPE_NAMES.map((defType) => [defType, getEffectiveness(attackType, [defType])])
  )
}
