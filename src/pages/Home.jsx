import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import LatestNews from "../components/LatestNews";
import InternationalNews from "../components/InternationalNews";
import BusinessNews from "../components/BusinessNews";
import RegionalNews from "../components/RegionalNews";
import FeaturedHighlights from "../components/FeaturedHighlights";
import WhatsAppCTA from "../components/whatsappCTA";
import OpportunitiesCTA from "../components/OpportunitiesCTA";
import PageLoader from "../components/PageLoader";
import { useSessionLoader } from "../hooks/useSessionLoader";
import { useSEO } from "../hooks/useSEO";

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
  const { showLoader } = useSessionLoader(1800);

  // SEO for homepage
  useSEO({
    title: 'Apple Fam TV - Cameroon News, Opportunities & Community Stories',
    description: 'Your trusted digital media platform for Cameroon news, international updates, job opportunities, events, and community stories. Stay informed with Apple Fam TV.',
    keywords: 'Cameroon news, African news, job opportunities, events, community stories, regional news, international news, business news, Apple Fam TV',
    image: 'https://applefamtv.com/assets/apple-tv-logo.png',
    type: 'website'
  });

  if (showLoader) {
    return <PageLoader isLoading={true} />;
  }

  return (
    <div className="w-full overflow-x-hidden">
      <Hero />

      <section className="max-w-[1200px] mx-auto px-6 py-16 grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[color:var(--color-ink-100)] bg-white p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.45)]"
          >
            <h2 className="text-lg font-semibold text-[color:var(--color-ink-900)]">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink-600)]">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <LatestNews />

      {/* WhatsApp Community Section */}
      <WhatsAppCTA />

      {/* Regional News Section */}
      <RegionalNews />

      {/* Featured Highlights */}
      <FeaturedHighlights />

      {/* Opportunities CTA */}
      <OpportunitiesCTA />

    </div>
  );
}
