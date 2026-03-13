import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, FileText, Inbox, Calendar, Briefcase, Users, Settings, LogOut, Menu, ExternalLink, Bell } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      type: "submission",
      title: "New Story Submission",
      message: "John Doe submitted a new story for review",
      time: "5 minutes ago",
      unread: true,
      link: "/admin/submissions"
    },
    {
      id: 2,
      type: "user",
      title: "New User Registration",
      message: "Sarah Smith registered as an Author",
      time: "1 hour ago",
      unread: true,
      link: "/admin/users"
    },
    {
      id: 3,
      type: "event",
      title: "Event Expiring Soon",
      message: "Tech Summit 2024 will expire in 3 days",
      time: "2 hours ago",
      unread: false,
      link: "/admin/events"
    },
    {
      id: 4,
      type: "opportunity",
      title: "Opportunity Deadline",
      message: "Software Engineer position deadline is tomorrow",
      time: "5 hours ago",
      unread: false,
      link: "/admin/opportunities"
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNotificationClick = (notification) => {
    setNotificationsOpen(false);
    navigate(notification.link);
  };

  const handleViewAll = () => {
    setNotificationsOpen(false);
    navigate("/admin/notifications");
  };

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
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed */}
      <aside className={`fixed top-0 left-0 h-screen bg-white shadow-[2px_0_20px_rgba(0,0,0,0.08)] transition-all duration-300 z-50 ${
        sidebarOpen ? "w-64" : "w-64 -translate-x-full lg:translate-x-0 lg:w-20"
      }`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 border-b border-[#e3e6ee] flex items-center justify-center px-6">
            {(sidebarOpen || window.innerWidth >= 1024) ? (
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
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  {(sidebarOpen || window.innerWidth >= 1024) && <span>{item.label}</span>}
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
              {(sidebarOpen || window.innerWidth >= 1024) && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen && window.innerWidth >= 1024 ? "ml-64" : window.innerWidth >= 1024 ? "ml-20" : "ml-0"
      }`}>
        {/* Top Bar - Fixed */}
        <header 
          className="fixed top-0 right-0 h-16 bg-white border-b border-[#e3e6ee] flex items-center justify-between px-4 lg:px-8 z-40" 
          style={{ 
            left: sidebarOpen && window.innerWidth >= 1024 ? "256px" : window.innerWidth >= 1024 ? "80px" : "0", 
            transition: "left 0.3s" 
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f0f2f8] transition-colors"
          >
            <Menu size={20} className="text-[#2c3348]" />
          </button>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f0f2f8] transition-colors"
              >
                <Bell size={20} className="text-[#2c3348]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-[#dc2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 top-12 w-[90vw] max-w-[380px] bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#e3e6ee] z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[#e3e6ee]">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-bold text-[#0b1020]">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-[12px] text-[#002fa7] font-semibold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 border-b border-[#e3e6ee] hover:bg-[#f6f7fb] transition-colors cursor-pointer ${
                            notification.unread ? "bg-[#002fa7]/5" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.unread ? "bg-[#002fa7]" : "bg-transparent"
                            }`} />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[13px] font-semibold text-[#0b1020] mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-[12px] text-[#5a6073] mb-1">
                                {notification.message}
                              </p>
                              <span className="text-[11px] text-[#8b91a5]">
                                {notification.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-[#e3e6ee]">
                      <button 
                        onClick={handleViewAll}
                        className="w-full text-[13px] font-semibold text-[#002fa7] hover:text-[#0026c4] transition-colors"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex bg-[#002fa7] items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors no-underline"
            >
              <ExternalLink size={16} />
              <span className="hidden md:inline">View Site</span>
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
