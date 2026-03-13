import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />
  };

  const colors = {
    success: "bg-[#047857] text-white",
    error: "bg-[#dc2626] text-white",
    warning: "bg-[#ea580c] text-white",
    info: "bg-[#002fa7] text-white"
  };

  return (
    <div className={`fixed top-20 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] ${colors[type]} animate-slideIn`}>
      {icons[type]}
      <span className="text-[14px] font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
}
