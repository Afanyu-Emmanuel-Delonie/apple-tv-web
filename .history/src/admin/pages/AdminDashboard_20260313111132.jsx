import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState([
    { label: "Total Articles", value: "156", change: "+12 this week", color: "#002fa7", icon: TrendingUp },
    { label: "Pending Submissions", value: "0", change: "Needs review", color: "#ea580c", icon: Clock },
    { label: "Total Events", value: "12", change: "+3 this month", color: "#047857", icon: CheckCircle },
    { label: "Total Opportunities", value: "18", change: "+5 this week", color: "#7c3aed", icon: AlertCircle },
  ]);

  // Load submissions from localStorage
  useEffect(() => {
    const loadSubmissions = () => {
      const storedSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      setSubmissions(storedSubmissions);
      
      // Update stats with real data
      const pendingCount = storedSubmissions.filter(s => s.status === 'pending').length;
      setStats(prevStats => 
        prevStats.map(stat => 
          stat.label === "Pending Submissions" 
            ? { ...stat, value: pendingCount.toString() }
            : stat
        )
      );
    };

    loadSubmissions();
    
    // Listen for storage changes (when submissions are updated)
    const handleStorageChange = () => {
      loadSubmissions();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for updates
    const interval = setInterval(loadSubmissions, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Get recent submissions (last 3)
  const recentSubmissions = submissions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-playfair font-black text-[#0b1020] mb-2">Dashboard</h1>
        <p className="text-[13px] sm:text-[14px] text-[#5a6073]">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
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
                    <span>{submission.type}</span>
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
                    className="px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors no-underline"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <button className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 text-left hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-[#002fa7]/10 rounded-full flex items-center justify-center mb-4">
            <div className="w-6 h-6 rounded-full bg-[#002fa7]" />
          </div>
          <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Create Article</h3>
          <p className="text-[13px] text-[#5a6073]">Publish a new news article</p>
        </button>

        <button className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 text-left hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-[#047857]/10 rounded-full flex items-center justify-center mb-4">
            <div className="w-6 h-6 rounded-full bg-[#047857]" />
          </div>
          <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Add Event</h3>
          <p className="text-[13px] text-[#5a6073]">Create a new event listing</p>
        </button>

        <button className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 text-left hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-[#7c3aed]/10 rounded-full flex items-center justify-center mb-4">
            <div className="w-6 h-6 rounded-full bg-[#7c3aed]" />
          </div>
          <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Post Opportunity</h3>
          <p className="text-[13px] text-[#5a6073]">Add a job or opportunity</p>
        </button>
      </div>
    </div>
  );
}
