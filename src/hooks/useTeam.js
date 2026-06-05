import { useState } from 'react'

const MAX_TEAM_SIZE = 6

export function useTeam() {
  const [team, setTeam] = useState([])

  function addPokemon(pokemon) {
    if (team.length >= MAX_TEAM_SIZE){
      return `Team is at max size of ${MAX_TEAM_SIZE}`
    } else if (team.some(p => p.id === pokemon.id)){
      return `Team already contains ${pokemon.name}`
    }
    setTeam(prevTeam => [...prevTeam, pokemon]);
  }

  function removePokemon(id) {
    // TODO: remove pokemon from team by id
  }

  return { team, addPokemon, removePokemon }
}
