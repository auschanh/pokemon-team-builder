import SearchBar from './components/SearchBar'
import TeamBuilder from './components/TeamBuilder'
import TypeCoverage from './components/TypeCoverage'
import { useTeam } from './hooks/useTeam'
import pokeballLogo from '../public/pokeball.png'
import { useEffect } from 'react'

export default function App() {
  const { team, addPokemon, removePokemon } = useTeam()

  // check addPokemon and removePokemon
  useEffect(() => {
    console.log('team updated', team)
  }, [team]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        {/* Home Logo */}
        <div className='flex flex-items-center gap-4'>
          <a href="/" aria-label="Home">
            <img src={pokeballLogo} className='h-10 hover:scale-110' alt="pokeball" />
          </a>
          <h1 className="text-2xl font-bold tracking-tight">Pokémon Team Builder</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <button
          onClick={() => {
            const msg = addPokemon({ id: 1, name: 'bulbasaur'})
            if (msg) console.log(msg)
            }}
          className='bg-indigo-600 px-4 py-2 rounded active:scale-95 transition-transform cursor-pointer'
        >
          Test: Add a Bulbasaur
        </button>
        <SearchBar onSelect={addPokemon} />
        <TeamBuilder team={team} onRemove={removePokemon} />
        <TypeCoverage team={team} />
      </main>
    </div>
  )
}
