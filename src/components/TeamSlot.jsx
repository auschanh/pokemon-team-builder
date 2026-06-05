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
      {/* TODO: show sprite, name, types, and a remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 text-xs"
      >
        ✕
      </button>
      <p className="capitalize font-medium">{pokemon.name}</p>
    </div>
  )
}
