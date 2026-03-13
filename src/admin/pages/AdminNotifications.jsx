import { useState, useEffect } from "react";
import { Bell, Check, Trash2, ExternalLink, MessageSquare } from "lucide-react";
import { getAll, update, remove, COLLECTIONS } from "../../services/firebase/firestore";
import PageLoader from "../../components/PageLoader";
import { usePageReloadLoader } from "../../hooks/useSessionLoader";
import Toast from "../components/Toast";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toast, setToast] = useState(null);
  const showLoader = usePageReloadLoader([loading], 1200);

  // Load notifications from Firebase
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await getAll(COLLECTIONS.NOTIFICATIONS);
        // Sort by creation date (newest first)
        const sortedData = data.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        });
        setNotifications(sortedData);
      } catch (error) {
        console.error('Error loading notifications:', error);
        showToast('Failed to load notifications', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const types = ["All", "article", "event", "opportunity", "submission", "content_approved"];

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === "All" || notification.type === filterType;
    const matchesStatus = filterStatus === "All" || 
      (filterStatus === "Unread" && notification.status === "unread") ||
      (filterStatus === "Read" && notification.status === "read");
    return matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const getFormattedDate = (notification) => {
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

  const handleMarkAsRead = async (id) => {
    try {
      await update(COLLECTIONS.NOTIFICATIONS, id, { status: "read" });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, status: "read" } : n
      ));
      showToast('Notification marked as read', 'success');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showToast('Failed to mark as read', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => n.status === "unread");
      await Promise.all(
        unreadNotifications.map(n => update(COLLECTIONS.NOTIFICATIONS, n.id, { status: "read" }))
      );
      setNotifications(notifications.map(n => ({ ...n, status: "read" })));
      showToast('All notifications marked as read', 'success');
    } catch (error) {
      console.error('Error marking all as read:', error);
      showToast('Failed to mark all as read', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(COLLECTIONS.NOTIFICATIONS, id);
      setNotifications(notifications.filter(n => n.id !== id));
      showToast('Notification deleted', 'success');
    } catch (error) {
      console.error('Error deleting notification:', error);
      showToast('Failed to delete notification', 'error');
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case "content_approved": return "bg-[#047857]/10 text-[#047857]";
      case "submission": return "bg-[#002fa7]/10 text-[#002fa7]";
      case "user": return "bg-[#8b5cf6]/10 text-[#8b5cf6]";
      case "event": return "bg-[#ea580c]/10 text-[#ea580c]";
      case "opportunity": return "bg-[#0891b2]/10 text-[#0891b2]";
      case "article": return "bg-[#dc2626]/10 text-[#dc2626]";
      default: return "bg-[#8b91a5]/10 text-[#8b91a5]";
    }
  };

  const getTypeDisplayName = (type) => {
    switch(type) {
      case "content_approved": return "Published";
      case "submission": return "Submission";
      case "article": return "Article";
      case "event": return "Event";
      case "opportunity": return "Opportunity";
      case "user": return "User";
      default: return type?.charAt(0).toUpperCase() + type?.slice(1) || 'Unknown';
    }
  };

  const getActionButton = (notification) => {
    // For content creation/modification notifications
    if (['article', 'event', 'opportunity'].includes(notification.type)) {
      let linkPath = "/admin";
      
      switch (notification.type) {
        case "article":
          linkPath = "/admin/articles";
          break;
        case "event":
          linkPath = "/admin/events";
          break;
        case "opportunity":
          linkPath = "/admin/opportunities";
          break;
      }
      
      return (
        <a
          href={linkPath}
          className="flex items-center gap-2 text-[13px] font-semibold text-[#002fa7] hover:text-[#0026c4] transition-colors"
        >
          <ExternalLink size={16} />
          View {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}s
        </a>
      );
    }
    
    // For approved content notifications
    if (notification.type === "content_approved" && notification.metadata?.routedTo) {
      const { collection } = notification.metadata.routedTo;
      let linkPath = "/admin";
      
      switch (collection) {
        case "articles":
          linkPath = "/admin/articles";
          break;
        case "events":
          linkPath = "/admin/events";
          break;
        case "opportunities":
          linkPath = "/admin/opportunities";
          break;
      }
      
      return (
        <a
          href={linkPath}
          className="flex items-center gap-2 text-[13px] font-semibold text-[#002fa7] hover:text-[#0026c4] transition-colors"
        >
          <ExternalLink size={16} />
          View Published Content
        </a>
      );
    }
    
    // For submission notifications
    if (notification.type === "submission") {
      return (
        <a
          href="/admin/submissions"
          className="flex items-center gap-2 text-[13px] font-semibold text-[#002fa7] hover:text-[#0026c4] transition-colors"
        >
          <ExternalLink size={16} />
          View Submissions
        </a>
      );
    }
    
    return (
      <span className="text-[13px] text-[#8b91a5]">
        No action required
      </span>
    );
  };

  if (showLoader) {
    return <PageLoader isLoading={true} />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-playfair font-black text-[#0b1020] mb-2">Messages & Notifications</h1>
          <p className="text-[13px] sm:text-[14px] text-[#5a6073]">
            {unreadCount > 0 ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
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
                  {type === "All" ? "All" : getTypeDisplayName(type)}
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
      {loading ? (
        <div className="bg-white rounded-lg border border-[#e3e6ee] p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[14px] text-[#5a6073]">Loading messages...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg border border-[#e3e6ee] p-6 sm:p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-[#8b91a5] mb-4" />
              <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">No messages found</h3>
              <p className="text-[14px] text-[#5a6073]">
                {filterType === "All" && filterStatus === "All" 
                  ? "No messages yet. Approved submissions will appear here."
                  : "No messages match your current filters."
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 transition-all hover:shadow-md ${
                  notification.status === "unread" ? "border-l-4 border-l-[#002fa7]" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Unread Indicator */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${
                      notification.status === "unread" ? "bg-[#002fa7]" : "bg-transparent border-2 border-[#e3e6ee]"
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
                          {getTypeDisplayName(notification.type)}
                        </span>
                        {notification.priority === "high" && (
                          <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-[#dc2626]/10 text-[#dc2626]">
                            High Priority
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] text-[#8b91a5] whitespace-nowrap">
                        {getFormattedDate(notification)}
                      </span>
                    </div>
                    
                    <p className="text-[13px] sm:text-[14px] text-[#5a6073] mb-3">
                      {notification.message}
                    </p>
                    
                    {/* Metadata for content actions */}
                    {['article', 'event', 'opportunity'].includes(notification.type) && notification.metadata?.content && (
                      <div className="bg-[#f6f7fb] rounded-lg p-3 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                          <div>
                            <span className="font-semibold text-[#8b91a5]">Action:</span>
                            <span className="ml-2 text-[#2c3348] capitalize">{notification.metadata.action || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#8b91a5]">Category:</span>
                            <span className="ml-2 text-[#2c3348]">{notification.metadata.content.category}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#8b91a5]">Status:</span>
                            <span className="ml-2 text-[#2c3348] capitalize">{notification.metadata.content.status}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#8b91a5]">By:</span>
                            <span className="ml-2 text-[#2c3348]">{notification.metadata.user?.name || 'Admin'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Metadata for submission actions */}
                    {notification.type === "submission" && notification.metadata?.submission && (
                      <div className="bg-[#f6f7fb] rounded-lg p-3 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                          <div>
                            <span className="font-semibold text-[#8b91a5]">Submitter:</span>
                            <span className="ml-2 text-[#2c3348]">{notification.metadata.submission.author}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#8b91a5]">Type:</span>
                            <span className="ml-2 text-[#2c3348]">{notification.metadata.submission.type}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#8b91a5]">Category:</span>
                            <span className="ml-2 text-[#2c3348]">{notification.metadata.submission.category}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#8b91a5]">Action:</span>
                            <span className="ml-2 text-[#2c3348] capitalize">{notification.metadata.action}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="font-semibold text-[#8b91a5]">Email:</span>
                            <span className="ml-2 text-[#2c3348]">{notification.metadata.submission.email}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {getActionButton(notification)}
                      {notification.status === "unread" && (
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
      )}

      <div className="mt-4 text-[13px] text-[#5a6073]">
        Showing {filteredNotifications.length} of {notifications.length} messages
      </div>
    </div>
  );
}
