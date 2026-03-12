import { useState, useEffect } from "react";

const navItems = [
  { label: "Latest", to: "/" },
  { label: "International", to: "/category/international" },
  { label: "Business", to: "/category/business" },
  { label: "Entertainment", to: "/category/entertainment" },
  { label: "Politics", to: "/category/politics" },
  { label: "Opportunities", to: "/opportunities" },
  { label: "Events", to: "/events" },
];



export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Latest");

  const mainNav = navItems.slice(0, 4);
  const subNav = navItems.slice(4);

  return (
    <>
      
      <div className="navbar-wrap">
        <div className="accent-bar" />
        <div className="navbar">
          <div className="navbar-inner">
            {/* Logo */}
            <a className="logo" onClick={() => setActive("Latest")}>
              <div className="logo-mark" />
              <span className="logo-text">
                Apple <span>TV</span>
              </span>
            </a>

            {/* Desktop nav - main items */}
            <ul className="nav-links">
              {mainNav.map((item) => (
                <li key={item.to} className="nav-item">
                  <a
                    className={`nav-link ${active === item.label ? "active" : ""}`}
                    onClick={() => setActive(item.label)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop right actions */}
            <div className="nav-actions">
              <div className="live-badge">
                <div className="live-dot" />
                Live
              </div>
              <button className="btn-primary" type="button">
                Send News
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              className="mobile-toggle"
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              <div className={`ham-lines ${open ? "ham-open" : ""}`}>
                <div className="ham-line" />
                <div className="ham-line" />
                <div className="ham-line" />
              </div>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/* Secondary nav strip */}
        <div className="subnav">
          <div className="subnav-inner">
            {subNav.map((item, i) => (
              <>
                {i > 0 && <div key={`d-${i}`} className="subnav-divider" />}
                <a
                  key={item.to}
                  className={`subnav-link ${active === item.label ? "active" : ""}`}
                  onClick={() => setActive(item.label)}
                >
                  {item.label}
                </a>
              </>
            ))}
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`mobile-drawer ${open ? "open" : ""}`}>
          <div className="mobile-nav">
            <div className="mobile-section-label">Navigation</div>
            {navItems.map((item) => (
              <a
                key={item.to}
                className={`mobile-nav-link ${active === item.label ? "active" : ""}`}
                onClick={() => { setActive(item.label); setOpen(false); }}
              >
                {item.label}
                <svg className="arrow" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ))}
            <div className="mobile-actions">
              <button className="btn-ghost" type="button">Search</button>
              <button className="btn-primary" type="button">Send News</button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo content */}
      <div className="demo-page">
        <div className="demo-tag">Breaking News</div>
        <h1 className="demo-headline">Global Markets React to New Economic Policy Shifts</h1>
        <p className="demo-sub">Investors worldwide respond as major central banks coordinate an unprecedented monetary response ahead of the G20 summit.</p>
      </div>
    </>
  );
}