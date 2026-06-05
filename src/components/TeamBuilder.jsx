import TeamSlot from './TeamSlot'

const SLOTS = Array.from({ length: 6 }, (_, i) => i)

export default function TeamBuilder({ team, onRemove }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Your Team</h2>
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
