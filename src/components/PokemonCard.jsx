import { TYPE_COLORS } from "../utils/typeColors"
// Displays a single Pokémon — used in search results and team slots
export default function PokemonCard({ pokemon, onClick }) {
  // pokemon shape: { id, name, types: ['fire', 'flying'], sprite: url }

  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-gray-800 border border-gray-700 p-3 text-left hover:border-indigo-500 transition-colors active:scale-95 w-full"
    >
      <img src={pokemon.sprite} alt={pokemon.name} className="w-24 h-24 mx-auto object-contain"/>
      <p className="text-xs text-gray-500 text-center">#{String(pokemon.id).padStart(3, '0')}</p>
      <p className="text-sm font-semibold capitalize text-center mb-2">{pokemon.name}</p>
      <div className="flex gap-1 justify-center flex-wrap">
          {pokemon.types.map(t => (
            <span key={t} className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${TYPE_COLORS[t] ?? 'bg-gray-600'}`}>
              {t}
            </span>
          ))}
      </div>
      <p className="text-xs text-gray-500 text-center mt-1">Gen {pokemon.gen}</p>
      <div className="mt-2 space-y-0.5">
        {Object.entries(pokemon.stats).map(([stat, value]) => (
          <div key={stat} className="flex items-center gap-1">
            <span className="text-xs text-gray-500 w-10 shrink-0 uppercase">{stat}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-1">
              <div
                className="bg-indigo-500 h-1 rounded-full"
                style={{ width: `${Math.min(value / 255 * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-6 text-right">{value}</span>
          </div>
        ))}
      </div>

    </button>
  )
}
