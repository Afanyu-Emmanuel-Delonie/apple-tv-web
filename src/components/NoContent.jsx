import { Link } from "react-router-dom";

export default function NoContent({ 
  category = "this section",
  message = "No stories available at the moment",
  description = "We're working hard to bring you the latest updates. Check back soon for new content.",
  showCTA = true 
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-[600px] text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#f0f4ff] to-[#e8eef5] mb-4">
            <div className="w-12 h-12 rounded-full bg-[#002fa7]" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-[clamp(28px,5vw,42px)] font-playfair font-black text-[#0b1020] leading-[1.1] mb-4">
          {message}
        </h2>

        {/* Description */}
        <p className="text-[16px] text-[#5a6073] leading-relaxed mb-8">
          {description}
        </p>

        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#002fa7]" />
          <div className="w-2 h-2 rounded-full bg-[#002fa7]" />
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#002fa7]" />
        </div>

        {/* CTA Buttons */}
        {showCTA && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="px-8 py-4 bg-[#002fa7] text-white text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-all duration-200 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
            <Link
              to="/regional-news"
              className="px-8 py-4 bg-white text-[#002fa7] text-[14px] font-semibold rounded border-2 border-[#002fa7] hover:bg-[#002fa7] hover:text-white transition-all duration-200"
            >
              Explore Regional News
            </Link>
          </div>
        )}

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-[#e3e6ee]">
          <p className="text-[13px] font-semibold text-[#8b91a5] uppercase tracking-[0.1em] mb-4">
            You might also like
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 text-[13px] font-medium text-[#2c3348] bg-[#f8f9fa] rounded-full hover:bg-[#002fa7] hover:text-white transition-all duration-200"
            >
              Latest News
            </Link>
            <Link
              to="/category/international"
              className="px-4 py-2 text-[13px] font-medium text-[#2c3348] bg-[#f8f9fa] rounded-full hover:bg-[#002fa7] hover:text-white transition-all duration-200"
            >
              International
            </Link>
            <Link
              to="/regional-news"
              className="px-4 py-2 text-[13px] font-medium text-[#2c3348] bg-[#f8f9fa] rounded-full hover:bg-[#002fa7] hover:text-white transition-all duration-200"
            >
              Regional News
            </Link>
            <Link
              to="/opportunities"
              className="px-4 py-2 text-[13px] font-medium text-[#2c3348] bg-[#f8f9fa] rounded-full hover:bg-[#002fa7] hover:text-white transition-all duration-200"
            >
              Opportunities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
