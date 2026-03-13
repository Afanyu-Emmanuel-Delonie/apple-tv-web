import { useState } from "react";
import { regions, regionalStories } from "../constants/regionalNews";
import { Link } from "react-router-dom";

export default function RegionalNews() {
  // Show only the first story as featured
  const featuredStory = regionalStories[0];
  const regionColor = regions.find(r => r.name === featuredStory.region)?.color || "#002fa7";

  return (
    <section className="py-16 bg-[#f8f9fb]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#002fa7]" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#002fa7]/60">
              Regional Coverage
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 
                className="text-[clamp(32px,4vw,44px)] font-black text-[#0b1020] leading-[1.1] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                News Across <span className="text-[#002fa7] italic">Cameroon</span>
              </h2>
              <p className="text-[15px] text-[#2c3348]/70 max-w-[600px]">
                Stay informed with stories from every corner of the nation.
              </p>
            </div>
          
                          <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#002fa7] text-white text-[12px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer border-none transition-all duration-150 whitespace-nowrap hover:bg-[#0026c4] hover:-translate-y-px active:translate-y-0"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Read More 
              </button>
          </div>
        </div>

        {/* Featured Story */}
        <article className="bg-white rounded-lg overflow-hidden border border-[#e3e6ee] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img 
                src={featuredStory.image} 
                alt={featuredStory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <span 
                  className="px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded"
                  style={{ backgroundColor: regionColor }}
                >
                  {featuredStory.region}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-medium text-[#8b91a5] uppercase tracking-wide">
                  {featuredStory.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#e3e6ee]" />
                <span className="text-[11px] text-[#8b91a5]">
                  {featuredStory.date}
                </span>
              </div>
              
              <h3 
                className="text-[28px] font-bold text-[#0b1020] leading-[1.2] mb-4 group-hover:text-[#002fa7] transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {featuredStory.title}
              </h3>
              
              <p className="text-[15px] text-[#2c3348]/70 leading-[1.7] mb-6">
                {featuredStory.excerpt}
              </p>

              <button 
                className="text-[13px] font-semibold text-[#002fa7] hover:text-[#ff0800] transition-colors inline-flex items-center gap-1.5 w-fit"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Read Full Story
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </article>

        {/* Mobile View All Button */}
        <div className="flex justify-center mt-8 md:hidden">
          <Link
            to="/regional-news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#002fa7] text-white text-[13px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer transition-all duration-200 hover:bg-[#ff0800] no-underline"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            View All Regions
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
