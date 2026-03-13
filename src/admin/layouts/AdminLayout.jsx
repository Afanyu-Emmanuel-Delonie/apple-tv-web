import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LayoutDashboard, FileText, Inbox, Calendar, Briefcase, Users, User, LogOut, Menu, ExternalLink, Bell } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getAll, COLLECTIONS } from "../../services/firebase/firestore";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import OpportunityExpirationJob from "../../components/OpportunityExpirationJob";
import EventExpirationJob from "../../components/EventExpirationJob";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Load notifications from Firebase
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const data = await getAll(COLLECTIONS.NOTIFICATIONS);
        // Sort by creation date (newest first) and take only the latest 5
        const sortedData = data
          .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return b.createdAt.seconds - a.createdAt.seconds;
            }
            return 0;
          })
          .slice(0, 5);
        setNotifications(sortedData);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    loadNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getFormattedTime = (notification) => {
    if (notification.createdAt && notification.createdAt.seconds) {
      const date = new Date(notification.createdAt.seconds * 1000);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffInHours / 24);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
      }
    }
    return 'Recently';
  };

  const getNotificationLink = (notification) => {
    // For content creation/modification notifications
    if (['article', 'event', 'opportunity'].includes(notification.type)) {
      switch (notification.type) {
        case "article":
          return "/admin/articles";
        case "event":
          return "/admin/events";
        case "opportunity":
          return "/admin/opportunities";
        default:
          return "/admin/dashboard";
      }
    }
    
    // For approved content notifications
    if (notification.type === "content_approved" && notification.metadata?.routedTo) {
      const { collection } = notification.metadata.routedTo;
      switch (collection) {
        case "articles":
          return "/admin/articles";
        case "events":
          return "/admin/events";
        case "opportunities":
          return "/admin/opportunities";
        default:
          return "/admin/dashboard";
      }
    }
    
    // For submission notifications
    if (notification.type === "submission") {
      return "/admin/submissions";
    }
    
    return "/admin/notifications";
  };

  const handleLogout = async () => {
    console.log('handleLogout called');
    try {
      console.log('Calling logout function...');
      await logout();
      console.log('Logout successful');
      showToast('Logged out successfully!', 'success');
      setTimeout(() => navigate("/admin/login"), 1000);
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Error logging out. Please try again.', 'error');
    }
    setShowLogoutDialog(false);
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    return user?.displayName || user?.name || user?.email || 'User';
  };

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  const handleNotificationClick = (notification) => {
    setNotificationsOpen(false);
    const link = getNotificationLink(notification);
    navigate(link);
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
    { label: "Users", path: "/admin/users", icon: Users, roles: ['admin', 'editor'] },
    { label: "Profile", path: "/admin/profile", icon: User },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.roles) {
      return item.roles.includes(user?.role);
    }
    return true;
  });

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex">
      {/* Background Jobs for Auto-Expiration */}
      <OpportunityExpirationJob />
      <EventExpirationJob />
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed */}
      <aside className={`fixed top-0 left-0 h-screen bg-white shadow-[2px_0_20px_rgba(0,0,0,0.08)] transition-all duration-300 z-50 ${
        sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-20 lg:translate-x-0"
      }`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 border-b border-[#e3e6ee] flex items-center justify-center px-6">
            {sidebarOpen ? (
              <Link to="/admin/dashboard" className="flex items-center gap-2.5 no-underline">
                <img 
                  src="/assets/apple-tv-logo.png" 
                  alt="Apple TV Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="font-playfair text-[17px] font-black text-[#0b1020]">
                  Apple <span className="text-[#002fa7]">Fam TV</span>
                </span>
              </Link>
            ) : (
              <Link to="/admin/dashboard" className="no-underline">
                <img 
                  src="/assets/apple-tv-logo.png" 
                  alt="Apple TV Logo" 
                  className="w-8 h-8 object-contain"
                />
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 overflow-y-auto">
            {filteredMenuItems.map((item) => {
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
                  title={!sidebarOpen ? item.label : ""}
                  onClick={() => {
                    // Only close sidebar on mobile
                    if (isMobile) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-[#e3e6ee] p-4">
            <button
              onClick={() => {
                console.log('Logout button clicked');
                setShowLogoutDialog(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[14px] font-medium text-[#dc2626] hover:bg-[#dc2626]/10 transition-all"
              title={!sidebarOpen ? "Logout" : ""}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      }`}>
        {/* Top Bar - Fixed */}
        <header className={`fixed top-0 right-0 h-16 bg-white border-b border-[#e3e6ee] flex items-center justify-between px-4 lg:px-8 z-40 transition-all duration-300 left-0 ${
          sidebarOpen ? "lg:left-64" : "lg:left-20"
        }`}>
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
                  <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-[#dc2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
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
                      {loadingNotifications ? (
                        <div className="px-4 py-8 text-center">
                          <div className="inline-block w-4 h-4 border-2 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="text-[12px] text-[#5a6073]">Loading notifications...</p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Bell size={24} className="mx-auto text-[#8b91a5] mb-2" />
                          <p className="text-[12px] text-[#5a6073]">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`px-4 py-3 border-b border-[#e3e6ee] hover:bg-[#f6f7fb] transition-colors cursor-pointer ${
                              notification.status === "unread" ? "bg-[#002fa7]/5" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notification.status === "unread" ? "bg-[#002fa7]" : "bg-transparent"
                              }`} />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-semibold text-[#0b1020] mb-1">
                                  {notification.title}
                                </h4>
                                <p className="text-[12px] text-[#5a6073] mb-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <span className="text-[11px] text-[#8b91a5]">
                                  {getFormattedTime(notification)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
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
            <div className="w-10 h-10 bg-[#002fa7] rounded-full flex items-center justify-center text-white font-bold text-[14px]" title={getUserDisplayName()}>
              {getUserInitials()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto mt-16">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <ConfirmDialog
          isOpen={showLogoutDialog}
          title="Confirm Logout"
          message="Are you sure you want to logout? You will need to sign in again to access the admin panel."
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={handleLogout}
          onClose={() => setShowLogoutDialog(false)}
          type="danger"
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
