import { useState } from "react";
import { Bell, Check, Trash2, Filter } from "lucide-react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "submission",
      title: "New Story Submission",
      message: "John Doe submitted a new story for review",
      time: "5 minutes ago",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      unread: true,
      link: "/admin/submissions"
    },
    {
      id: 2,
      type: "user",
      title: "New User Registration",
      message: "Sarah Smith registered as an Author",
      time: "1 hour ago",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      unread: true,
      link: "/admin/users"
    },
    {
      id: 3,
      type: "event",
      title: "Event Expiring Soon",
      message: "Tech Summit 2024 will expire in 3 days",
      time: "2 hours ago",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      unread: false,
      link: "/admin/events"
    },
    {
      id: 4,
      type: "opportunity",
      title: "Opportunity Deadline",
      message: "Software Engineer position deadline is tomorrow",
      time: "5 hours ago",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      unread: false,
      link: "/admin/opportunities"
    },
    {
      id: 5,
      type: "article",
      title: "Article Published",
      message: "Your article 'Breaking News' has been published",
      time: "1 day ago",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      unread: false,
      link: "/admin/articles"
    },
    {
      id: 6,
      type: "submission",
      title: "Job Offer Submission",
      message: "TechCorp submitted a new job offer",
      time: "2 days ago",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      unread: false,
      link: "/admin/submissions"
    },
  ]);

  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const types = ["All", "submission", "user", "event", "opportunity", "article"];

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === "All" || notification.type === filterType;
    const matchesStatus = filterStatus === "All" || 
      (filterStatus === "Unread" && notification.unread) ||
      (filterStatus === "Read" && !notification.unread);
    return matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeColor = (type) => {
    switch(type) {
      case "submission": return "bg-[#002fa7]/10 text-[#002fa7]";
      case "user": return "bg-[#047857]/10 text-[#047857]";
      case "event": return "bg-[#ea580c]/10 text-[#ea580c]";
      case "opportunity": return "bg-[#8b5cf6]/10 text-[#8b5cf6]";
      case "article": return "bg-[#0891b2]/10 text-[#0891b2]";
      default: return "bg-[#8b91a5]/10 text-[#8b91a5]";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-playfair font-black text-[#0b1020] mb-2">Notifications</h1>
          <p className="text-[13px] sm:text-[14px] text-[#5a6073]">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#002fa7] text-white text-[13px] sm:text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors whitespace-nowrap"
          >
            <Check size={20} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
            >
              <option value="All">All</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e3e6ee] p-6 sm:p-12 text-center">
            <Bell size={48} className="mx-auto text-[#8b91a5] mb-4" />
            <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">No notifications</h3>
            <p className="text-[14px] text-[#5a6073]">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 transition-all hover:shadow-md ${
                notification.unread ? "border-l-4 border-l-[#002fa7]" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Unread Indicator */}
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${
                    notification.unread ? "bg-[#002fa7]" : "bg-transparent border-2 border-[#e3e6ee]"
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h3 className="text-[15px] sm:text-[16px] font-bold text-[#0b1020]">
                        {notification.title}
                      </h3>
                      <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#8b91a5] whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-[13px] sm:text-[14px] text-[#5a6073] mb-4">
                    {notification.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={notification.link}
                      className="text-[13px] font-semibold text-[#002fa7] hover:text-[#0026c4] transition-colors"
                    >
                      View Details →
                    </a>
                    {notification.unread && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="flex items-center gap-2 text-[13px] font-semibold text-[#047857] hover:text-[#036647] transition-colors"
                      >
                        <Check size={16} />
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="flex items-center gap-2 text-[13px] font-semibold text-[#dc2626] hover:text-[#b91c1c] transition-colors ml-auto"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-[13px] text-[#5a6073]">
        Showing {filteredNotifications.length} of {notifications.length} notifications
      </div>
    </div>
  );
}
