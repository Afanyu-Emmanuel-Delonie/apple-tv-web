import { useState } from "react";
import { Link } from "react-router-dom";
import { opportunityCategories, opportunities } from "../constants/opportunities";
import OpportunitiesCTA from "../components/OpportunitiesCTA";

export default function Opportunities() {
  const [selectedCategory, setSelectedCategory] = useState("All Opportunities");
  const [currentPage, setCurrentPage] = useState(1);
  const opportunitiesPerPage = 6;

  const filteredOpportunities = selectedCategory === "All Opportunities"
    ? opportunities
    : opportunities.filter(opp => opp.category === selectedCategory);

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / opportunitiesPerPage);
  const startIndex = (currentPage - 1) * opportunitiesPerPage;
  const endIndex = startIndex + opportunitiesPerPage;
  const currentOpportunities = filteredOpportunities.slice(startIndex, endIndex);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#047857] to-[#059669] py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70">
              Career & Growth
            </span>
          </div>
          <h1 className="text-[clamp(24px,5vw,48px)] font-playfair font-black text-white leading-[1.05] mb-4">
            Discover Your Next <span className="italic">Opportunity</span>
          </h1>
          <p className="text-[14px] sm:text-[16px] text-white/80 max-w-[700px] leading-relaxed">
            Explore jobs, internships, fellowships, grants, and volunteer opportunities. Find the perfect match for your career goals and aspirations.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Featured Opportunities */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <h2 className="text-[24px] sm:text-[32px] font-playfair font-black text-[#0b1020]">Featured Opportunities</h2>
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#8b91a5]">Hot Picks</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {opportunities.slice(0, 3).map((opportunity) => {
              const categoryColor = opportunityCategories.find(c => c.name === opportunity.category)?.color || "#047857";
              return (
                <div key={opportunity.id} className="group cursor-pointer">
                  <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden mb-4">
                    <img src={opportunity.image} alt={opportunity.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <span className="inline-block px-2 sm:px-3 py-1 text-white text-[9px] sm:text-[10px] font-bold tracking-[0.1em] uppercase rounded" style={{ backgroundColor: categoryColor }}>
                        {opportunity.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                      <h3 className="text-[16px] sm:text-[20px] font-playfair font-black text-white leading-[1.2] group-hover:text-[#ffd700] transition-colors">
                        {opportunity.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-10 overflow-x-auto pb-2">
          {opportunityCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.name)}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-semibold rounded transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                selectedCategory === category.name
                  ? "bg-[#002fa7] text-white"
                  : "bg-white text-[#2c3348] border border-[#e3e6ee] hover:border-[#002fa7]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-[13px] sm:text-[14px] text-[#2c3348]/60">
            Showing <span className="font-semibold text-[#002fa7]">{startIndex + 1}-{Math.min(endIndex, filteredOpportunities.length)}</span> of <span className="font-semibold text-[#002fa7]">{filteredOpportunities.length}</span> opportunities
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {currentOpportunities.map((opportunity) => {
            const categoryColor = opportunityCategories.find(c => c.name === opportunity.category)?.color || "#047857";
            return (
              <article key={opportunity.id} className="bg-white rounded-lg overflow-hidden border border-[#e3e6ee] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group h-full">
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img src={opportunity.image} alt={opportunity.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded" style={{ backgroundColor: categoryColor }}>
                      {opportunity.category}
                    </span>
                    <span className="px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded bg-[#0b1020]">
                      {opportunity.type}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] sm:text-[11px] font-medium text-[#8b91a5] truncate">
                      {opportunity.company}
                    </span>
                  </div>
                  <h3 className="text-[16px] sm:text-[18px] font-playfair font-bold text-[#0b1020] leading-[1.3] mb-2 group-hover:text-[#002fa7] transition-colors line-clamp-2">
                    {opportunity.title}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-[#2c3348]/70 leading-[1.6] mb-3 line-clamp-2">
                    {opportunity.excerpt}
                  </p>
                  <div className="space-y-2 pt-3 border-t border-[#e3e6ee]">
                    <div className="flex items-center justify-between text-[11px] sm:text-[12px] gap-2">
                      <span className="text-[#8b91a5] truncate flex-1">{opportunity.location}</span>
                      <span className="font-bold text-[#002fa7] whitespace-nowrap">{opportunity.salary}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] sm:text-[12px]">
                      <span className="text-[#8b91a5] truncate">Deadline: {opportunity.deadline}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 sm:mb-12 overflow-x-auto pb-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-semibold text-[#2c3348] border border-[#e3e6ee] rounded hover:border-[#002fa7] disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            >
              Previous
            </button>
            <div className="flex gap-1 sm:gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 text-[12px] sm:text-[13px] font-semibold rounded transition-all ${
                        currentPage === pageNum
                          ? "bg-[#002fa7] text-white"
                          : "text-[#2c3348] border border-[#e3e6ee] hover:border-[#002fa7]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="text-[#8b91a5] text-[12px] sm:text-[14px]">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-semibold text-[#2c3348] border border-[#e3e6ee] rounded hover:border-[#002fa7] disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            >
              Next
            </button>
          </div>
        )}

        {/* Application Tips */}
        <div className="bg-white border border-[#e3e6ee] rounded-xl sm:rounded-2xl p-6 sm:p-8">
          <h2 className="text-[22px] sm:text-[28px] font-playfair font-black text-[#0b1020] mb-4 sm:mb-6 text-center">Application Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[14px] sm:text-[16px] font-bold text-[#0b1020] mb-2">Tailor Your Resume</h3>
              <p className="text-[12px] sm:text-[13px] text-[#5a6073] leading-relaxed">Customize your CV for each application to highlight relevant skills and experience.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[14px] sm:text-[16px] font-bold text-[#0b1020] mb-2">Research the Company</h3>
              <p className="text-[12px] sm:text-[13px] text-[#5a6073] leading-relaxed">Learn about the organization's mission, values, and recent achievements before applying.</p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[14px] sm:text-[16px] font-bold text-[#0b1020] mb-2">Follow Up</h3>
              <p className="text-[12px] sm:text-[13px] text-[#5a6073] leading-relaxed">Send a polite follow-up email if you haven't heard back within the stated timeframe.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <OpportunitiesCTA
        eyebrow="Stay Ahead"
        headline="Get Notified "
        highlightText=" New "
        description="Receive instant alerts about jobs, internships, fellowships, and grants that match your profile. Never miss your dream opportunity."
        primaryButtonText="Subscribe to Alerts"
        accentColor="#002fa7"
      />
    </div>
  );
}
