import { useState, useCallback } from 'react'

const cache = {}

export function usePokemon() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (query) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      // TODO: fetch from PokéAPI and populate results
      // Hint: GET https://pokeapi.co/api/v2/pokemon/{name}
      // Cache responses in the `cache` object above
      setResults([])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, search }
}
