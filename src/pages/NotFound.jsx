import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="space-y-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--color-secondary)]">
        404
      </p>
      <h2 className="text-3xl font-semibold text-[color:var(--color-ink-900)]">
        Page not found
      </h2>
      <p className="text-sm text-[color:var(--color-ink-600)]">
        The page you are looking for does not exist yet. Let&apos;s head back to the
        newsroom.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
      >
        Back to Home
      </Link>
    </section>
  )
}
