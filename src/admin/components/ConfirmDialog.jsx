import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) {
  if (!isOpen) return null;

  const buttonColors = {
    danger: "bg-[#dc2626] hover:bg-[#b91c1c]",
    warning: "bg-[#ea580c] hover:bg-[#c2410c]",
    primary: "bg-[#002fa7] hover:bg-[#0026c4]"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-[450px] mx-4 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#dc2626]/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} className="text-[#dc2626]" />
          </div>
          <div className="flex-1">
            <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">{title}</h3>
            <p className="text-[14px] text-[#5a6073] leading-relaxed">{message}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-[14px] font-semibold text-[#2c3348] border border-[#e3e6ee] rounded hover:bg-[#f0f2f8] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-3 text-[14px] font-semibold text-white rounded transition-colors ${buttonColors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
