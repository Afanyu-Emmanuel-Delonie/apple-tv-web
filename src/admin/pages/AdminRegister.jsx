import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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
  const navigate = useNavigate();

  const roles = [
    { value: "admin", label: "Admin", description: "Full access to all features" },
    { value: "editor", label: "Editor", description: "Manage content and users" },
    { value: "author", label: "Author", description: "Create own content" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // TODO: Implement actual registration
    console.log("Registration attempt:", formData);
    
    // For now, show success message and navigate to users page
    alert("User registered successfully!");
    navigate("/admin/users");
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
            Register
          </h1>
          <p className="text-[13px] text-[#9ba8b8] text-center mb-8 font-light">
            Create a new user account for the platform
          </p>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white"
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
                  className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white"
                  placeholder="Email Address"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Role */}
            <div className="mb-4">
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all focus:border-[#002fa7] focus:bg-white"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
              <p className="text-[11px] text-[#9ba8b8] mt-2 px-1">
                {roles.find(r => r.value === formData.role)?.description}
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
                  className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white"
                  placeholder="Password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#b0bac8] hover:text-[#002fa7] transition-colors"
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
                  className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#b0bac8] hover:text-[#002fa7] transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#002fa7] text-white text-[14px] font-semibold rounded-[10px] tracking-[0.04em] transition-all hover:bg-[#0026c4] active:scale-[0.98]"
            >
              Create Account
            </button>

            <div className="mt-4 text-center">
              <Link 
                to="/admin/users" 
                className="text-[12px] text-[#9ba8b8] hover:text-[#002fa7] transition-colors"
              >
                Back to Users
              </Link>
            </div>
          </form>
        </div>
      </div>

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
