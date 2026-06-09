import { useState, useCallback, useRef } from 'react'

const cache = {}

function getGen(id) {
  if (id <= 151)  return 1
  if (id <= 251)  return 2
  if (id <= 386)  return 3
  if (id <= 493)  return 4
  if (id <= 649)  return 5
  if (id <= 721)  return 6
  if (id <= 809)  return 7
  if (id <= 905)  return 8
  return 9
}

export function usePokemon() {
  // API call to pokeapi.co
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const debounceTimer = useRef(null)

  const search = useCallback(async (query) => {
    clearTimeout(debounceTimer.current) // cancels previous timer
    debounceTimer.current = setTimeout(async () => {
        if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Check if Pokemon exists in cache
        if (cache[query]){
          setResults([cache[query]])
          return
        }
        // Fetch pokemon data
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
        if(!response.ok) throw new Error(`No Pokemon found for "${query}"`)
        const data = await response.json()

        // Normalize data (API gives A LOT of data)
        const normalized = {
          id: data.id,
          name: data.name,
          types: data.types.map(t => t.type.name),
          sprite: data.sprites.other['official-artwork'].front_default,
          stats: {
            hp: data.stats[0].base_stat,
            atk: data.stats[1].base_stat,
            def: data.stats[2].base_stat,
            spatk: data.stats[3].base_stat,
            spdef: data.stats[4].base_stat,
            speed: data.stats[5].base_stat,
          },
          gen: getGen(data.id),
        }
        cache[query] = normalized
        setResults([normalized])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 400)
    
  }, [])

  return { results, loading, error, search }
}
