import { TYPE_COLORS } from "../utils/typeColors"

const STAT_LABELS = { hp: 'HP', atk: 'Atk', def: 'Def', spatk: 'SpA', spdef: 'SpD', speed: 'Spe' }

const STAT_COLORS = {
  hp:    'bg-red-500',
  atk:   'bg-orange-500',
  def:   'bg-yellow-500',
  spatk: 'bg-blue-500',
  spdef: 'bg-green-500',
  speed: 'bg-pink-500',
}

export default function TeamSlot({ pokemon, onRemove }) {
  if (!pokemon) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-700 h-32 flex items-center justify-center text-gray-600 text-sm">
        Empty slot
      </div>
    )
  }
  // Get base stat total
  const bst = Object.values(pokemon.stats).reduce((sum, v) => sum + v, 0)

  return (
    <div className="rounded-xl bg-gray-800 border border-gray-700 p-3 relative flex flex-col items-center">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 text-sm"
      >
        ✕
      </button>

      <img src={pokemon.sprite} alt={pokemon.name} className="w-24 h-24 object-contain" loading="lazy" />

      <p className="text-xs text-gray-500">#{String(pokemon.id).padStart(3, '0')} · Gen {pokemon.gen}</p>
      <p className="font-semibold capitalize text-center">{pokemon.name}</p>

      <div className="flex gap-1 mt-1 mb-3">
        {pokemon.types.map(t => (
          <span key={t} className={`text-xs px-2 py-0.5 rounded-full text-white font-medium capitalize ${TYPE_COLORS[t] ?? 'bg-gray-600'}`}>
            {t}
          </span>
        ))}
      </div>

      <div className="w-full space-y-1">
        {Object.entries(pokemon.stats).map(([stat, value]) => (
          <div key={stat} className="flex items-center gap-1">
            <span className="text-xs text-gray-500 w-8 shrink-0">{STAT_LABELS[stat]}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-1.5">
              <div
                className={`${STAT_COLORS[stat]} h-1.5 rounded-full`}
                style={{ width: `${Math.min(value / 255 * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-7 text-right">{value}</span>
          </div>
        ))}
        <p className="text-xs text-gray-500 text-right pt-0.5">BST {bst}</p>
      </div>
    </div>
  )
}
