export const navItems = [
  { label: "Latest" },
  { label: "International" },
  { label: "Business" },
  { label: "Regional News" },
  { label: "Politics" },
];

export const moreItems = [
  { label: "Entertainment" },
  { label: "Events" },
  { label: "Opportunities" },
  { label: "About Us" },
];

export const customStyles = `
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
  .mobile-drawer.open { max-height: 800px; }

  /* Dropdown menu */
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #e3e6ee;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(11,16,32,0.1);
    min-width: 180px;
    margin-top: 4px;
    z-index: 100;
  }
  .dropdown-item {
    display: block;
    padding: 10px 16px;
    font-size: 13px;
    color: #2c3348;
    transition: all 0.15s;
    cursor: pointer;
    text-decoration: none;
  }
  .dropdown-item:hover { background: #f0f2f8; color: #002fa7; }
  .dropdown-item.active { color: #002fa7; font-weight: 600; }
  .dropdown-arrow { width: 14px; height: 14px; margin-left: 4px; transition: transform 0.2s; }

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
`;
