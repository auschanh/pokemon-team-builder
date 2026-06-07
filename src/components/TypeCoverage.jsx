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
  if (team.length === 0) return null

  // Defensive: what threatens this team?
  const incomingPerPokemon = team.map(p => getIncomingEffectiveness(p.types))
  const teamDefense = {}
  for (const incoming of incomingPerPokemon) {
    for (const [type, multiplier] of Object.entries(incoming)) {
      if (!teamDefense[type] || multiplier > teamDefense[type]) {
        teamDefense[type] = multiplier
      }
    }
  }

  const weaknesses  = Object.entries(teamDefense).filter(([, m]) => m >= 2).map(([t]) => t)
  const resistances = Object.entries(teamDefense).filter(([, m]) => m === 0.5).map(([t]) => t)
  const immunities  = Object.entries(teamDefense).filter(([, m]) => m === 0).map(([t]) => t)

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
  const notCovered     = Object.entries(teamOffense).filter(([, m]) => m < 1).map(([t]) => t)

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Type Coverage</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CoverageCard
          title="⛨ Defensive"
          accent="border-red-500"
          description="Your team defending (is):"
          sections={[
            { label: 'Weak to (2x)',   labelColor: 'text-red-400',   types: weaknesses,  emptyText: 'No weaknesses!' },
            { label: 'Resists (0.5x)',   labelColor: 'text-green-400', types: resistances, emptyText: 'No resistances' },
            { label: 'Immune to (0)', labelColor: 'text-blue-400',  types: immunities,  emptyText: 'No immunities' },
          ]}
        />

        <CoverageCard
          title="⚔️ Offensive"
          accent="border-indigo-500"
          description="Your team attacking is:"
          sections={[
            { label: 'Super effective against (2x)', labelColor: 'text-indigo-400', types: superEffective, emptyText: 'No coverage' },
            { label: 'Resisted by (0.5)',             labelColor: 'text-yellow-400', types: notCovered,     emptyText: 'Full coverage!' },
          ]}
        />
      </div>
    </section>
  )
}
