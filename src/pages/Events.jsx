import { useState } from "react";
import { Link } from "react-router-dom";
import { eventCategories, events } from "../constants/events";
import OpportunitiesCTA from "../components/OpportunitiesCTA";

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  const filteredEvents = selectedCategory === "All Events"
    ? events
    : events.filter(event => event.category === selectedCategory);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const eventStats = [
    { label: "Upcoming Events", value: "12+" },
    { label: "Event Categories", value: "6" },
    { label: "Monthly Events", value: "20+" },
    { label: "Free Events", value: "8" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#002fa7] to-[#0066cc] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70">
              Events & Conferences
            </span>
          </div>
          <h1 className="text-[clamp(28px,6vw,56px)] font-playfair font-black text-white leading-[1.05] mb-4">
            Discover <span className="italic">Opportunities</span> to Connect
          </h1>
          <p className="text-[16px] text-white/80 max-w-[700px] leading-relaxed">
            Join conferences, workshops, networking events, and career fairs. Build connections, learn new skills, and advance your career.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        
        {/* Featured Events */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[32px] font-playfair font-black text-[#0b1020]">Featured Events</h2>
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#8b91a5]">Don't Miss</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {events.slice(0, 3).map((event) => {
              const categoryColor = eventCategories.find(c => c.name === event.category)?.color || "#002fa7";
              return (
                <Link to={`/event/${event.id}`} key={event.id}>
                  <div className="group cursor-pointer">
                    <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded" style={{ backgroundColor: categoryColor }}>
                          {event.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-[20px] font-playfair font-black text-white leading-[1.2] group-hover:text-[#ffd700] transition-colors">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {eventCategories.map((category) => (
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
            Showing <span className="font-semibold text-[#002fa7]">{startIndex + 1}-{Math.min(endIndex, filteredEvents.length)}</span> of <span className="font-semibold text-[#002fa7]">{filteredEvents.length}</span> events
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentEvents.map((event) => {
            const categoryColor = eventCategories.find(c => c.name === event.category)?.color || "#002fa7";
            return (
              <Link to={`/event/${event.id}`} key={event.id}>
                <article className="bg-white rounded-lg overflow-hidden border border-[#e3e6ee] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group h-full">
                <div className="relative h-48 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded" style={{ backgroundColor: categoryColor }}>
                      {event.category}
                    </span>
                    {event.price === "Free" && (
                      <span className="px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded bg-[#002fa7]">
                        FREE
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-medium text-[#8b91a5]">
                      {event.date}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-playfair font-bold text-[#0b1020] leading-[1.3] mb-2 group-hover:text-[#002fa7] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-[14px] text-[#2c3348]/70 leading-[1.6] mb-3">
                    {event.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-[#e3e6ee]">
                    <span className="text-[12px] text-[#8b91a5]">{event.location}</span>
                    <span className="text-[13px] font-bold text-[#002fa7]">{event.price}</span>
                  </div>
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
      </div>

      {/* CTA */}
      <OpportunitiesCTA
        eyebrow="Stay Updated"
        headline="Never Miss an "
        highlightText="Event"
        description="Get instant notifications about upcoming conferences, workshops, and networking opportunities. Join our community today."
        primaryButtonText="Subscribe to Events"
        accentColor="#002fa7"
      />
    </div>
  );
}
