import { useParams } from 'react-router-dom'

const prettyName = (value) =>
  value
    ?.split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export default function Category() {
  const { slug } = useParams()

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--color-secondary)]">
          Category
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[color:var(--color-ink-900)]">
          {prettyName(slug)}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--color-ink-600)]">
          Stories curated for this section will appear here once the Firebase feed is wired
          up. We will support filtering, sorting, and premium editorial highlights.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-[color:var(--color-ink-200)] bg-white p-8 text-sm text-[color:var(--color-ink-600)]">
        Coming soon: dynamic posts for {prettyName(slug)}.
      </div>
    </section>
  )
}
