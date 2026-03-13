import { useState } from "react";
import { Link } from "react-router-dom";
import { regions, regionalStories } from "../constants/regionalNews";
import OpportunitiesCTA from "../components/OpportunitiesCTA";

export default function RegionalNewsPage() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 6;

  const filteredStories = selectedRegion === "All" 
    ? regionalStories 
    : regionalStories.filter(story => story.region === selectedRegion);

  // Pagination logic
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
  const startIndex = (currentPage - 1) * storiesPerPage;
  const endIndex = startIndex + storiesPerPage;
  const currentStories = filteredStories.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setCurrentPage(1);
  };

  // Regional stats for quick insights
  const regionalStats = [
    { label: "Active Regions", value: "10", icon: "📍" },
    { label: "Stories Published", value: "150+", icon: "📰" },
    { label: "Local Reporters", value: "45", icon: "✍️" },
    { label: "Weekly Updates", value: "30+", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#002fa7] to-[#0066cc] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70">
              Regional Coverage
            </span>
          </div>
          <h1 
            className="text-[clamp(28px,6vw,56px)] font-black text-white leading-[1.05] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            News Across <span className="italic">Cameroon</span>
          </h1>
          <p className="text-[16px] text-white/80 max-w-[700px] leading-relaxed">
            Comprehensive coverage from all 10 regions. Stay connected with local developments, infrastructure projects, and community stories that matter.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        
        {/* Top Regional News Highlights */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[32px] font-playfair font-black text-[#0b1020]">Top Regional Stories</h2>
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#8b91a5]">Featured</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {regionalStories.slice(0, 3).map((story) => {
              const regionColor = regions.find(r => r.name === story.region)?.color || "#002fa7";
              return (
                <Link to={`/article/${story.id}`} key={story.id} className="group">
                  <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span
                        className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded"
                        style={{ backgroundColor: regionColor }}
                      >
                        {story.region}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-[20px] font-playfair font-black text-white leading-[1.2] group-hover:text-[#ffd700] transition-colors">
                        {story.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => handleRegionChange("All")}
            className={`px-5 py-2.5 text-[13px] font-semibold rounded transition-all duration-200 ${
              selectedRegion === "All"
                ? "bg-[#002fa7] text-white"
                : "bg-white text-[#2c3348] border border-[#e3e6ee] hover:border-[#002fa7]"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            All Regions
          </button>
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => handleRegionChange(region.name)}
              className={`px-5 py-2.5 text-[13px] font-semibold rounded transition-all duration-200 ${
                selectedRegion === region.name
                  ? "bg-[#002fa7] text-white"
                  : "bg-white text-[#2c3348] border border-[#e3e6ee] hover:border-[#002fa7]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {region.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[14px] text-[#2c3348]/60">
            Showing <span className="font-semibold text-[#002fa7]">{startIndex + 1}-{Math.min(endIndex, filteredStories.length)}</span> of <span className="font-semibold text-[#002fa7]">{filteredStories.length}</span> {filteredStories.length === 1 ? 'story' : 'stories'}
            {selectedRegion !== "All" && <span> from <span className="font-semibold text-[#002fa7]">{selectedRegion}</span></span>}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentStories.map((story) => {
            const regionColor = regions.find(r => r.name === story.region)?.color || "#002fa7";
            
            return (
              <Link to={`/article/${story.id}`} key={story.id}>
                <article 
                  className="bg-white rounded-lg overflow-hidden border border-[#e3e6ee] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group h-full"
                >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span 
                      className="px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded"
                      style={{ backgroundColor: regionColor }}
                    >
                      {story.region}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-medium text-[#8b91a5] uppercase tracking-wide">
                      {story.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#e3e6ee]" />
                    <span className="text-[11px] text-[#8b91a5]">
                      {story.date}
                    </span>
                  </div>
                  
                  <h3 
                    className="text-[18px] font-bold text-[#0b1020] leading-[1.3] mb-2 group-hover:text-[#002fa7] transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {story.title}
                  </h3>
                  
                  <p className="text-[14px] text-[#2c3348]/70 leading-[1.6] mb-4">
                    {story.excerpt}
                  </p>

                  <button 
                    className="text-[13px] font-semibold text-[#002fa7] hover:text-[#ff0800] transition-colors inline-flex items-center gap-1.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Read Full Story
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </article>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-[13px] font-semibold text-[#2c3348] border border-[#e3e6ee] rounded hover:border-[#002fa7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              // Show first, last, current, and adjacent pages
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 text-[13px] font-semibold rounded transition-all ${
                      currentPage === pageNum
                        ? "bg-[#002fa7] text-white"
                        : "text-[#2c3348] border border-[#e3e6ee] hover:border-[#002fa7]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === currentPage - 2 ||
                pageNum === currentPage + 2
              ) {
                return <span key={pageNum} className="text-[#8b91a5]">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-[13px] font-semibold text-[#2c3348] border border-[#e3e6ee] rounded hover:border-[#002fa7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}

        {/* Regional Stats Section */}
        <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e8eef5] rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-[32px] font-playfair font-black text-[#0b1020] mb-2">Regional Coverage at a Glance</h2>
            <p className="text-[15px] text-[#5a6073]">Comprehensive news network across Cameroon</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {regionalStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-[32px] font-black text-[#002fa7] mb-1">{stat.value}</div>
                <div className="text-[13px] text-[#5a6073] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Map Placeholder */}
        <div className="bg-white border border-[#e3e6ee] rounded-2xl p-8 mb-12">
          <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mb-4 text-center">Explore News by Region</h2>
          <p className="text-[15px] text-[#5a6073] text-center mb-8">Click on any region to view localized stories and updates</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {regions.map((region) => {
              const regionStoryCount = regionalStories.filter(s => s.region === region.name).length;
              return (
                <button
                  key={region.id}
                  onClick={() => handleRegionChange(region.name)}
                  className="group relative p-6 bg-gradient-to-br from-white to-[#f8f9fa] border-2 border-[#e3e6ee] rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: selectedRegion === region.name ? region.color : undefined,
                    backgroundColor: selectedRegion === region.name ? `${region.color}10` : undefined,
                  }}
                >
                  <div className="text-center">
                    <div className="text-[20px] font-black text-[#0b1020] mb-1">{region.name}</div>
                    <div className="text-[12px] font-semibold" style={{ color: region.color }}>
                      {regionStoryCount} {regionStoryCount === 1 ? 'story' : 'stories'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredStories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[16px] text-[#2c3348]/60 mb-4">No stories found for this region.</p>
            <button
              onClick={() => handleRegionChange("All")}
              className="px-6 py-3 bg-[#002fa7] text-white text-[13px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer transition-all duration-200 hover:bg-[#ff0800]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              View All Regions
            </button>
          </div>
        )}
      </div>

      {/* Opportunities CTA */}
      <OpportunitiesCTA />
    </div>
  );
}
