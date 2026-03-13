import { useState } from "react";
import { navItems, moreItems, customStyles } from ".../../";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Latest");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
              className="flex items-center gap-2.5 no-underline flex-shrink-0 mr-2 cursor-pointer"
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
              {navItems.map((item) => (
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
              <li className="flex items-stretch relative">
                <button
                  className="nav-link-item flex items-center px-3.5 text-[13px] font-medium tracking-[0.01em] cursor-pointer whitespace-nowrap transition-colors duration-150 bg-transparent border-none text-[#2c3348] hover:text-[#002fa7]"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                >
                  More
                  <svg className="dropdown-arrow" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    {moreItems.map((item) => (
                      <a
                        key={item.label}
                        className={`dropdown-item ${active === item.label ? "active" : ""}`}
                        onClick={() => { setActive(item.label); setDropdownOpen(false); }}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            </ul>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-2.5 ml-auto flex-shrink-0">
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
              className="md:hidden flex items-center gap-1.5 px-2 py-2 border-none bg-transparent text-[12px] font-semibold text-[#2c3348] tracking-[0.06em] uppercase cursor-pointer rounded ml-auto transition-colors duration-150 hover:text-[#002fa7]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              <div className={`flex flex-col gap-[3.5px] w-4 ${open ? "ham-open" : ""}`}>
                <div className="ham-line-1 h-[1.5px] bg-current rounded" />
                <div className="ham-line-2 h-[1.5px] bg-current rounded" />
                <div className="ham-line-3 h-[1.5px] bg-current rounded" />
              </div>
            </button>
          </div>
        </nav>



        {/* Mobile drawer */}
        <div className={`mobile-drawer bg-white border-b border-[#e3e6ee] ${open ? "open" : ""}`}>
          <div className="max-w-[1200px] mx-auto px-6 pb-5">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#8b91a5] pt-4 pb-2">
              Navigation
            </div>
            {navItems.map((item) => (
              <a
                key={item.label}
                className={`flex items-center justify-between py-3 text-[15px] font-medium cursor-pointer transition-colors duration-150 no-underline
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
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#8b91a5] pt-4 pb-2">
              More
            </div>
            {moreItems.map((item) => (
              <a
                key={item.label}
                className={`flex items-center justify-between py-3 text-[15px] font-medium cursor-pointer transition-colors duration-150 no-underline
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