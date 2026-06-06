import TeamSlot from './TeamSlot'

const SLOTS = Array.from({ length: 6 }, (_, i) => i)

export default function TeamBuilder({ team, teamError, onRemove }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Your Team</h2>
      {teamError && <p className="text-red-400 text-sm mb-3">{teamError}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SLOTS.map((i) => (
          <TeamSlot
            key={i}
            pokemon={team[i] ?? null}
            onRemove={() => onRemove(team[i]?.id)}
          />
        ))}
      </div>
    </section>
  )
}
