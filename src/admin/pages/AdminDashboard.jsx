import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Articles", value: "156", change: "+12 this week", color: "#002fa7", icon: TrendingUp },
    { label: "Pending Submissions", value: "23", change: "Needs review", color: "#ea580c", icon: Clock },
    { label: "Total Events", value: "12", change: "+3 this month", color: "#047857", icon: CheckCircle },
    { label: "Total Opportunities", value: "18", change: "+5 this week", color: "#7c3aed", icon: AlertCircle },
  ];

  const recentSubmissions = [
    { id: 1, title: "Breaking: New Government Policy Announced", type: "News Story", author: "John Doe", date: "2 hours ago", status: "pending" },
    { id: 2, title: "Software Developer Position at TechCorp", type: "Job Offer", author: "Jane Smith", date: "5 hours ago", status: "pending" },
    { id: 3, title: "Youth Leadership Summit 2024", type: "Event", author: "Mike Johnson", date: "1 day ago", status: "approved" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-playfair font-black text-[#0b1020] mb-2">Dashboard</h1>
        <p className="text-[14px] text-[#5a6073]">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-[#e3e6ee] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-[28px] font-black text-[#0b1020] mb-1">{stat.value}</div>
              <div className="text-[13px] font-semibold text-[#2c3348] mb-2">{stat.label}</div>
              <div className="text-[12px] text-[#5a6073]">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-[#0b1020]">Recent Submissions</h2>
          <button className="text-[13px] text-[#002fa7] font-semibold hover:underline">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentSubmissions.map((submission) => (
            <div key={submission.id} className="flex items-center justify-between py-4 border-b border-[#e3e6ee] last:border-0">
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-[#0b1020] mb-1">{submission.title}</h3>
                <div className="flex items-center gap-3 text-[12px] text-[#5a6073]">
                  <span>{submission.type}</span>
                  <span>•</span>
                  <span>By {submission.author}</span>
                  <span>•</span>
                  <span>{submission.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                  submission.status === "pending" 
                    ? "bg-[#ea580c]/10 text-[#ea580c]" 
                    : "bg-[#047857]/10 text-[#047857]"
                }`}>
                  {submission.status}
                </span>
                <button className="px-4 py-2 text-[13px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white rounded-lg border border-[#e3e6ee] p-6 text-left hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-[#002fa7]/10 rounded-full flex items-center justify-center mb-4">
            <div className="w-6 h-6 rounded-full bg-[#002fa7]" />
          </div>
          <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Create Article</h3>
          <p className="text-[13px] text-[#5a6073]">Publish a new news article</p>
        </button>

        <button className="bg-white rounded-lg border border-[#e3e6ee] p-6 text-left hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-[#047857]/10 rounded-full flex items-center justify-center mb-4">
            <div className="w-6 h-6 rounded-full bg-[#047857]" />
          </div>
          <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Add Event</h3>
          <p className="text-[13px] text-[#5a6073]">Create a new event listing</p>
        </button>

        <button className="bg-white rounded-lg border border-[#e3e6ee] p-6 text-left hover:shadow-lg transition-shadow">
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
