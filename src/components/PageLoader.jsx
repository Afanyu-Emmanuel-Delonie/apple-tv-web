import { useEffect, useState } from 'react';

export default function PageLoader({ isLoading, minLoadTime = 1000 }) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Ensure minimum load time for better UX
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, minLoadTime);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minLoadTime]);

  if (!showLoader && !isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/assets/apple-tv-logo.png" 
            alt="Apple Fam TV" 
            className="w-16 h-16 mx-auto mb-4 animate-pulse"
          />
          <h1 className="text-[24px] font-playfair font-black text-[#0b1020]">
            Apple <span className="text-[#002fa7]">Fam TV</span>
          </h1>
        </div>

        {/* Loading Animation */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#e3e6ee] border-t-[#002fa7] rounded-full animate-spin mx-auto mb-4"></div>
          <div className="flex items-center justify-center gap-1 mb-2">
            <div className="w-2 h-2 bg-[#002fa7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#002fa7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#002fa7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-[14px] text-[#5a6073] font-medium">Loading content...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-[#e3e6ee] rounded-full mx-auto mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#002fa7] to-[#0066cc] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}