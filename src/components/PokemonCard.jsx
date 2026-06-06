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
    </button>
  )
}
