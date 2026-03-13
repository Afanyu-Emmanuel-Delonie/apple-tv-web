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

        {/* Demo page content */}
      <div className="max-w-[1200px] mx-auto mt-12 px-6">
        <div className="inline-block px-2.5 py-1 bg-[#002fa7]/[0.08] text-[#002fa7] text-[11px] font-bold tracking-[0.1em] uppercase rounded-[3px] mb-4">
          Breaking News
        </div>
        <h1 className="font-playfair font-black text-[#0b1020] leading-[1.1] tracking-[-0.03em] max-w-[700px] text-[clamp(32px,5vw,52px)]">
          Global Markets React to New Economic Policy Shifts
        </h1>
        <p className="mt-4 text-[16px] text-[#8b91a5] max-w-[520px] leading-relaxed">
          Investors worldwide respond as major central banks coordinate an unprecedented monetary response ahead of the G20 summit.
        </p>
      </div>

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
