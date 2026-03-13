export default function OpportunitiesCTA({
  eyebrow = "Exclusive Access",
  headline = "Join Our Community",
  highlightText = "Exclusive",
  description = "Get early access to job openings, scholarship announcements, networking events, and career development resources tailored for Cameroonians.",
  primaryButtonText = "Join our WhatsApp",
  primaryButtonIcon = true,
  secondaryButtonText = "See More",
  accentColor = "#002fa7", // Changed default from red to blue
  stats = [
    { val: "500+", label: "Job Listings" },
    { val: "200+", label: "Scholarships" },
    { val: "50+", label: "Events Monthly" },
  ],
  memberCount = "8,400",
  memberCountLabel = "Community members",
  feedTitle = "Latest opportunities",
  feedItems = [
    { msg: "New scholarship: Chevening Awards 2025 open", time: "5m ago" },
    { msg: "Job: Senior Dev role at MTN Cameroon posted", time: "22m ago" },
    { msg: "Networking event in Yaoundé — 200 seats left", time: "1h ago" },
  ],
  miniStats = [
    { val: "Weekly", label: "New listings" },
    { val: "Free", label: "Always & forever" },
  ]
}) {
  const nodes = [
    { cx: 480, cy: 90, dur: "2.4s", initials: "AK" },
    { cx: 560, cy: 50, dur: "2.8s", initials: "BM" },
    { cx: 660, cy: 75, dur: "3s", initials: "CL" },
    { cx: 750, cy: 110, dur: "2.6s", initials: "DN" },
    { cx: 810, cy: 65, dur: "3.3s", initials: "EO" },
    { cx: 610, cy: 170, dur: "2.9s", initials: "FP" },
    { cx: 800, cy: 210, dur: "3.5s", initials: "GR" },
    { cx: 670, cy: 260, dur: "2.7s", initials: "HS" },
    { cx: 730, cy: 345, dur: "3.1s", initials: "IT" },
    { cx: 520, cy: 195, dur: "2.5s", initials: "JU" },
  ];

  const lines = [
    [480, 90, 560, 50],
    [560, 50, 660, 75],
    [660, 75, 750, 110],
    [750, 110, 810, 65],
    [660, 75, 610, 170],
    [610, 170, 750, 110],
    [610, 170, 670, 260],
    [670, 260, 800, 210],
    [670, 260, 730, 345],
    [800, 210, 730, 345],
    [480, 90, 610, 170],
    [520, 195, 610, 170],
  ];

  return (
    <section className="relative py-16 overflow-hidden bg-[#f0f4ff]">
      {/* World map + network background */}
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden">
        <svg
          className="opacity-[0.15] w-[800px] h-auto flex-shrink-0 mr-[-60px]"
          viewBox="0 0 900 480"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dots2" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="2" fill="#002fa7" />
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
          <g stroke={accentColor} strokeWidth="1.5">
            {lines.map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}>
                <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${2.5 + i * 0.17}s`} repeatCount="indefinite" />
              </line>
            ))}
          </g>

          {/* Profile nodes */}
          {nodes.map(({ cx, cy, dur, initials }) => (
            <g key={initials}>
              <circle cx={cx} cy={cy} r="22" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values="20;26;20" dur={dur} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur={dur} repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r="16" fill="#111827" stroke={accentColor} strokeWidth="1.5" />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize="8" fontWeight="600" fill={accentColor} fontFamily="DM Sans, sans-serif" letterSpacing="0.5">
                {initials}
              </text>
            </g>
          ))}
        </svg>

        {/* Gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f0f4ff] via-[#f0f4ff]/80 to-[#f0f4ff]/10" />
      </div>

      {/* Main content */}
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: text + CTAs + stats */}
          <div className="max-w-[540px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase" style={{ color: `${accentColor}99` }}>
                {eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-[clamp(34px,4vw,52px)] font-black text-[#0b1020] leading-[1.08] mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {headline}
              <br />
              for <span className="italic" style={{ color: accentColor }}>{highlightText}</span> Opportunities
            </h2>

            {/* Description */}
            <p className="text-[15px] font-normal text-[#2c3348]/70 leading-[1.8] mb-10 max-w-[440px]">
              {description}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14">
              <button
                type="button"
                className="inline-flex items-center gap-2.5 px-8 py-4 text-white text-[14px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                style={{ 
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: accentColor,
                  boxShadow: `0 0 0 rgba(${accentColor === '#ff0800' ? '255,8,0' : '0,47,167'},0)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = accentColor === '#ff0800' ? '#c80600' : '#0026c4';
                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(${accentColor === '#ff0800' ? '255,8,0' : '0,47,167'},0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = accentColor;
                  e.currentTarget.style.boxShadow = `0 0 0 rgba(${accentColor === '#ff0800' ? '255,8,0' : '0,47,167'},0)`;
                }}
              >
                {primaryButtonIcon && (
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                )}
                {primaryButtonText}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#e3e6ee] text-[#002fa7] text-[14px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer transition-all duration-200 hover:bg-[#002fa7] hover:text-white hover:border-[#002fa7]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {secondaryButtonText}
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

          </div>

          {/* RIGHT: social proof cards */}
          <div className="hidden lg:flex flex-col gap-4 items-start pl-8">
            {/* Member count card */}
            <div className="bg-white border border-[#e3e6ee] rounded-2xl px-6 py-5 w-full max-w-[380px] shadow-sm">
              <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#2c3348]/50 mb-3">
                {memberCountLabel}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[
                    "https://randomuser.me/api/portraits/men/75.jpg",
                    "https://randomuser.me/api/portraits/women/82.jpg",
                    "https://randomuser.me/api/portraits/men/46.jpg",
                    "https://randomuser.me/api/portraits/women/33.jpg",
                    "https://randomuser.me/api/portraits/men/91.jpg"
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Member"
                      className="w-8 h-8 rounded-full border-2 border-[#f0f4ff] object-cover"
                      style={{ zIndex: 5 - i }}
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-[#f0f4ff] flex items-center justify-center" style={{ zIndex: 0, backgroundColor: accentColor }}>
                    <span className="text-[7px] font-bold text-white">+8k</span>
                  </div>
                </div>
                <span
                  className="text-[26px] font-black text-[#0b1020] leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {memberCount}
                </span>
              </div>
            </div>

            {/* Latest opportunities feed */}
            <div className="bg-white border border-[#e3e6ee] rounded-2xl px-6 py-5 w-full max-w-[380px] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#2c3348]/50">
                  {feedTitle}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {feedItems.map(({ msg, time }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <img
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${60 + i}.jpg`}
                      alt="User"
                      className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5 object-cover"
                      style={{ border: `1px solid ${accentColor}4D` }}
                    />
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#0b1020] leading-snug line-clamp-1">{msg}</p>
                      <p className="text-[10px] text-[#2c3348]/50 mt-0.5">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini stat pair */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-[380px]">
              {miniStats.map(({ val, label }) => (
                <div key={label} className="bg-white border border-[#e3e6ee] rounded-xl px-4 py-4 shadow-sm">
                  <p
                    className="text-[20px] font-black leading-none mb-1"
                    style={{ fontFamily: "'Playfair Display', serif", color: accentColor }}
                  >
                    {val}
                  </p>
                  <p className="text-[11px] text-[#2c3348]/50">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
