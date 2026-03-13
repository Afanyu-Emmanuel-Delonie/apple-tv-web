import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, UserPlus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Toast from "../components/Toast";

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "author"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingInvitation, setCheckingInvitation] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const roles = [
    { value: "admin", label: "Admin", description: "Full access to all features" },
    { value: "editor", label: "Editor", description: "Manage content and users" },
    { value: "author", label: "Author", description: "Create own content" }
  ];

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check for invitation when email changes
  const checkInvitation = async (email) => {
    if (!email || !email.includes('@')) return;
    
    setCheckingInvitation(true);
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      let foundInvitation = null;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === email && data.isInvitation) {
          foundInvitation = data;
        }
      });
      
      if (foundInvitation) {
        setInvitation(foundInvitation);
        setFormData(prev => ({
          ...prev,
          name: foundInvitation.name || prev.name,
          role: foundInvitation.role || prev.role,
          password: 'applefamtv',
          confirmPassword: 'applefamtv'
        }));
        showToast(`Invitation found! Your account details have been pre-filled. Default password is "applefamtv".`, 'success');
      } else {
        setInvitation(null);
      }
    } catch (error) {
      console.error('Error checking invitation:', error);
    } finally {
      setCheckingInvitation(false);
    }
  };

  // Debounce email check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.email) {
        checkInvitation(formData.email);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [formData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters long.");
      return;
    }

    // Check if user needs an invitation
    if (!invitation && formData.email !== 'afanyuemma2002@gmail.com') {
      showToast("You need an invitation to register. Please contact an administrator.", "error");
      return;
    }

    setLoading(true);
    
    try {
      await register(formData.email, formData.password, formData.name, formData.role);
      showToast("Account created successfully! Redirecting to login...", "success");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (error) {
      console.error('Registration error:', error);
      showToast(error.message || 'Registration failed. Please try again.');
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
      <div className="relative bg-white rounded-[24px] w-full max-w-[460px] min-h-[620px] p-[52px_52px_48px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.25),0_4px_16px_rgba(0,0,0,0.12)] animate-fadeUp">
        {/* Blob decorations inside card */}
        <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full bg-[#002fa7] pointer-events-none" />
        <div className="absolute -bottom-[70px] -left-[50px] w-[180px] h-[180px] rounded-full bg-[#002fa7] pointer-events-none" />
        <div className="absolute top-[60px] -right-[20px] w-[90px] h-[90px] rounded-full bg-white/15 pointer-events-none" />

        {/* Form content */}
        <div className="relative z-10">
          <h1 className="font-playfair text-[30px] font-bold text-[#0f1c2e] text-center mb-[6px]">
            Create Account
          </h1>
          <p className="text-[13px] text-[#9ba8b8] text-center mb-8 font-light">
            {invitation ? 'Complete your invited account registration' : 'Register for Apple Fam TV Admin'}
          </p>

          {invitation && (
            <div className="mb-6 p-4 bg-[#047857]/10 border border-[#047857]/20 rounded-[10px]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#047857] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UserPlus size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#047857] mb-1">Invitation Found!</h3>
                  <p className="text-[12px] text-[#047857]/80 leading-relaxed">
                    You've been invited as <strong>{invitation.role}</strong>. Your details have been pre-filled. Use password: <strong>applefamtv</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {!invitation && formData.email && !checkingInvitation && formData.email !== 'afanyuemma2002@gmail.com' && (
            <div className="mb-6 p-4 bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-[10px]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#dc2626] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#dc2626] mb-1">No Invitation Found</h3>
                  <p className="text-[12px] text-[#dc2626]/80 leading-relaxed">
                    This email doesn't have an invitation. Please contact an administrator to get invited.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white disabled:opacity-50"
                  placeholder="Full Name"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full h-12 px-4 pr-10 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white disabled:opacity-50"
                  placeholder="Email Address"
                  autoComplete="email"
                />
                {checkingInvitation && (
                  <div className="absolute right-[14px] top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-[#002fa7] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="mb-4">
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                disabled={loading || invitation}
                className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all focus:border-[#002fa7] focus:bg-white disabled:opacity-50"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
              <p className="text-[11px] text-[#9ba8b8] mt-2 px-1">
                {invitation ? '(Role assigned by admin)' : roles.find(r => r.value === formData.role)?.description}
              </p>
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white disabled:opacity-50"
                  placeholder="Password (min 6 characters)"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white disabled:opacity-50"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#b0bac8] hover:text-[#002fa7] transition-colors disabled:opacity-50"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (!invitation && formData.email !== 'afanyuemma2002@gmail.com')}
              className="w-full h-12 bg-[#002fa7] text-white text-[14px] font-semibold rounded-[10px] tracking-[0.04em] transition-all hover:bg-[#0026c4] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-[12px] text-[#9ba8b8]">
                Already have an account? <Link to="/admin/login" className="text-red-500 font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </form>
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
