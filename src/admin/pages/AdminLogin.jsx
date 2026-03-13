import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Toast from "../components/Toast";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(credentials.email, credentials.password);
      showToast('Login successful!', 'success');
      navigate("/admin/dashboard");
    } catch (error) {
      console.error('Login error:', error);
      showToast(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      await loginWithGoogle();
      showToast('Google sign-in successful!', 'success');
      navigate("/admin/dashboard");
    } catch (error) {
      console.error('Google sign-in error:', error);
      showToast(error.message || 'Google sign-in failed. Please try again.');
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
      <div className="relative bg-white rounded-[24px] w-full max-w-[460px] min-h-[520px] p-[52px_52px_48px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.25),0_4px_16px_rgba(0,0,0,0.12)] animate-fadeUp">
        {/* Blob decorations inside card */}
        <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full bg-[#002fa7] pointer-events-none" />
        <div className="absolute -bottom-[70px] -left-[50px] w-[180px] h-[180px] rounded-full bg-[#002fa7] pointer-events-none" />
        <div className="absolute top-[60px] -right-[20px] w-[90px] h-[90px] rounded-full bg-white/15 pointer-events-none" />

        {/* Form content */}
        <div className="relative z-10">
          <h1 className="font-playfair text-[30px] font-bold text-[#0f1c2e] text-center mb-[6px]">
            Sign in
          </h1>
          <p className="text-[13px] text-[#9ba8b8] text-center mb-8 font-light">
            Access your Apple Fam TV admin account
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white disabled:opacity-50"
                  placeholder="Email Address"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white disabled:opacity-50"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#b0bac8] hover:text-[#002fa7] transition-colors disabled:opacity-50"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Link to="/admin/forgot-password" className="block text-right text-[12px] text-[#9ba8b8] hover:text-[#002fa7] transition-colors -mt-2 mb-6 no-underline">
              Forgot Password?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#002fa7] text-white text-[14px] font-semibold rounded-[10px] tracking-[0.04em] transition-all hover:bg-[#0026c4] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[#e5e9f0]"></div>
            <span className="px-4 text-[12px] text-[#9ba8b8] font-light">or</span>
            <div className="flex-1 h-px bg-[#e5e9f0]"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 bg-white border-[1.5px] border-[#e5e9f0] text-[#0f1c2e] text-[14px] font-medium rounded-[10px] transition-all hover:border-[#002fa7] hover:bg-[#f8f9fb] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing In...' : 'Continue with Google'}
          </button>

          {/* Switch to Register */}
          <div className="mt-6 text-center">
            <p className="text-[12px] text-[#9ba8b8]">
              Don't have an account? <Link to="/admin/register" className="text-[#002fa7] font-semibold hover:underline">Sign up</Link>
            </p>
          </div>
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
