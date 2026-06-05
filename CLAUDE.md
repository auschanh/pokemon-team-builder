# Pokémon Team Builder

## Project Overview
A polished, single-page React app for building a Pokémon team of 6 with type coverage analysis.
Pure frontend — no backend, no auth. Data from PokéAPI. Deploy to Vercel.

## Stack
- **React** (Vite)
- **Tailwind CSS** + **Shadcn/ui**
- **PokéAPI** — https://pokeapi.co (free, no API key needed)
- **Vercel** for deployment

## Features
1. **Pokémon Search** — search by name, filter by generation or type
2. **Team Slots** — up to 6 Pokémon, add/remove freely
3. **Type Coverage Analysis** — show offensive coverage and defensive weaknesses for the full team
4. **Pokémon Detail View** — base stats, moves, abilities, sprite

## File Structure (target)
```
src/
  components/
    SearchBar.jsx
    PokemonCard.jsx
    TeamSlot.jsx
    TeamBuilder.jsx
    TypeCoverage.jsx
  hooks/
    usePokemon.js
    useTeam.js
  utils/
    typeChart.js       # full 18-type effectiveness matrix
  App.jsx
  main.jsx
```

## Key Implementation Notes
- Use `https://pokeapi.co/api/v2/pokemon/{name}` for individual Pokémon data
- Use `https://pokeapi.co/api/v2/type/{type}` for type relationships
- Cache API responses in memory or localStorage to avoid redundant fetches
- Type coverage logic lives in `utils/typeChart.js` — hardcode the full matrix for reliability
- Team state managed in `useTeam.js` hook, max 6 slots
- Sprites: use the official artwork URL from PokéAPI (`other.official-artwork.front_default`)

## Style Guidelines
- Clean, modern UI — not a clone of the official Pokédex aesthetic
- Dark mode preferred
- Type badges should use the standard Pokémon type colors
- Responsive layout (mobile-friendly)

## Developer Notes
- This is a personal/portfolio project — prioritize code clarity and polish
- Keep components small and focused
- No backend needed — all data fetched client-side from PokéAPI