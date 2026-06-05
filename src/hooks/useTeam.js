import { useState } from 'react'

const MAX_TEAM_SIZE = 6

export function useTeam() {
  const [team, setTeam] = useState([])

  function addPokemon(pokemon) {
    // TODO: add pokemon to team (max 6, no duplicates)
  }

  function removePokemon(id) {
    // TODO: remove pokemon from team by id
  }

  return { team, addPokemon, removePokemon }
}
