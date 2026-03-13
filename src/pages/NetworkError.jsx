import { WifiOff, RefreshCw } from "lucide-react";

export default function NetworkError() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-[500px] text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff size={48} className="text-[#8b91a5]" />
        </div>

        {/* Heading */}
        <h1 className="text-[32px] sm:text-[40px] font-playfair font-black text-[#0b1020] mb-4">
          No Internet Connection
        </h1>

        {/* Description */}
        <p className="text-[16px] text-[#5a6073] leading-relaxed mb-8">
          It looks like you're offline. Please check your internet connection and try again.
        </p>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#002fa7] text-white text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors"
        >
          <RefreshCw size={20} />
          Try Again
        </button>

        {/* Tips */}
        <div className="mt-12 pt-8 border-t border-[#e3e6ee]">
          <h3 className="text-[14px] font-bold text-[#0b1020] mb-4">Troubleshooting Tips:</h3>
          <ul className="text-[13px] text-[#5a6073] space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#002fa7] mt-1.5 flex-shrink-0" />
              <span>Check if your Wi-Fi or mobile data is turned on</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#002fa7] mt-1.5 flex-shrink-0" />
              <span>Try turning airplane mode on and off</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#002fa7] mt-1.5 flex-shrink-0" />
              <span>Restart your router or modem</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#002fa7] mt-1.5 flex-shrink-0" />
              <span>Contact your internet service provider if the problem persists</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
