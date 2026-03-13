import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import LatestNews from "../components/LatestNews";

const highlights = [
  {
    title: "Trusted National Coverage",
    description:
      "Daily reporting from across Cameroon, with verified sources and editorial clarity.",
  },
  {
    title: "Global Lens",
    description:
      "International stories curated for relevance to Cameroonian audiences and diaspora.",
  },
  {
    title: "Opportunities & Events",
    description:
      "Jobs, scholarships, and upcoming events organized for quick discovery.",
  },
];

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <Hero />
      <LatestNews />
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#002fa7] to-[#0041d4]">
        {/* Decorative Patterns */}
        <div className="absolute inset-0 opacity-10">
          {/* Diagonal Lines Pattern */}
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255,255,255,0.1) 35px,
            rgba(255,255,255,0.1) 70px
          )`,
            }}
          />

          {/* Dots Pattern */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 2px)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Decorative Ribbons */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#ff0800] opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff0800] opacity-15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative max-w-[800px] mx-auto px-6 text-center">
          {/* WhatsApp Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg">
            <svg
              className="w-12 h-12 text-[#25D366]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>

          {/* Headline */}
          <h2 className="font-playfair text-[clamp(32px,5vw,48px)] font-black text-white leading-[1.1] mb-4">
            Join Our WhatsApp Community
          </h2>

          {/* Subheadline */}
          <p className="text-[18px] text-white/90 leading-relaxed mb-8 max-w-[600px] mx-auto">
            Get breaking news, exclusive updates, and behind-the-scenes content
            delivered directly to your phone. Be part of our growing community.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-white/80 text-[14px]">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Breaking News Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Exclusive Content</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Community Discussions</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#002fa7] text-[14px] font-bold tracking-[0.06em] uppercase rounded-lg cursor-pointer border-none transition-all duration-300 hover:bg-[#ff0800] hover:text-white hover:scale-105 shadow-xl"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            onClick={() =>
              window.open(
                "https://chat.whatsapp.com/your-community-link",
                "_blank",
              )
            }
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Join Community Now
          </button>

          {/* Member Count */}
          <p className="mt-6 text-white/70 text-[13px]">
            Join <span className="font-bold text-white">10,000+</span> members
            already in our community
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-16 grid gap-6 md:grid-cols-3">
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
  );
}
