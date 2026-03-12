export default function Opportunities() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--color-primary)]">
          Opportunities
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[color:var(--color-ink-900)]">
          Jobs, scholarships, and growth pathways.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--color-ink-600)]">
          Organize local opportunities with curated listings, application deadlines, and
          quick filters once the Firebase feed is live.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-[color:var(--color-ink-200)] bg-white p-8 text-sm text-[color:var(--color-ink-600)]">
        Opportunity listings will appear here.
      </div>
    </section>
  )
}
