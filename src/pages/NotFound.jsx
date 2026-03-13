import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  useSEO({
    title: 'Page Not Found - Apple Fam TV',
    description: 'The page you are looking for could not be found. Return to Apple Fam TV homepage or explore our latest news and opportunities.',
    keywords: '404, page not found, Apple Fam TV, error page',
    type: 'website'
  });

  const popularLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/international-news", label: "International News" },
    { to: "/business-news", label: "Business News" },
    { to: "/regional-news", label: "Regional News" },
    { to: "/opportunities", label: "Opportunities" },
    { to: "/events", label: "Events" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center px-6">
      <div className="max-w-[600px] w-full text-center">
        
        {/* 404 Illustration */}
        <div className="relative mb-12">
          {/* Large 404 Text */}
          <div className="relative">
            <h1 className="text-[clamp(120px,20vw,200px)] font-playfair font-black text-[#002fa7]/10 leading-none select-none">
              404
            </h1>
            
            {/* Apple Fam TV Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-8 shadow-[0_20px_50px_rgba(0,47,167,0.15)] border border-[#002fa7]/10">
                <img 
                  src="/assets/apple-tv-logo.png" 
                  alt="Apple Fam TV Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-3 h-3 bg-[#002fa7] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute top-20 right-16 w-2 h-2 bg-[#002fa7]/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-16 left-20 w-4 h-4 bg-[#002fa7]/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-10 right-10 w-2 h-2 bg-[#002fa7]/80 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-[clamp(28px,5vw,42px)] font-playfair font-black text-[#0b1020] leading-[1.1] mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-[18px] text-[#2c3348]/70 leading-[1.6] mb-2">
            The page you're looking for seems to have wandered off.
          </p>
          <p className="text-[16px] text-[#2c3348]/60 leading-[1.6]">
            Don't worry, let's get you back on track with the latest news and opportunities.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#002fa7] text-white text-[15px] font-semibold rounded-lg hover:bg-[#001f73] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,47,167,0.3)] hover:-translate-y-0.5 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#002fa7] text-[15px] font-semibold rounded-lg border-2 border-[#002fa7]/20 hover:border-[#002fa7] hover:bg-[#002fa7]/5 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Popular Links */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#e3e6ee]">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Search className="w-5 h-5 text-[#002fa7]" />
            <h3 className="text-[18px] font-semibold text-[#0b1020]">Explore Popular Sections</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-4 py-3 text-[14px] font-medium text-[#2c3348] hover:text-[#002fa7] hover:bg-[#002fa7]/5 rounded-lg transition-all duration-200 group"
              >
                {Icon && <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-[14px] text-[#2c3348]/50 mb-2">
            Still can't find what you're looking for?
          </p>
          <Link 
            to="/submit-story" 
            className="text-[14px] text-[#002fa7] hover:underline font-medium"
          >
            Submit a story or contact us
          </Link>
        </div>

        {/* Brand Footer */}
        <div className="mt-12 pt-8 border-t border-[#e3e6ee]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img 
              src="/assets/apple-tv-logo.png" 
              alt="Apple Fam TV" 
              className="w-6 h-6 object-contain"
            />
            <span className="font-playfair text-[16px] font-black text-[#0b1020]">
              Apple <span className="text-[#002fa7]">Fam TV</span>
            </span>
          </div>
          <p className="text-[12px] text-[#2c3348]/40">
            Your trusted source for news and opportunities
          </p>
        </div>
      </div>
    </div>
  );
}
