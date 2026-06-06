import { useState } from 'react'
import { usePokemon } from '../hooks/usePokemon'
import PokemonCard from './PokemonCard'

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('')
  const { results, loading, error: searchError, search } = usePokemon()

  function handleChange(e) {
    setQuery(e.target.value)
    search(e.target.value)
  }

  function handleSelect(pokemon) {
    onSelect(pokemon)
    setQuery('')
    search('')
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search Pokémon by name…"
        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {loading && <p className="text-gray-400 text-sm">Searching…</p>}
      {searchError && <p className="text-red-400 text-sm">{searchError}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {results.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={() => handleSelect(pokemon)} />
        ))}
      </div>
    </div>
  )
}
