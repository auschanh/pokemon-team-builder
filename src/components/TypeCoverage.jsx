import { useState } from 'react'
import { TYPE_COLORS } from '../utils/typeColors'
import { getIncomingEffectiveness, getOutgoingEffectiveness } from '../utils/typeChart'

function TypeBadges({ types }) {
  if (types.length === 0) return <p className="text-xs text-gray-600 italic">None</p>
  return (
    <div className="flex flex-wrap gap-2">
      {types.map(t => (
        <span key={t} className={`text-xs px-2 py-1 rounded-full text-white font-medium capitalize ${TYPE_COLORS[t] ?? 'bg-gray-600'}`}>{t}</span>
      ))}
    </div>
  )
}

function CoverageCard({ title, accent, description, sections }) {
  return (
    <div className={`bg-gray-900 rounded-xl border-l-4 ${accent} p-5 space-y-5`}>
      <h3 className="text-base font-semibold text-gray-100">{title}</h3>
      <h4 className="text-sm text-gray-400">{description}</h4>
      {sections.map(({ label, labelColor, types, emptyText }) => (
        <div key={label}>
          <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${labelColor}`}>{label}</p>
          {types.length > 0
            ? <TypeBadges types={types} />
            : <p className="text-xs text-gray-600 italic">{emptyText}</p>
          }
        </div>
      ))}
    </div>
  )
}

export default function TypeCoverage({ team }) {
  const [showInfo, setShowInfo] = useState(false)

  if (team.length === 0) return null

  // Defensive: for each type, collect every multiplier across the team
  const incomingPerPokemon = team.map(p => getIncomingEffectiveness(p.types))
  const teamDefenseAll = {}
  for (const incoming of incomingPerPokemon) {
    for (const [type, multiplier] of Object.entries(incoming)) {
      if (!teamDefenseAll[type]) teamDefenseAll[type] = []
      teamDefenseAll[type].push(multiplier)
    }
  }

  // 4x weak: at least one pokemon takes 4x AND nobody resists or is immune
  const weaknesses4x = Object.entries(teamDefenseAll)
    .filter(([, ms]) => ms.some(m => m >= 4) && !ms.some(m => m < 1))
    .map(([t]) => t)

  // 2x weak: at least one pokemon takes 2x (but not 4x) AND nobody resists or is immune
  const weaknesses2x = Object.entries(teamDefenseAll)
    .filter(([, ms]) => ms.some(m => m === 2) && !ms.some(m => m >= 4) && !ms.some(m => m < 1))
    .map(([t]) => t)

  // Resists: at least one pokemon resists and nobody is weak to it
  const resistances = Object.entries(teamDefenseAll)
    .filter(([, ms]) => ms.some(m => m === 0.5) && !ms.some(m => m >= 2))
    .map(([t]) => t)

  // Immune: at least one pokemon is immune
  const immunities  = Object.entries(teamDefenseAll)
    .filter(([, ms]) => ms.some(m => m === 0))
    .map(([t]) => t)

  // Offensive: what does this team hit hard?
  const teamOffense = {}
  for (const pokemon of team) {
    for (const attackType of pokemon.types) {
      const outgoing = getOutgoingEffectiveness(attackType)
      for (const [defType, multiplier] of Object.entries(outgoing)) {
        if (!teamOffense[defType] || multiplier > teamOffense[defType]) {
          teamOffense[defType] = multiplier
        }
      }
    }
  }

  const superEffective = Object.entries(teamOffense).filter(([, m]) => m >= 2).map(([t]) => t)
  const neutral        = Object.entries(teamOffense).filter(([, m]) => m === 1).map(([t]) => t)
  const resisted       = Object.entries(teamOffense).filter(([, m]) => m < 1).map(([t]) => t)

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Type Coverage</h2>
        <button
          onClick={() => setShowInfo(v => !v)}
          className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 rounded-full px-2 py-0.5 transition-colors"
        >
          {showInfo ? 'Hide' : 'How does this work?'}
        </button>
      </div>

      {showInfo && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-400 space-y-2">
          <p><span className="text-gray-200 font-medium">Defensive</span> — shows types that threaten your team. A type only appears as a weakness if at least one Pokémon is weak to it <em>and</em> nobody else on your team resists or is immune to it. If someone covers it, it won't show.</p>
          <p><span className="text-gray-200 font-medium">Offensive</span> — shows which defending types your team can hit super effectively, based on your Pokémon's own types. It reflects the best case across the whole team.</p>
          <p className="text-gray-600 text-xs">Note: this analysis is based on types only, not movesets. A Pokémon may cover a type through moves it can learn even if its typing doesn't.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CoverageCard
          title="⚔️ Offensive"
          accent="border-red-500"
          description="Your team attacking is:"
          sections={[
            { label: '💪 (2x) Super effective', labelColor: 'text-indigo-400', types: superEffective, emptyText: 'No super effective coverage' },
            { label: '(1x) Neutral', labelColor: 'text-gray-400', types: neutral, emptyText: 'No neutral matchups!' },
            { label: '(0.5x) Resisted', labelColor: 'text-yellow-400', types: resisted, emptyText: 'Nothing resists you!' },
          ]}
        />

         <CoverageCard
          title="⛨ Defensive"
          accent="border-indigo-500"
          description="Your team defending (is):"
          sections={[
            { label: '💀 (4x) Weak to',  labelColor: 'text-red-600',   types: weaknesses4x, emptyText: 'No 4x weaknesses!' },
            { label: '(2x) Weak to', labelColor: 'text-red-400',  types: weaknesses2x, emptyText: 'No weaknesses!' },
            { label: '(0.5x) Resists', labelColor: 'text-green-400', types: resistances,  emptyText: 'No resistances' },
            { label: '(0) Immune to',  labelColor: 'text-blue-400',  types: immunities,   emptyText: 'No immunities' },
          ]}
        />
      </div>

      {weaknesses4x.length === 0 && weaknesses2x.length === 0 && (
        <p className="text-green-400 text-sm text-center">Perfectly balanced — no shared weaknesses!</p>
      )}
      {superEffective.length === 18 && (
        <p className="text-indigo-400 text-sm text-center">Full offensive coverage — your team hits every type super effectively!</p>
      )}
    </section>
  )
}
