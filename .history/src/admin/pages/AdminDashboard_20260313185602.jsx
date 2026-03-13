import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Clock, CheckCircle, AlertCircle, MessageSquare, Users, Calendar, Briefcase } from "lucide-react";
import { getAll, COLLECTIONS } from "../../services/firebase/firestore";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Articles", value: "0", change: "Loading...", color: "#002fa7", icon: TrendingUp },
    { label: "Pending Submissions", value: "0", change: "Loading...", color: "#ea580c", icon: Clock },
    { label: "Total Events", value: "0", change: "Loading...", color: "#047857", icon: Calendar },
    { label: "Total Opportunities", value: "0", change: "Loading...", color: "#7c3aed", icon: Briefcase },
  ]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [additionalStats, setAdditionalStats] = useState([
    { label: "Unread Messages", value: "0", change: "Loading...", color: "#0891b2", icon: MessageSquare },
    { label: "Published This Week", value: "0", change: "Loading...", color: "#047857", icon: CheckCircle },
  ]);

  // Load all data from Firebase
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load all collections in parallel
        const [articles, events, opportunities, submissions, notifications] = await Promise.all([
          getAll(COLLECTIONS.ARTICLES),
          getAll(COLLECTIONS.EVENTS),
          getAll(COLLECTIONS.OPPORTUNITIES),
          getAll(COLLECTIONS.SUBMISSIONS),
          getAll(COLLECTIONS.NOTIFICATIONS)
        ]);

        // Calculate date ranges
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Helper function to check if item was created in timeframe
        const isCreatedInTimeframe = (item, timeframe) => {
          if (!item.createdAt) return false;
          const createdDate = item.createdAt.seconds ? 
            new Date(item.createdAt.seconds * 1000) : 
            new Date(item.createdAt);
          return createdDate >= timeframe;
        };

        // Calculate stats
        const articlesThisWeek = articles.filter(a => isCreatedInTimeframe(a, oneWeekAgo)).length;
        const eventsThisMonth = events.filter(e => isCreatedInTimeframe(e, oneMonthAgo)).length;
        const opportunitiesThisWeek = opportunities.filter(o => isCreatedInTimeframe(o, oneWeekAgo)).length;
        const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
        const unreadMessages = notifications.filter(n => n.status === 'unread').length;
        
        // Calculate published this week (approved submissions)
        const publishedThisWeek = submissions.filter(s => 
          s.status === 'approved' && isCreatedInTimeframe(s, oneWeekAgo)
        ).length;

        // Update main stats
        setStats([
          { 
            label: "Total Articles", 
            value: articles.length.toString(), 
            change: articlesThisWeek > 0 ? `+${articlesThisWeek} this week` : "No new articles this week", 
            color: "#002fa7", 
            icon: TrendingUp 
          },
          { 
            label: "Pending Submissions", 
            value: pendingSubmissions.toString(), 
            change: pendingSubmissions > 0 ? "Needs review" : "All caught up!", 
            color: "#ea580c", 
            icon: Clock 
          },
          { 
            label: "Total Events", 
            value: events.length.toString(), 
            change: eventsThisMonth > 0 ? `+${eventsThisMonth} this month` : "No new events this month", 
            color: "#047857", 
            icon: Calendar 
          },
          { 
            label: "Total Opportunities", 
            value: opportunities.length.toString(), 
            change: opportunitiesThisWeek > 0 ? `+${opportunitiesThisWeek} this week` : "No new opportunities this week", 
            color: "#7c3aed", 
            icon: Briefcase 
          },
        ]);

        // Update additional stats
        setAdditionalStats([
          { 
            label: "Unread Messages", 
            value: unreadMessages.toString(), 
            change: unreadMessages > 0 ? "Requires attention" : "All messages read", 
            color: "#0891b2", 
            icon: MessageSquare 
          },
          { 
            label: "Published This Week", 
            value: publishedThisWeek.toString(), 
            change: publishedThisWeek > 0 ? "Great progress!" : "No publications this week", 
            color: "#047857", 
            icon: CheckCircle 
          },
        ]);

        // Get recent submissions (last 5)
        const sortedSubmissions = submissions
          .sort((a, b) => {
            const aTime = a.createdAt?.seconds || 0;
            const bTime = b.createdAt?.seconds || 0;
            return bTime - aTime;
          })
          .slice(0, 5)
          .map(submission => ({
            ...submission,
            date: getFormattedDate(submission)
          }));
        
        setRecentSubmissions(sortedSubmissions);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getFormattedDate = (item) => {
    if (item.createdAt && item.createdAt.seconds) {
      const date = new Date(item.createdAt.seconds * 1000);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-playfair font-black text-[#0b1020] mb-2">Dashboard</h1>
        <p className="text-[13px] sm:text-[14px] text-[#5a6073]">Welcome back! Here's what's happening with Apple Fam TV.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-[#e3e6ee] p-12 text-center mb-6">
          <div className="inline-block w-8 h-8 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[14px] text-[#5a6073]">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                      <Icon size={24} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="text-[24px] sm:text-[28px] font-black text-[#0b1020] mb-1">{stat.value}</div>
                  <div className="text-[13px] font-semibold text-[#2c3348] mb-2">{stat.label}</div>
                  <div className="text-[12px] text-[#5a6073]">{stat.change}</div>
                </div>
              );
            })}
          </div>

          {/* Additional Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {additionalStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                      <Icon size={24} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="text-[24px] sm:text-[28px] font-black text-[#0b1020] mb-1">{stat.value}</div>
                  <div className="text-[13px] font-semibold text-[#2c3348] mb-2">{stat.label}</div>
                  <div className="text-[12px] text-[#5a6073]">{stat.change}</div>
                </div>
              );
            })}
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 mb-6 lg:mb-8 overflow-x-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0b1020]">Recent Submissions</h2>
              <Link 
                to="/admin/submissions"
                className="text-[12px] sm:text-[13px] text-[#002fa7] font-semibold hover:underline no-underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock size={24} className="text-[#8b91a5]" />
                  </div>
                  <p className="text-[14px] text-[#5a6073]">No recent submissions</p>
                  <p className="text-[12px] text-[#8b91a5] mt-1">New submissions will appear here</p>
                </div>
              ) : (
                recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-[#e3e6ee] last:border-0 gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#0b1020] mb-1 truncate">{submission.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-[12px] text-[#5a6073]">
                        <span>{submission.type || submission.submissionType}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>By {submission.author}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{submission.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                        submission.status === "pending" 
                          ? "bg-[#ea580c]/10 text-[#ea580c]" 
                          : submission.status === "approved"
                          ? "bg-[#047857]/10 text-[#047857]"
                          : "bg-[#dc2626]/10 text-[#dc2626]"
                      }`}>
                        {submission.status}
                      </span>
                      <Link
                        to="/admin/submissions"
                        className="px-3  sm:px-4 py-2 text-[12px] sm:text-[13px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors no-underline"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Link 
              to="/admin/articles"
              className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 text-left hover:shadow-lg transition-shadow no-underline"
            >
              <div className="w-12 h-12 bg-[#002fa7]/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-[#002fa7]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Manage Articles</h3>
              <p className="text-[13px] text-[#5a6073]">View and edit news articles</p>
            </Link>

            <Link 
              to="/admin/events"
              className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 text-left hover:shadow-lg transition-shadow no-underline"
            >
              <div className="w-12 h-12 bg-[#047857]/10 rounded-full flex items-center justify-center mb-4">
                <Calendar size={24} className="text-[#047857]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Manage Events</h3>
              <p className="text-[13px] text-[#5a6073]">Create and manage events</p>
            </Link>

            <Link 
              to="/admin/opportunities"
              className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 text-left hover:shadow-lg transition-shadow no-underline"
            >
              <div className="w-12 h-12 bg-[#7c3aed]/10 rounded-full flex items-center justify-center mb-4">
                <Briefcase size={24} className="text-[#7c3aed]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Manage Opportunities</h3>
              <p className="text-[13px] text-[#5a6073]">Add jobs and opportunities</p>
            </Link>

            <Link 
              to="/admin/notifications"
              className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 text-left hover:shadow-lg transition-shadow no-underline"
            >
              <div className="w-12 h-12 bg-[#0891b2]/10 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-[#0891b2]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">View Messages</h3>
              <p className="text-[13px] text-[#5a6073]">Check notifications and messages</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
