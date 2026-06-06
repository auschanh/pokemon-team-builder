import { useState } from 'react'

const MAX_TEAM_SIZE = 6

export function useTeam() {
  const [team, setTeam] = useState([])
  const [error, setError] = useState(null)

  function addPokemon(pokemon) {
    if (team.length >= MAX_TEAM_SIZE){
      setError(`Team is at max size of ${MAX_TEAM_SIZE}`)
      return
    } 
    if (team.some(p => p.id === pokemon.id)){
      setError(`Team already contains ${pokemon.name}`)
      return
    }
    setError(null)
    setTeam(prevTeam => [...prevTeam, pokemon]);
  }

  function removePokemon(id) {
    setError(null)
    setTeam(prevTeam => prevTeam.filter(p => p.id !== id));
  }

  return { team, error, addPokemon, removePokemon }
}
