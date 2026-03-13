import { useState } from "react";
import { Link } from "react-router-dom";
import { scholarshipCategories, scholarships } from "../constants/scholarships";
import OpportunitiesCTA from "../components/OpportunitiesCTA";

export default function ScholarshipsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Scholarships");
  const [currentPage, setCurrentPage] = useState(1);
  const scholarshipsPerPage = 6;

  const filteredScholarships = selectedCategory === "All Scholarships"
    ? scholarships
    : scholarships.filter(scholarship => scholarship.category === selectedCategory);

  // Pagination
  const totalPages = Math.ceil(filteredScholarships.length / scholarshipsPerPage);
  const startIndex = (currentPage - 1) * scholarshipsPerPage;
  const endIndex = startIndex + scholarshipsPerPage;
  const currentScholarships = filteredScholarships.slice(startIndex, endIndex);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const scholarshipStats = [
    { label: "Active Scholarships", value: "12+" },
    { label: "Scholarship Types", value: "6" },
    { label: "Full Funding", value: "8" },
    { label: "Success Rate", value: "85%" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#7c3aed] to-[#a855f7] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70">
              Education Funding
            </span>
          </div>
          <h1 className="text-[clamp(28px,6vw,56px)] font-playfair font-black text-white leading-[1.05] mb-4">
            Scholarships & <span className="italic">Grants</span>
          </h1>
          <p className="text-[16px] text-white/80 max-w-[700px] leading-relaxed">
            Discover fully-funded scholarships, research grants, and educational opportunities from top universities and organizations worldwide.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        
        {/* Featured Scholarships */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[32px] font-playfair font-black text-[#0b1020]">Featured Scholarships</h2>
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#8b91a5]">Closing Soon</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {scholarships.slice(0, 3).map((scholarship) => {
              const categoryColor = scholarshipCategories.find(c => c.name === scholarship.category)?.color || "#7c3aed";
              return (
                <div key={scholarship.id} className="group cursor-pointer">
                  <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                    <img src={scholarship.image} alt={scholarship.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded" style={{ backgroundColor: categoryColor }}>
                        {scholarship.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-[20px] font-playfair font-black text-white leading-[1.2] group-hover:text-[#ffd700] transition-colors">
                        {scholarship.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {scholarshipCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.name)}
              className={`px-5 py-2.5 text-[13px] font-semibold rounded transition-all duration-200 ${
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
        <div className="mb-6">
          <p className="text-[14px] text-[#2c3348]/60">
            Showing <span className="font-semibold text-[#002fa7]">{startIndex + 1}-{Math.min(endIndex, filteredScholarships.length)}</span> of <span className="font-semibold text-[#002fa7]">{filteredScholarships.length}</span> scholarships
          </p>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentScholarships.map((scholarship) => {
            const categoryColor = scholarshipCategories.find(c => c.name === scholarship.category)?.color || "#7c3aed";
            return (
              <article key={scholarship.id} className="bg-white rounded-lg overflow-hidden border border-[#e3e6ee] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group h-full">
                <div className="relative h-48 overflow-hidden">
                  <img src={scholarship.image} alt={scholarship.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded" style={{ backgroundColor: categoryColor }}>
                      {scholarship.category}
                    </span>
                    {scholarship.amount.includes("Full") && (
                      <span className="px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded bg-[#002fa7]">
                        FULL FUNDING
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-medium text-[#8b91a5]">
                      Deadline: {scholarship.deadline}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-playfair font-bold text-[#0b1020] leading-[1.3] mb-2 group-hover:text-[#002fa7] transition-colors">
                    {scholarship.title}
                  </h3>
                  <p className="text-[14px] text-[#2c3348]/70 leading-[1.6] mb-3">
                    {scholarship.excerpt}
                  </p>
                  <div className="space-y-2 pt-3 border-t border-[#e3e6ee]">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#8b91a5]">{scholarship.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#8b91a5]">{scholarship.field}</span>
                      <span className="font-bold text-[#002fa7]">{scholarship.amount}</span>
                    </div>
                  </div>
                </div>
              </article>
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
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
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

        {/* Application Tips */}
        <div className="bg-white border border-[#e3e6ee] rounded-2xl p-8">
          <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mb-6 text-center">Application Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Start Early</h3>
              <p className="text-[13px] text-[#5a6073]">Begin your application process at least 3-6 months before the deadline.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Tailor Your Essay</h3>
              <p className="text-[13px] text-[#5a6073]">Customize your personal statement for each scholarship application.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">Strong References</h3>
              <p className="text-[13px] text-[#5a6073]">Choose recommenders who know your work and can speak to your strengths.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <OpportunitiesCTA
        eyebrow="Get Notified"
        headline="Never Miss a "
        highlightText="Scholarship"
        description="Receive alerts about new scholarship opportunities, application deadlines, and expert tips to increase your chances of success."
        primaryButtonText="Subscribe to Alerts"
        accentColor="#002fa7"
      />
    </div>
  );
}
