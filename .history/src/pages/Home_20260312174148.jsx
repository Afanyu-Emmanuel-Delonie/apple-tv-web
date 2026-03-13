import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Trusted National Coverage',
    description:
      'Daily reporting from across Cameroon, with verified sources and editorial clarity.',
  },
  {
    title: 'Global Lens',
    description:
      'International stories curated for relevance to Cameroonian audiences and diaspora.',
  },
  {
    title: 'Opportunities & Events',
    description:
      'Jobs, scholarships, and upcoming events organized for quick discovery.',
  },
]

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="rounded-3xl border border-[color:var(--color-ink-100)] bg-white p-10 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.4)]">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--color-primary)]">
          Cameroonian News Platform
        </p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-[color:var(--color-ink-900)] md:text-5xl">
          News, opportunities, and events curated for Cameroon&apos;s future.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--color-ink-600)]">
          A premium newsroom experience built for speed, clarity, and relevance. Stay on top
          of national headlines, global developments, and the opportunities shaping tomorrow.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/"
            className="rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[color:var(--color-primary-soft)]"
          >
            Read Latest
          </Link>
          <Link
            to="/opportunities"
            className="rounded-full border border-[color:var(--color-ink-200)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink-800)]"
          >
            Explore Opportunities
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[color:var(--color-ink-100)] bg-white p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.45)]"
          >
            <h3 className="text-lg font-semibold text-[color:var(--color-ink-900)]">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-600)]">
              {item.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  )
}
