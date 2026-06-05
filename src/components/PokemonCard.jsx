// Displays a single Pokémon — used in search results and team slots
export default function PokemonCard({ pokemon, onClick }) {
  // pokemon shape: { id, name, types: ['fire', 'flying'], sprite: url }

  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-gray-800 border border-gray-700 p-3 text-left hover:border-indigo-500 transition-colors"
    >
      {/* TODO: render sprite, name, and type badges */}
      <p className="text-sm font-medium capitalize">{pokemon?.name ?? '???'}</p>
    </button>
  )
}
