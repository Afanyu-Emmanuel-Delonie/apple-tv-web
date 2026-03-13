import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-[500px]",
    md: "max-w-[700px]",
    lg: "max-w-[900px]",
    xl: "max-w-[1200px]"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden mx-4`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e6ee]">
          <h2 className="text-[20px] font-bold text-[#0b1020]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0f2f8] transition-colors"
          >
            <X size={20} className="text-[#2c3348]" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
