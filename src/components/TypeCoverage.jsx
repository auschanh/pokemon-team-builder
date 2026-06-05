// Shows offensive coverage and defensive weaknesses for the full team
export default function TypeCoverage({ team }) {
  if (team.length === 0) {
    return null
  }

  // TODO: compute coverage using utils/typeChart.js
  // - Offensive: which types does this team hit super effectively?
  // - Defensive: which types threaten this team?

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Type Coverage</h2>
      <p className="text-gray-400 text-sm">Coverage analysis coming soon…</p>
    </section>
  )
}
