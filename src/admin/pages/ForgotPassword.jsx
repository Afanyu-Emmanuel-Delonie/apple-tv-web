import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Toast from "../components/Toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [toast, setToast] = useState(null);
  const { resetPassword } = useAuth();

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await resetPassword(email);
      setEmailSent(true);
      showToast('Password reset email sent! Check your inbox.', 'success');
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      
      showToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#002fa7] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="fixed w-[420px] h-[420px] rounded-full bg-white/[0.06] -top-[120px] -right-[80px] pointer-events-none" />
      <div className="fixed w-[320px] h-[320px] rounded-full bg-white/[0.05] -bottom-[100px] -left-[60px] pointer-events-none" />

      {/* Card */}
      <div className="relative bg-white rounded-[24px] w-full max-w-[460px] min-h-[420px] p-[52px_52px_48px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.25),0_4px_16px_rgba(0,0,0,0.12)] animate-fadeUp">
        {/* Blob decorations inside card */}
        <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full bg-[#002fa7] pointer-events-none" />
        <div className="absolute -bottom-[70px] -left-[50px] w-[180px] h-[180px] rounded-full bg-[#002fa7] pointer-events-none" />
        <div className="absolute top-[60px] -right-[20px] w-[90px] h-[90px] rounded-full bg-white/15 pointer-events-none" />

        {/* Form content */}
        <div className="relative z-10">
          {/* Back button */}
          <Link 
            to="/admin/login" 
            className="inline-flex items-center gap-2 text-[13px] text-[#9ba8b8] hover:text-[#002fa7] transition-colors mb-6 no-underline"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>

          {!emailSent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-[#002fa7]" />
                </div>
                <h1 className="font-playfair text-[30px] font-bold text-[#0f1c2e] mb-2">
                  Forgot Password?
                </h1>
                <p className="text-[13px] text-[#9ba8b8] font-light">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white disabled:opacity-50"
                      placeholder="Enter your email address"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#002fa7] text-white text-[14px] font-semibold rounded-[10px] tracking-[0.04em] transition-all hover:bg-[#0026c4] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-green-600" />
                </div>
                <h1 className="font-playfair text-[30px] font-bold text-[#0f1c2e] mb-2">
                  Check Your Email
                </h1>
                <p className="text-[13px] text-[#9ba8b8] font-light mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-[12px] text-[#9ba8b8] mb-8">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                    }}
                    className="w-full h-12 bg-[#002fa7] text-white text-[14px] font-semibold rounded-[10px] tracking-[0.04em] transition-all hover:bg-[#0026c4] active:scale-[0.98]"
                  >
                    Try Different Email
                  </button>
                  
                  <Link
                    to="/admin/login"
                    className="block w-full h-12 border border-[#e5e9f0] text-[#0f1c2e] text-[14px] font-semibold rounded-[10px] transition-all hover:border-[#002fa7] hover:bg-[#f8f9fb] active:scale-[0.98] no-underline flex items-center justify-center"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>
    </div>
  );
}