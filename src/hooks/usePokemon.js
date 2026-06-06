import { useState, useCallback, useRef } from 'react'

const cache = {}

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
          sprite: data.sprites.other['official-artwork'].front_default
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
