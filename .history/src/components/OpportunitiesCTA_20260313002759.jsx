export default function OpportunitiesCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#002fa7] to-[#0066cc]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[800px] mx-auto">
          
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70">
              Exclusive Access
            </span>
          </div>

          {/* Headline */}
          <h2
            className="text-[clamp(32px,4.5vw,48px)] font-black text-white leading-[1.1] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join Our Community for{" "}
            <span className="italic text-[#ff0800]">Exclusive</span> Opportunities
          </h2>

          {/* Description */}
          <p className="text-[16px] text-white/80 leading-[1.7] mb-10 max-w-[600px] mx-auto">
            Get early access to job openings, scholarship announcements, networking events, 
            and career development resources tailored for Cameroonians.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#ff0800] text-white text-[14px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer transition-all duration-200 hover:bg-[#c80600] hover:shadow-[0_8px_24px_rgba(255,8,0,0.3)] hover:-translate-y-0.5 active:scale-95"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Join Community
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-[14px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer transition-all duration-200 hover:bg-white/20 hover:border-white/50"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              See More
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/20">
            <div>
              <p
                className="text-[32px] font-black text-white leading-none mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                500+
              </p>
              <p className="text-[13px] text-white/60 uppercase tracking-wide">
                Job Listings
              </p>
            </div>
            <div>
              <p
                className="text-[32px] font-black text-white leading-none mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                200+
              </p>
              <p className="text-[13px] text-white/60 uppercase tracking-wide">
                Scholarships
              </p>
            </div>
            <div>
              <p
                className="text-[32px] font-black text-white leading-none mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                50+
              </p>
              <p className="text-[13px] text-white/60 uppercase tracking-wide">
                Events Monthly
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
