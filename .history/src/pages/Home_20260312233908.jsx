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
      <section className="relative py-24 overflow-hidden bg-[#0f0f0f]">
        {/* Dotted World Map Background */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden">
          <svg className="opacity-[0.13] w-[680px] h-auto flex-shrink-0 mr-[-40px]" viewBox="0 0 900 480" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="9" height="9" patternUnits="userSpaceOnUse">
                <circle cx="4.5" cy="4.5" r="1.6" fill="white"/>
              </pattern>
              <mask id="world">
                <polygon points="108,72 148,56 190,48 238,56 262,82 270,118 254,152 220,175 185,185 160,210 138,220 118,203 95,170 82,130 90,98" fill="white"/>
                <polygon points="268,18 308,10 336,20 345,48 330,72 296,79 268,66 255,42" fill="white"/>
                <polygon points="172,220 202,213 220,230 210,248 185,250 169,238" fill="white"/>
                <polygon points="225,210 242,205 250,215 244,225 232,226 222,218" fill="white"/>
                <polygon points="176,254 220,238 262,244 280,278 280,324 258,366 230,402 193,410 158,386 138,348 140,300 155,272" fill="white"/>
                <polygon points="351,48 368,42 378,55 374,72 357,78 346,65" fill="white"/>
                <polygon points="374,38 430,28 468,42 485,62 478,97 450,113 416,117 377,107 356,86 360,58" fill="white"/>
                <polygon points="413,17 442,13 460,30 454,51 430,55 408,39" fill="white"/>
                <polygon points="320,25 338,20 346,30 340,42 324,44 314,34" fill="white"/>
                <polygon points="362,124 416,113 464,124 485,165 485,225 468,277 444,310 403,323 360,317 333,288 324,233 330,179 345,145" fill="white"/>
                <polygon points="486,106 538,99 558,117 552,148 520,158 488,148 479,128" fill="white"/>
                <polygon points="462,17 536,11 620,13 690,26 724,51 720,83 672,93 602,90 535,79 482,68 452,44" fill="white"/>
                <polygon points="534,88 586,80 628,90 634,118 610,135 562,133 530,116" fill="white"/>
                <polygon points="536,134 584,124 608,140 613,179 594,214 558,220 526,198 515,168 520,144" fill="white"/>
                <polygon points="608,68 672,58 716,68 720,106 700,130 658,140 612,130 586,113 592,82" fill="white"/>
                <polygon points="706,72 722,66 732,78 726,96 712,98 702,86" fill="white"/>
                <polygon points="600,155 640,145 668,158 670,186 650,200 614,194 594,176" fill="white"/>
                <polygon points="620,206 652,200 672,214 668,234 640,238 616,224" fill="white"/>
                <polygon points="676,210 706,204 724,218 718,234 690,238 672,226" fill="white"/>
                <polygon points="638,262 706,250 772,268 784,307 772,352 734,368 688,365 644,342 618,300 624,271" fill="white"/>
                <polygon points="784,326 798,316 808,332 802,350 786,350 778,338" fill="white"/>
                <polygon points="478,260 488,248 498,262 495,290 484,296 473,280 472,266" fill="white"/>
              </mask>
            </defs>
            <rect width="900" height="480" fill="url(#dots)" mask="url(#world)"/>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-[1200px] mx-auto px-6">
          <div className="max-w-[500px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#ff0800] animate-pulse" />
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/45">
                Join the conversation
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-playfair text-[clamp(36px,5vw,42px)] font-black text-white leading-[1.1] mb-4">
              Stay <span className="text-[#ff0800] italic">informed,</span><br />stay connected
            </h2>

            {/* Description */}
            <p className="text-[15px] font-light text-white/55 leading-[1.75] mb-9 max-w-[400px]">
              Get breaking news, deep dives, and exclusive stories delivered straight to your WhatsApp — before anyone else reads them.
            </p>

            {/* CTA Row */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="button"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#ff0800] text-white text-[14px] font-medium rounded-full border-none cursor-pointer transition-all duration-200 hover:bg-[#c01818] hover:-translate-y-0.5 active:scale-98"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => window.open('https://chat.whatsapp.com/your-community-link', '_blank')}
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Join our WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-[1200px] mx-auto px-6 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[#e5e0d6] rounded-2xl overflow-hidden bg-white">
          <div className="p-6 border-r border-[#e5e0d6] last:border-r-0 md:last:border-r-0">
            <div className="font-playfair text-[26px] font-bold text-[#0f0f0f] leading-none mb-1.5">
              <span className="text-[#ff0800]">14k+</span>
            </div>
            <div className="text-[12px] text-[#999] tracking-[0.02em]">Community members</div>
          </div>
          <div className="p-6 border-r border-[#e5e0d6] md:border-r last:border-r-0">
            <div className="font-playfair text-[26px] font-bold text-[#0f0f0f] leading-none mb-1.5">
              <span className="text-[#ff0800]">Daily</span>
            </div>
            <div className="text-[12px] text-[#999] tracking-[0.02em]">News updates sent</div>
          </div>
          <div className="p-6 border-r border-[#e5e0d6] border-t md:border-t-0 last:border-r-0">
            <div className="font-playfair text-[26px] font-bold text-[#0f0f0f] leading-none mb-1.5">
              <span className="text-[#ff0800]">48</span>
            </div>
            <div className="text-[12px] text-[#999] tracking-[0.02em]">Topics we cover</div>
          </div>
          <div className="p-6 border-t md:border-t-0">
            <div className="font-playfair text-[26px] font-bold text-[#0f0f0f] leading-none mb-1.5">
              <span className="text-[#ff0800]">Free</span>
            </div>
            <div className="text-[12px] text-[#999] tracking-[0.02em]">Always, forever</div>
          </div>
        </div>
      </section>
    </div>
  );
}
