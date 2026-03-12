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

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --primary: #002fa7;
    --secondary: #ff0800;
    --ink-900: #0b1020;
    --ink-700: #2c3348;
    --ink-400: #8b91a5;
    --ink-200: #e3e6ee;
    --ink-100: #f0f2f8;
    --surface: #ffffff;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { 
    font-family: 'DM Sans', sans-serif; 
    background: var(--ink-100);
    min-height: 100vh;
  }

  .navbar-wrap {
    position: sticky;
    top: 0;
    z-index: 50;
  }

  /* Red accent bar on top */
  .accent-bar {
    height: 3px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  }

  .navbar {
    background: var(--surface);
    border-bottom: 1px solid var(--ink-200);
    box-shadow: 0 1px 20px rgba(11,16,32,0.06);
  }

  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: stretch;
    gap: 0;
    height: 64px;
  }

  /* Logo */
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
    padding-right: 32px;
    border-right: 1px solid var(--ink-200);
    margin-right: 8px;
    cursor: pointer;
  }

  .logo-mark {
    width: 32px;
    height: 32px;
    background: var(--primary);
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .logo-mark::after {
    content: '';
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 16px;
    height: 16px;
    background: var(--secondary);
    border-radius: 50%;
  }

  .logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 900;
    color: var(--ink-900);
    letter-spacing: -0.02em;
    line-height: 1;
    white-space: nowrap;
  }

  .logo-text span {
    color: var(--primary);
  }

  /* Nav items */
  .nav-links {
    display: flex;
    align-items: stretch;
    list-style: none;
    gap: 0;
    flex: 1;
  }

  .nav-item {
    position: relative;
    display: flex;
    align-items: stretch;
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 0 14px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: var(--ink-700);
    white-space: nowrap;
    transition: color 0.15s ease;
    position: relative;
    cursor: pointer;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 14px;
    right: 14px;
    height: 2px;
    background: var(--primary);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.2s ease;
  }

  .nav-link:hover {
    color: var(--primary);
  }

  .nav-link:hover::after,
  .nav-link.active::after {
    transform: scaleX(1);
  }

  .nav-link.active {
    color: var(--primary);
    font-weight: 600;
  }

  /* Right side actions */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 16px;
    border-left: 1px solid var(--ink-200);
    margin-left: auto;
    flex-shrink: 0;
  }

  .btn-ghost {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border: none;
    background: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-700);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.15s, color 0.15s;
  }

  .btn-ghost:hover {
    background: var(--ink-100);
    color: var(--ink-900);
  }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border: none;
    background: var(--primary);
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
  }

  .btn-primary:hover {
    background: #0026c4;
    transform: translateY(-1px);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  /* Live badge */
  .live-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    background: rgba(255,8,0,0.08);
    border: 1px solid rgba(255,8,0,0.2);
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    color: var(--secondary);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--secondary);
    animation: pulse 1.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.75); }
  }

  /* Mobile menu button */
  .mobile-toggle {
    display: none;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: 1px solid var(--ink-200);
    background: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-700);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    margin-left: auto;
    transition: border-color 0.15s, color 0.15s;
  }

  .mobile-toggle:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  /* Hamburger icon */
  .ham-lines {
    display: flex;
    flex-direction: column;
    gap: 3.5px;
    width: 16px;
  }
  .ham-line {
    height: 1.5px;
    background: currentColor;
    border-radius: 2px;
    transition: transform 0.2s, opacity 0.2s, width 0.2s;
    transform-origin: center;
  }
  .ham-open .ham-line:nth-child(1) { transform: translateY(5px) rotate(45deg); }
  .ham-open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .ham-open .ham-line:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

  /* Secondary nav bar */
  .subnav {
    background: var(--ink-100);
    border-bottom: 1px solid var(--ink-200);
    overflow: hidden;
    max-height: 44px;
    transition: max-height 0.3s ease;
  }

  .subnav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 0;
    height: 44px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .subnav-inner::-webkit-scrollbar { display: none; }

  .subnav-link {
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 100%;
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--ink-400);
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.15s;
    flex-shrink: 0;
  }

  .subnav-link:hover { color: var(--ink-900); }
  .subnav-link.active { color: var(--primary); font-weight: 600; }

  .subnav-divider {
    width: 1px;
    height: 16px;
    background: var(--ink-200);
    flex-shrink: 0;
  }

  /* Mobile drawer */
  .mobile-drawer {
    background: var(--surface);
    border-bottom: 1px solid var(--ink-200);
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .mobile-drawer.open {
    max-height: 600px;
  }

  .mobile-nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 8px 24px 20px;
  }

  .mobile-section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-400);
    padding: 16px 0 8px;
  }

  .mobile-nav-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--ink-100);
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-700);
    cursor: pointer;
    transition: color 0.15s;
  }

  .mobile-nav-link:last-of-type { border-bottom: none; }
  .mobile-nav-link:hover { color: var(--primary); }
  .mobile-nav-link.active { color: var(--primary); font-weight: 600; }

  .arrow {
    width: 16px;
    height: 16px;
    color: var(--ink-400);
    flex-shrink: 0;
  }

  .mobile-actions {
    display: flex;
    gap: 10px;
    padding-top: 16px;
  }

  .mobile-actions .btn-primary,
  .mobile-actions .btn-ghost {
    flex: 1;
    justify-content: center;
    border-radius: 6px;
    padding: 12px;
    font-size: 12px;
  }

  .mobile-actions .btn-ghost {
    border: 1px solid var(--ink-200);
  }

  @media (max-width: 768px) {
    .nav-links, .nav-actions { display: none; }
    .mobile-toggle { display: flex; }
  }

  /* Demo content */
  .demo-page {
    max-width: 1200px;
    margin: 48px auto;
    padding: 0 24px;
  }

  .demo-tag {
    display: inline-block;
    padding: 4px 10px;
    background: rgba(0,47,167,0.08);
    color: var(--primary);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 3px;
    margin-bottom: 16px;
  }

  .demo-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 900;
    color: var(--ink-900);
    line-height: 1.1;
    letter-spacing: -0.03em;
    max-width: 700px;
  }

  .demo-sub {
    margin-top: 16px;
    font-size: 16px;
    color: var(--ink-400);
    max-width: 520px;
    line-height: 1.6;
  }
`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Latest");

  const mainNav = navItems.slice(0, 4);
  const subNav = navItems.slice(4);

  return (
    <>
      <style>{style}</style>
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