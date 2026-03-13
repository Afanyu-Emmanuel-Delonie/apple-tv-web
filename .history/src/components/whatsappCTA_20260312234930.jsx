export default function WhatsAppCTA() {
  return (
    <section className="relative py-14 overflow-hidden bg-[#0f0f0f]">

      {/* Dotted World Map + Network */}
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden">
        <svg
          className="opacity-20 w-[780px] h-auto flex-shrink-0 mr-[-60px]"
          viewBox="0 0 900 480"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="2" fill="white" />
            </pattern>
            <mask id="world">
              <polygon points="108,72 148,56 190,48 238,56 262,82 270,118 254,152 220,175 185,185 160,210 138,220 118,203 95,170 82,130 90,98" fill="white" />
              <polygon points="268,18 308,10 336,20 345,48 330,72 296,79 268,66 255,42" fill="white" />
              <polygon points="172,220 202,213 220,230 210,248 185,250 169,238" fill="white" />
              <polygon points="225,210 242,205 250,215 244,225 232,226 222,218" fill="white" />
              <polygon points="176,254 220,238 262,244 280,278 280,324 258,366 230,402 193,410 158,386 138,348 140,300 155,272" fill="white" />
              <polygon points="351,48 368,42 378,55 374,72 357,78 346,65" fill="white" />
              <polygon points="374,38 430,28 468,42 485,62 478,97 450,113 416,117 377,107 356,86 360,58" fill="white" />
              <polygon points="413,17 442,13 460,30 454,51 430,55 408,39" fill="white" />
              <polygon points="320,25 338,20 346,30 340,42 324,44 314,34" fill="white" />
              <polygon points="362,124 416,113 464,124 485,165 485,225 468,277 444,310 403,323 360,317 333,288 324,233 330,179 345,145" fill="white" />
              <polygon points="486,106 538,99 558,117 552,148 520,158 488,148 479,128" fill="white" />
              <polygon points="462,17 536,11 620,13 690,26 724,51 720,83 672,93 602,90 535,79 482,68 452,44" fill="white" />
              <polygon points="534,88 586,80 628,90 634,118 610,135 562,133 530,116" fill="white" />
              <polygon points="536,134 584,124 608,140 613,179 594,214 558,220 526,198 515,168 520,144" fill="white" />
              <polygon points="608,68 672,58 716,68 720,106 700,130 658,140 612,130 586,113 592,82" fill="white" />
              <polygon points="706,72 722,66 732,78 726,96 712,98 702,86" fill="white" />
              <polygon points="600,155 640,145 668,158 670,186 650,200 614,194 594,176" fill="white" />
              <polygon points="620,206 652,200 672,214 668,234 640,238 616,224" fill="white" />
              <polygon points="676,210 706,204 724,218 718,234 690,238 672,226" fill="white" />
              <polygon points="638,262 706,250 772,268 784,307 772,352 734,368 688,365 644,342 618,300 624,271" fill="white" />
              <polygon points="784,326 798,316 808,332 802,350 786,350 778,338" fill="white" />
              <polygon points="478,260 488,248 498,262 495,290 484,296 473,280 472,266" fill="white" />
            </mask>
          </defs>
          <rect width="900" height="480" fill="url(#dots)" mask="url(#world)" />

          {/* Network Lines */}
          <g stroke="#ff0800" strokeWidth="1">
            <line x1="480" y1="100" x2="560" y2="60"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="3s" repeatCount="indefinite" /></line>
            <line x1="560" y1="60" x2="660" y2="80"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="3.4s" repeatCount="indefinite" /></line>
            <line x1="660" y1="80" x2="740" y2="120"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="2.8s" repeatCount="indefinite" /></line>
            <line x1="740" y1="120" x2="800" y2="80"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="3.7s" repeatCount="indefinite" /></line>
            <line x1="660" y1="80" x2="600" y2="160"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="4s" repeatCount="indefinite" /></line>
            <line x1="600" y1="160" x2="740" y2="120"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="3.2s" repeatCount="indefinite" /></line>
            <line x1="600" y1="160" x2="660" y2="260"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="2.6s" repeatCount="indefinite" /></line>
            <line x1="660" y1="260" x2="800" y2="220"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="3.9s" repeatCount="indefinite" /></line>
            <line x1="660" y1="260" x2="720" y2="340"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="3.1s" repeatCount="indefinite" /></line>
            <line x1="800" y1="220" x2="720" y2="340"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="2.9s" repeatCount="indefinite" /></line>
            <line x1="480" y1="100" x2="600" y2="160"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="4.3s" repeatCount="indefinite" /></line>
            <line x1="560" y1="60" x2="660" y2="80"><animate attributeName="opacity" values="0.08;0.35;0.08" dur="3.6s" repeatCount="indefinite" /></line>
          </g>

          {/* Profile Nodes — 10 people */}
          {[
            { cx: 480, cy: 100, dur: "2.4s", initials: "AK" },
            { cx: 560, cy: 60,  dur: "2.8s", initials: "BM" },
            { cx: 660, cy: 80,  dur: "3s",   initials: "CL" },
            { cx: 740, cy: 120, dur: "2.6s", initials: "DN" },
            { cx: 800, cy: 80,  dur: "3.3s", initials: "EO" },
            { cx: 600, cy: 160, dur: "2.9s", initials: "FP" },
            { cx: 800, cy: 220, dur: "3.5s", initials: "GR" },
            { cx: 660, cy: 260, dur: "2.7s", initials: "HS" },
            { cx: 720, cy: 340, dur: "3.1s", initials: "IT" },
            { cx: 520, cy: 200, dur: "2.5s", initials: "JU" },
          ].map(({ cx, cy, dur, initials }) => (
            <g key={initials}>
              {/* Outer pulse ring */}
              <circle cx={cx} cy={cy} r="22" fill="none" stroke="#ff0800" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values="20;25;20" dur={dur} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur={dur} repeatCount="indefinite" />
              </circle>
              {/* Avatar circle */}
              <circle cx={cx} cy={cy} r="16" fill="#1a1a1a" stroke="#ff0800" strokeWidth="1.5" />
              {/* Initials */}
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize="8"
                fontWeight="600"
                fill="#ff0800"
                fontFamily="DM Sans, sans-serif"
                letterSpacing="0.5"
              >
                {initials}
              </text>
            </g>
          ))}
        </svg>

        {/* Gradient mask: left side stays dark, right fades */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-[#0f0f0f]/10" />
      </div>

      {/* Content — two-column on large screens */}
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Text & CTA */}
          <div className="max-w-[520px]">

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#ff0800] animate-pulse" />
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/45">
                Join the conversation
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-[clamp(36px,4vw,52px)] font-black text-white leading-[1.08] mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Stay{" "}
              <span className="text-[#ff0800] italic">informed,</span>
              <br />stay connected
            </h2>

            {/* Description */}
            <p className="text-[15px] font-light text-white/55 leading-[1.8] mb-10 max-w-[420px]">
              Get breaking news, deep dives, and exclusive stories delivered straight
              to your WhatsApp — before anyone else reads them. Join thousands already
              in the community.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="button"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#ff0800] text-white text-[14px] font-medium rounded-full cursor-pointer transition-all duration-200 hover:bg-[#c80600] hover:-translate-y-0.5 active:scale-95"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => window.open('https://chat.whatsapp.com/your-link', '_blank')}
              >
                <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Join our WhatsApp
              </button>
              
            </div>
          </div>

          {/* RIGHT: Social proof cards */}
          <div className="hidden lg:flex flex-col gap-4 items-start pl-8">

            {/* Members counter */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-5 w-full max-w-[320px]">
              <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/35 mb-3">
                Community members
              </p>
              <div className="flex items-end gap-3">
                {/* Avatar stack */}
                <div className="flex -space-x-2.5">
                  {["AK","BM","CL","DN","EO"].map((ini, i) => (
                    <div
                      key={ini}
                      className="w-8 h-8 rounded-full border-2 border-[#0f0f0f] bg-[#1e1e1e] flex items-center justify-center"
                      style={{ zIndex: 5 - i }}
                    >
                      <span className="text-[8px] font-semibold text-[#ff0800]">{ini}</span>
                    </div>
                  ))}
                  <div
                    className="w-8 h-8 rounded-full border-2 border-[#0f0f0f] bg-[#ff0800] flex items-center justify-center"
                    style={{ zIndex: 0 }}
                  >
                    <span className="text-[7px] font-bold text-white">+14k</span>
                  </div>
                </div>
                <span
                  className="text-[28px] font-black text-white leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  14,200
                </span>
              </div>
            </div>

            {/* Latest notification card */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-5 w-full max-w-[320px]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff0800] animate-pulse" />
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/35">
                  Latest update
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { ini: "GR", msg: "Breaking: Markets hit record high today", time: "2m ago" },
                  { ini: "HS", msg: "Tech giants report Q2 earnings results", time: "18m ago" },
                  { ini: "IT", msg: "Climate summit reaches new agreement", time: "1h ago" },
                ].map(({ ini, msg, time }) => (
                  <div key={ini} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1e1e1e] border border-[#ff0800]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[7px] font-semibold text-[#ff0800]">{ini}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-white/70 leading-snug truncate">{msg}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-[320px]">
              {[
                { val: "Daily", label: "Updates sent" },
                { val: "Free", label: "Always & forever" },
              ].map(({ val, label }) => (
                <div key={label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4">
                  <p
                    className="text-[20px] font-black text-[#ff0800] leading-none mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {val}
                  </p>
                  <p className="text-[11px] text-white/35">{label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}