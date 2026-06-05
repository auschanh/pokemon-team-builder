import SearchBar from './components/SearchBar'
import TeamBuilder from './components/TeamBuilder'
import TypeCoverage from './components/TypeCoverage'
import { useTeam } from './hooks/useTeam'

export default function App() {
  const { team, addPokemon, removePokemon } = useTeam()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">Pokémon Team Builder</h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <SearchBar onSelect={addPokemon} />
        <TeamBuilder team={team} onRemove={removePokemon} />
        <TypeCoverage team={team} />
      </main>
    </div>
  )
}
