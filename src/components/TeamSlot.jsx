import { TYPE_COLORS } from "../utils/typeColors"
// A single slot in the 6-Pokémon team
export default function TeamSlot({ pokemon, onRemove }) {
  if (!pokemon) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-700 h-32 flex items-center justify-center text-gray-600 text-sm">
        Empty slot
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-gray-800 border border-gray-700 p-3 relative">
      <img src={pokemon.sprite} alt={pokemon.name} className="w-28 h-28 object-contain" />
      <p className="text-xs text-gray-500">#{String(pokemon.id).padStart(3, '0')}</p>
      <p className="font-semibold capitalize mb-1">{pokemon.name}</p>
      <div className="flex gap-1">
        {pokemon.types.map(t => (
          <span key={t} className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${TYPE_COLORS[t] ?? 'bg-gray-600'}`}>
            {t}
          </span>
        ))}
      </div>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 text-xs"
      >
        ✕
      </button>
    </div>
  )
}
