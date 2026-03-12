import { useState } from "react";

const navItems = [
  { label: "Latest", main: true },
  { label: "International", main: true },
  { label: "Business", main: true },
  { label: "Entertainment", main: true },
  { label: "Politics", main: false },
  { label: "Opportunities", main: false },
  { label: "Events", main: false },
];

// Styles that can't be expressed in core Tailwind without config extensions
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --brand: #002fa7;
    --accent: #ff0800;
  }

  body { font-family: 'DM Sans', sans-serif; }

  .font-playfair { font-family: 'Playfair Display', serif; }

  /* Animated underline — not expressible in core Tailwind */
  .nav-link-item { position: relative; }
  .nav-link-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 14px;
    right: 14px;
    height: 2px;
    background: var(--brand);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.2s ease;
  }
  .nav-link-item:hover::after,
  .nav-link-item.active::after { transform: scaleX(1); }

  /* Mobile drawer max-height transition */
  .mobile-drawer { max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1); }
  .mobile-drawer.open { max-height: 600px; }

  /* Hamburger animation */
  .ham-line-1, .ham-line-2, .ham-line-3 { transition: transform 0.2s, opacity 0.2s; }
  .ham-open .ham-line-1 { transform: translateY(5px) rotate(45deg); }
  .ham-open .ham-line-2 { opacity: 0; transform: scaleX(0); }
  .ham-open .ham-line-3 { transform: translateY(-5px) rotate(-45deg); }

  /* Live dot pulse */
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.75); }
  }
  .live-dot { animation: pulse 1.4s ease-in-out infinite; }

  /* Gradient accent bar */
  .accent-bar { background: linear-gradient(90deg, var(--brand) 0%, var(--accent) 100%); }

  /*
    In tailwind.config.js, extend with:
    theme: {
      extend: {
        colors: { brand: '#002fa7', accent: '#ff0800' },
        fontFamily: { playfair: ['Playfair Display', 'serif'] }
      }
    }
    Then replace hardcoded values like bg-[#002fa7] with bg-brand, text-[#ff0800] with text-accent, etc.
  */
`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Latest");

  const mainNav = navItems.filter((i) => i.main);
  const subNav = navItems.filter((i) => !i.main);

  return (
    <>
      <style>{customStyles}</style>

      {/* Sticky wrapper */}
      <div className="sticky top-0 z-50">

        {/* Main navbar */}
        <nav className="bg-white border-b border-[#e3e6ee] shadow-[0_1px_20px_rgba(11,16,32,0.06)]">
          <div className="max-w-[1200px] mx-auto px-6 flex items-stretch h-16">

            {/* Logo */}
            <a
              className="flex items-center gap-2.5 no-underline flex-shrink-0 pr-8 border-r border-[#e3e6ee] mr-2 cursor-pointer"
              onClick={() => setActive("Latest")}
            >
              <div className="w-8 h-8 bg-[#002fa7] rounded-full relative overflow-hidden flex-shrink-0">
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ff0800] rounded-full" />
              </div>
              <span className="font-playfair text-[17px] font-black text-[#0b1020] tracking-tight leading-none whitespace-nowrap">
                Apple <span className="text-[#002fa7]">TV</span>
              </span>
            </a>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-stretch list-none flex-1 justify-center gap-1.5">
              {mainNav.map((item) => (
                <li key={item.label} className="flex items-stretch">
                  <a
                    className={`nav-link-item flex items-center px-3.5 text-[13px] font-medium tracking-[0.01em] cursor-pointer whitespace-nowrap transition-colors duration-150 no-underline
                      ${active === item.label
                        ? "text-[#002fa7] font-semibold active"
                        : "text-[#2c3348] hover:text-[#002fa7]"
                      }`}
                    onClick={() => setActive(item.label)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-2.5 pl-4 border-l border-[#e3e6ee] ml-auto flex-shrink-0">
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#002fa7] text-white text-[12px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer border-none transition-all duration-150 whitespace-nowrap hover:bg-[#0026c4] hover:-translate-y-px active:translate-y-0"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Send News
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              className="md:hidden flex items-center gap-1.5 px-3.5 py-2 border border-[#e3e6ee] bg-transparent text-[12px] font-semibold text-[#2c3348] tracking-[0.06em] uppercase cursor-pointer rounded ml-auto transition-colors duration-150 hover:border-[#002fa7] hover:text-[#002fa7]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              <div className={`flex flex-col gap-[3.5px] w-4 ${open ? "ham-open" : ""}`}>
                <div className="ham-line-1 h-[1.5px] bg-current rounded" />
                <div className="ham-line-2 h-[1.5px] bg-current rounded" />
                <div className="ham-line-3 h-[1.5px] bg-current rounded" />
              </div>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>

        {/* Sub-nav strip */}
        <div className="bg-[#f0f2f8] border-b border-[#e3e6ee]">
          <div className="max-w-[1200px] mx-auto px-6 flex items-center h-11 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {subNav.map((item, i) => (
              <div key={item.label} className="flex items-center flex-shrink-0">
                {i > 0 && <div className="w-px h-4 bg-[#e3e6ee] flex-shrink-0" />}
                <a
                  className={`flex items-center px-4 h-11 text-[12px] font-medium tracking-[0.04em] cursor-pointer transition-colors duration-150 whitespace-nowrap no-underline
                    ${active === item.label
                      ? "text-[#002fa7] font-semibold"
                      : "text-[#8b91a5] hover:text-[#0b1020]"
                    }`}
                  onClick={() => setActive(item.label)}
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`mobile-drawer bg-white border-b border-[#e3e6ee] ${open ? "open" : ""}`}>
          <div className="max-w-[1200px] mx-auto px-6 pb-5">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#8b91a5] pt-4 pb-2">
              Navigation
            </div>
            {navItems.map((item) => (
              <a
                key={item.label}
                className={`flex items-center justify-between py-3 border-b border-[#f0f2f8] text-[15px] font-medium cursor-pointer transition-colors duration-150 no-underline last:border-0
                  ${active === item.label
                    ? "text-[#002fa7] font-semibold"
                    : "text-[#2c3348] hover:text-[#002fa7]"
                  }`}
                onClick={() => { setActive(item.label); setOpen(false); }}
              >
                {item.label}
                <svg className="w-4 h-4 text-[#8b91a5] flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
            <div className="flex gap-2.5 pt-4">
              <button
                type="button"
                className="flex-1 py-3 bg-transparent border border-[#e3e6ee] text-[12px] font-semibold text-[#2c3348] tracking-[0.06em] uppercase cursor-pointer rounded-md transition-colors duration-150 hover:bg-[#f0f2f8]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Search
              </button>
              <button
                type="button"
                className="flex-1 py-3 bg-[#002fa7] text-white text-[12px] font-semibold tracking-[0.06em] uppercase cursor-pointer rounded-md border-none transition-all duration-150 hover:bg-[#0026c4]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Send News
              </button>
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}