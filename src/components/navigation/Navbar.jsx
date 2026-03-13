import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems, moreItems, customStyles } from "../../constants/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const getNavPath = (label) => {
    const pathMap = {
      "Latest": "/",
      "International": "/category/international",
      "Business": "/category/business",
      "Regional News": "/regional-news",
      "Politics": "/category/politics",
      "Entertainment": "/category/entertainment",
      "Events": "/events",
      "Opportunities": "/opportunities",
      "About Us": "/about-us"
    };
    return pathMap[label] || "/";
  };

  const isActive = (label) => {
    const path = getNavPath(label);
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <style>{customStyles}</style>

      {/* Sticky wrapper */}
      <div className="sticky top-0 z-50">

        {/* Main navbar */}
        <nav className="bg-white border-b border-[#e3e6ee] shadow-[0_1px_20px_rgba(11,16,32,0.06)]">
          <div className="max-w-[1200px] mx-auto px-6 flex items-stretch h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 no-underline flex-shrink-0 mr-2 cursor-pointer"
            >
              <img 
                src="/assets/apple-tv-logo.png" 
                alt="Apple TV Logo" 
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <span className="font-playfair text-[17px] font-black text-[#0b1020] tracking-tight leading-none whitespace-nowrap">
                Apple <span className="text-[#002fa7]">TV</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-stretch list-none flex-1 justify-center gap-1.5">
              {navItems.map((item) => (
                <li key={item.label} className="flex items-stretch">
                  <Link
                    to={getNavPath(item.label)}
                    className={`nav-link-item flex items-center px-3.5 text-[13px] font-medium tracking-[0.01em] cursor-pointer whitespace-nowrap transition-colors duration-150 no-underline
                      ${isActive(item.label)
                        ? "text-[#002fa7] font-semibold active"
                        : "text-[#2c3348] hover:text-[#002fa7]"
                      }`}
                  >
                    {item.label}
                  </Link>
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
                      <Link
                        key={item.label}
                        to={getNavPath(item.label)}
                        className={`dropdown-item ${isActive(item.label) ? "active" : ""}`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            </ul>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-2.5 ml-auto flex-shrink-0">
              <Link
                to="/submit-story"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#002fa7] text-white text-[12px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer border-none transition-all duration-150 whitespace-nowrap hover:bg-[#0026c4] hover:-translate-y-px active:translate-y-0 no-underline"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Send News
              </Link>
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
              <Link
                key={item.label}
                to={getNavPath(item.label)}
                className={`flex items-center justify-between py-3 text-[15px] font-medium cursor-pointer transition-colors duration-150 no-underline
                  ${isActive(item.label)
                    ? "text-[#002fa7] font-semibold"
                    : "text-[#2c3348] hover:text-[#002fa7]"
                  }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <svg className="w-4 h-4 text-[#8b91a5] flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#8b91a5] pt-4 pb-2">
              More
            </div>
            {moreItems.map((item) => (
              <Link
                key={item.label}
                to={getNavPath(item.label)}
                className={`flex items-center justify-between py-3 text-[15px] font-medium cursor-pointer transition-colors duration-150 no-underline
                  ${isActive(item.label)
                    ? "text-[#002fa7] font-semibold"
                    : "text-[#2c3348] hover:text-[#002fa7]"
                  }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <svg className="w-4 h-4 text-[#8b91a5] flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
            <div className="flex gap-2.5 pt-4">
              <button
                type="button"
                className="flex-1 py-3 bg-transparent border border-[#e3e6ee] text-[12px] font-semibold text-[#2c3348] tracking-[0.06em] uppercase cursor-pointer rounded-md transition-colors duration-150 hover:bg-[#f0f2f8]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Search
              </button>
              <Link
                to="/submit-story"
                className="flex-1 py-3 bg-[#002fa7] text-white text-[12px] font-semibold tracking-[0.06em] uppercase cursor-pointer rounded-md border-none transition-all duration-150 hover:bg-[#0026c4] flex items-center justify-center no-underline"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => setOpen(false)}
              >
                Send News
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}