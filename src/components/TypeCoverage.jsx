import { useState } from 'react'
import { TYPE_COLORS } from '../utils/typeColors'
import { getIncomingEffectiveness, getOutgoingEffectiveness, getEffectiveness } from '../utils/typeChart'

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

// Collapsible section with per-pokemon breakdown
function CollapsibleSection({ label, labelColor, entries, emptyText, breakdownText }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => entries.length > 0 && setOpen(v => !v)}
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2 ${labelColor} ${entries.length > 0 ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
      >
        {label}
        {entries.length > 0 && (
          <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
        )}
      </button>

      {entries.length === 0
        ? <p className="text-xs text-gray-600 italic">{emptyText}</p>
        : (
          <>
            <div className="flex flex-wrap gap-2">
              {entries.map(({ type }) => (
                <span key={type} className={`text-xs px-2 py-1 rounded-full text-white font-medium capitalize ${TYPE_COLORS[type] ?? 'bg-gray-600'}`}>
                  {type}
                </span>
              ))}
            </div>

            {open && (
              <div className="mt-3 space-y-1.5 border-t border-gray-700 pt-3">
                {entries.map(({ type, pokemon }) => (
                  <div key={type} className="flex items-start gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-white font-medium capitalize shrink-0 ${TYPE_COLORS[type] ?? 'bg-gray-600'}`}>{type}</span>
                    <span className="text-gray-400">
                      {pokemon.map((name, i) => (
                        <span key={name}>
                          {i > 0 && <span className="text-gray-600 mx-1">·</span>}
                          <span className="capitalize">{name}</span>
                        </span>
                      ))}
                      <span className="text-gray-600 ml-1">{breakdownText}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )
      }
    </div>
  )
}

function CoverageCard({ title, accent, description, sections }) {
  return (
    <div className={`bg-gray-900 rounded-xl border-l-4 ${accent} p-5 space-y-5`}>
      <h3 className="text-base font-semibold text-gray-100">{title}</h3>
      <h4 className="text-sm text-gray-400">{description}</h4>
      {sections.map(({ label, labelColor, types, entries, emptyText, breakdownText }) => (
        entries
          ? <CollapsibleSection key={label} label={label} labelColor={labelColor} entries={entries} emptyText={emptyText} breakdownText={breakdownText} />
          : (
            <div key={label}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${labelColor}`}>{label}</p>
              {types.length > 0
                ? <TypeBadges types={types} />
                : <p className="text-xs text-gray-600 italic">{emptyText}</p>
              }
            </div>
          )
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

  const weaknesses4x = Object.entries(teamDefenseAll)
    .filter(([, ms]) => ms.some(m => m >= 4) && !ms.some(m => m < 1))
    .map(([type]) => ({
      type,
      pokemon: team.filter(p => getIncomingEffectiveness(p.types)[type] >= 4).map(p => p.name)
    }))

  const weaknesses2x = Object.entries(teamDefenseAll)
    .filter(([, ms]) => ms.some(m => m === 2) && !ms.some(m => m >= 4) && !ms.some(m => m < 1))
    .map(([type]) => ({
      type,
      pokemon: team.filter(p => getIncomingEffectiveness(p.types)[type] === 2).map(p => p.name)
    }))

  const resistances = Object.entries(teamDefenseAll)
    .filter(([, ms]) => ms.some(m => m === 0.5) && !ms.some(m => m >= 2))
    .map(([type]) => ({
      type,
      pokemon: team.filter(p => getIncomingEffectiveness(p.types)[type] === 0.5).map(p => p.name)
    }))

  const immunities = Object.entries(teamDefenseAll)
    .filter(([, ms]) => ms.some(m => m === 0))
    .map(([type]) => ({
      type,
      pokemon: team.filter(p => getIncomingEffectiveness(p.types)[type] === 0).map(p => p.name)
    }))

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

  const superEffective = Object.entries(teamOffense)
    .filter(([, m]) => m >= 2)
    .map(([defType]) => ({
      type: defType,
      pokemon: team
        .filter(p => p.types.some(attackType => getEffectiveness(attackType, [defType]) >= 2))
        .map(p => p.name)
    }))

  const neutral = Object.entries(teamOffense).filter(([, m]) => m === 1).map(([t]) => t)

  const resisted = Object.entries(teamOffense)
    .filter(([, m]) => m < 1)
    .map(([defType]) => ({
      type: defType,
      pokemon: team
        .filter(p => p.types.some(attackType => getEffectiveness(attackType, [defType]) < 1))
        .map(p => p.name)
    }))

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
            { label: '💪 (2x) Super effective', labelColor: 'text-indigo-400', entries: superEffective, emptyText: 'No super effective coverage', breakdownText: 'can hit this super effectively' },
            { label: '(1x) Neutral',            labelColor: 'text-gray-400',   types: neutral,          emptyText: 'No neutral matchups!' },
            { label: '(0.5x) Resisted',         labelColor: 'text-yellow-400', entries: resisted,       emptyText: 'Nothing resists you!', breakdownText: 'is resisted against this' },
          ]}
        />

        <CoverageCard
          title="⛨ Defensive"
          accent="border-indigo-500"
          description="Your team defending (is):"
          sections={[
            { label: '💀 (4x) Weak to', labelColor: 'text-red-600',   entries: weaknesses4x, emptyText: 'No 4x weaknesses!',  breakdownText: 'is 4x weak to this' },
            { label: '(2x) Weak to',    labelColor: 'text-red-400',   entries: weaknesses2x, emptyText: 'No weaknesses!',     breakdownText: 'is weak to this' },
            { label: '(0.5x) Resists',  labelColor: 'text-green-400', entries: resistances,  emptyText: 'No resistances',     breakdownText: 'resists this' },
            { label: '(0) Immune to',   labelColor: 'text-blue-400',  entries: immunities,   emptyText: 'No immunities',      breakdownText: 'is immune to this' },
          ]}
        />
      </div>

      {weaknesses4x.length === 0 && weaknesses2x.length === 0 && team.length > 0 && (
        <p className="text-green-400 text-sm text-center">Perfectly balanced — no shared weaknesses!</p>
      )}
      {superEffective.length === 18 && (
        <p className="text-indigo-400 text-sm text-center">Full offensive coverage — your team hits every type super effectively!</p>
      )}
    </section>
  )
}
