export default function Events() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--color-secondary)]">
          Events
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[color:var(--color-ink-900)]">
          Conferences, festivals, and community milestones.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--color-ink-600)]">
          Upcoming events will be displayed with location, organizers, and key dates once
          Firestore collections are connected.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-[color:var(--color-ink-200)] bg-white p-8 text-sm text-[color:var(--color-ink-600)]">
        Event listings will appear here.
      </div>
    </section>
  )
}
