import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import LatestNews from "../components/LatestNews";
import RegionalNews from "../components/RegionalNews";
import FeaturedHighlights from "../components/FeaturedHighlights";
import WhatsAppCTA from "../components/whatsappCTA";

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

      <div className="max-w-[1200px] mx-auto px-6 py-16 grid gap-6 md:grid-cols-3">
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
      </div>

      <LatestNews />


      {/* WhatsApp Community Section */}
      <WhatsAppCTA />

      {/* Regional News Section */}
      <RegionalNews />

      {/* Featured Highlights */}
      <FeaturedHighlights />

    </div>
  );
}
