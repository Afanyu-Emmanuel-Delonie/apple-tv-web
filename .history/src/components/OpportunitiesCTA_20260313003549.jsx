export default function OpportunitiesCTA() {
  const nodes = [
    { cx: 480, cy: 90,  dur: "2.4s", initials: "AK" },
    { cx: 560, cy: 50,  dur: "2.8s", initials: "BM" },
    { cx: 660, cy: 75,  dur: "3s",   initials: "CL" },
    { cx: 750, cy: 110, dur: "2.6s", initials: "DN" },
    { cx: 810, cy: 65,  dur: "3.3s", initials: "EO" },
    { cx: 610, cy: 170, dur: "2.9s", initials: "FP" },
    { cx: 800, cy: 210, dur: "3.5s", initials: "GR" },
    { cx: 670, cy: 260, dur: "2.7s", initials: "HS" },
    { cx: 730, cy: 345, dur: "3.1s", initials: "IT" },
    { cx: 520, cy: 195, dur: "2.5s", initials: "JU" },
  ];

  const lines = [
    [480,90, 560,50], [560,50, 660,75], [660,75, 750,110],
    [750,110, 810,65],[660,75, 610,170],[610,170, 750,110],
    [610,170, 670,260],[670,260, 800,210],[670,260, 730,345],
    [800,210, 730,345],[480,90, 610,170],[520,195, 610,170],
  ];

  const stats = [
    { val: "500+", label: "Job Listings" },
    { val: "200+", label: "Scholarships" },
    { val: "50+",  label: "Events Monthly" },
  ];

  const updates = [
    { ini: "CL", msg: "New scholarship: Chevening Awards 2025 open", time: "5m ago" },
    { ini: "DN", msg: "Job: Senior Dev role at MTN Cameroon posted", time: "22m ago" },
    { ini: "GR", msg: "Networking event in Yaoundé — 200 seats left", time: "1h ago" },
  ];

  return (
    <section className="relative py-16 overflow-hidden bg-[#0f0f0f]">

      {/* World map + network background */}
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden">
        <svg
          className="opacity-[0.18] w-[800px] h-auto flex-shrink-0 mr-[-60px]"
          viewBox="0 0 900 480"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dots2" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="2" fill="white" />
            </pattern>
            <mask id="world2">
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
          <rect width="900" height="480" fill="url(#dots2)" mask="url(#world2)" />

          {/* Network lines */}
          <g stroke="#002fa7" strokeWidth="1.5">
            {lines.map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}>
                <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${2.5 + i * 0.17}s`} repeatCount="indefinite" />
              </line>
            ))}
          </g>

          {/* Profile nodes */}
          {nodes.map(({ cx, cy, dur, initials }) => (
            <g key={initials}>
              <circle cx={cx} cy={cy} r="22" fill="none" stroke="#002fa7" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values="20;26;20" dur={dur} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur={dur} repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r="16" fill="#111827" stroke="#002fa7" strokeWidth="1.5" />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize="8" fontWeight="600" fill="#4d7fff" fontFamily="DM Sans, sans-serif" letterSpacing="0.5">
                {initials}
              </text>
            </g>
          ))}
        </svg>

        {/* Gradient fade — left stays dark */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-[#0f0f0f]/10" />
      </div>

      {/* Main content */}
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: text + CTAs + stats */}
          <div className="max-w-[540px]">

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#002fa7] animate-pulse" style={{ boxShadow: "0 0 6px #002fa7" }} />
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/45">
                Exclusive Access
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-[clamp(34px,4vw,52px)] font-black text-white leading-[1.08] mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Join Our Community<br />
              for{" "}
              <span className="text-[#4d7fff] italic">Exclusive</span>{" "}
              Opportunities
            </h2>

            {/* Description */}
            <p className="text-[15px] font-light text-white/55 leading-[1.8] mb-10 max-w-[440px]">
              Get early access to job openings, scholarship announcements, networking
              events, and career development resources tailored for Cameroonians.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14">
              <button
                type="button"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#002fa7] text-white text-[13px] font-semibold tracking-[0.06em] uppercase rounded-full cursor-pointer transition-all duration-200 hover:bg-[#0028a0] hover:-translate-y-0.5 active:scale-95"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Join Community
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-white/15 text-white/60 text-[13px] font-medium tracking-[0.06em] uppercase rounded-full cursor-pointer transition-all duration-200 hover:border-white/30 hover:text-white/85"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                See More
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-0 pt-10 border-t border-white/[0.08]">
              {stats.map(({ val, label }, i) => (
                <div key={label} className={i !== 0 ? "border-l border-white/[0.08] pl-6" : ""}>
                  <p
                    className="text-[30px] font-black text-white leading-none mb-1.5"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {val}
                  </p>
                  <p className="text-[11px] text-white/35 uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: social proof cards */}
          <div className="hidden lg:flex flex-col gap-4 items-start pl-8">

            {/* Member count card */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-6 py-5 w-full max-w-[320px]">
              <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/30 mb-3">
                Community members
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {["AK","BM","CL","DN","EO"].map((ini, i) => (
                    <div
                      key={ini}
                      className="w-8 h-8 rounded-full border-2 border-[#0f0f0f] bg-[#1a1f2e] flex items-center justify-center"
                      style={{ zIndex: 5 - i }}
                    >
                      <span className="text-[8px] font-semibold text-[#4d7fff]">{ini}</span>
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-[#0f0f0f] bg-[#002fa7] flex items-center justify-center" style={{ zIndex: 0 }}>
                    <span className="text-[7px] font-bold text-white">+8k</span>
                  </div>
                </div>
                <span
                  className="text-[26px] font-black text-white leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  8,400
                </span>
              </div>
            </div>

            {/* Latest opportunities feed */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-6 py-5 w-full max-w-[320px]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4d7fff] animate-pulse" />
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/30">
                  Latest opportunities
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {updates.map(({ ini, msg, time }) => (
                  <div key={ini} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1a1f2e] border border-[#002fa7]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[7px] font-semibold text-[#4d7fff]">{ini}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-white/65 leading-snug line-clamp-1">{msg}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini stat pair */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-[320px]">
              {[
                { val: "Weekly", label: "New listings" },
                { val: "Free",   label: "Always & forever" },
              ].map(({ val, label }) => (
                <div key={label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-4">
                  <p
                    className="text-[20px] font-black text-[#4d7fff] leading-none mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {val}
                  </p>
                  <p className="text-[11px] text-white/30">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}