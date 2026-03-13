import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, FileText, Inbox, Calendar, Briefcase, Users, Settings, LogOut, Menu, ExternalLink } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Articles", path: "/admin/articles", icon: FileText },
    { label: "Submissions", path: "/admin/submissions", icon: Inbox },
    { label: "Events", path: "/admin/events", icon: Calendar },
    { label: "Opportunities", path: "/admin/opportunities", icon: Briefcase },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex">
      {/* Sidebar - Fixed */}
      <aside className={`fixed top-0 left-0 h-screen bg-white shadow-[2px_0_20px_rgba(0,0,0,0.08)] transition-all duration-300 z-50 ${sidebarOpen ? "w-64" : "w-20"}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 border-b border-[#e3e6ee] flex items-center justify-center px-6">
            {sidebarOpen ? (
              <Link to="/admin/dashboard" className="flex items-center gap-2.5 no-underline">
                <img 
                  src="/src/assets/apple-tv-logo.png" 
                  alt="Apple TV Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="font-playfair text-[17px] font-black text-[#0b1020]">
                  Apple <span className="text-[#002fa7]">TV</span>
                </span>
              </Link>
            ) : (
              <img 
                src="/src/assets/apple-tv-logo.png" 
                alt="Apple TV Logo" 
                className="w-8 h-8 object-contain"
              />
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 mb-1 rounded-lg text-[14px] font-medium transition-all no-underline ${
                    isActive(item.path)
                      ? "bg-[#002fa7] text-white"
                      : "text-[#2c3348] hover:bg-[#f0f2f8]"
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-[#e3e6ee] p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[14px] font-medium text-[#dc2626] hover:bg-[#dc2626]/10 transition-all"
            >
              <LogOut size={20} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Top Bar - Fixed */}
        <header className="fixed top-0 right-0 h-16 bg-white border-b border-[#e3e6ee] flex items-center justify-between px-8 z-40" style={{ left: sidebarOpen ? "256px" : "80px", transition: "left 0.3s" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f0f2f8] transition-colors"
          >
            <Menu size={20} className="text-[#2c3348]" />
          </button>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors no-underline"
            >
              <ExternalLink size={16} />
              View Site
            </Link>
            <div className="w-10 h-10 bg-[#002fa7] rounded-full flex items-center justify-center text-white font-bold text-[14px]">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
