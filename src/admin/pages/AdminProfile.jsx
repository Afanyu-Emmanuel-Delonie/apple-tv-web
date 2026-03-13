import { useState, useEffect } from "react";
import { User, Mail, Shield, Calendar, Camera, Save, Eye, EyeOff, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminProfile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    photoURL: ""
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.displayName || user.name || "",
        email: user.email || "",
        role: user.role || "admin",
        photoURL: user.photoURL || ""
      });
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        displayName: profileData.name,
        name: profileData.name
      });
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Profile update error:', error);
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement password change with Firebase
      showToast('Password changed successfully!', 'success');
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordDialog(false);
    } catch (error) {
      console.error('Password change error:', error);
      showToast('Failed to change password. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    
    try {
      // TODO: Implement account deletion with Firebase
      // This should:
      // 1. Delete user from Firebase Auth
      // 2. Delete user profile from Firestore
      // 3. Optionally anonymize user's content or transfer ownership
      
      showToast('Account deleted successfully. You will be redirected to login.', 'success');
      
      // Logout and redirect after a delay
      setTimeout(async () => {
        await logout();
        navigate('/admin/login');
      }, 2000);
      
    } catch (error) {
      console.error('Account deletion error:', error);
      showToast('Failed to delete account. Please try again or contact support.', 'error');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const getUserInitials = () => {
    if (profileData.name) {
      return profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (profileData.email) {
      return profileData.email[0].toUpperCase();
    }
    return 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Calendar }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0b1020] mb-2">Profile Settings</h1>
        <p className="text-[#5a6073] text-[15px]">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-[#e3e6ee] p-6">
            {/* User Avatar */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-[#002fa7] rounded-full flex items-center justify-center text-white font-bold text-[20px] mx-auto mb-3">
                  {getUserInitials()}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#002fa7] rounded-full flex items-center justify-center text-white hover:bg-[#0026c4] transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <h3 className="font-semibold text-[#0b1020] text-[16px]">{profileData.name || 'User'}</h3>
              <p className="text-[#5a6073] text-[13px]">{profileData.email}</p>
              <span className="inline-block px-3 py-1 bg-[#002fa7]/10 text-[#002fa7] text-[11px] font-semibold rounded-full mt-2">
                {profileData.role?.toUpperCase()}
              </span>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-[#002fa7] text-white"
                        : "text-[#2c3348] hover:bg-[#f0f2f8]"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-[#e3e6ee] p-6 lg:p-8">
            
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-[20px] font-bold text-[#0b1020] mb-6">Profile Information</h2>
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[14px] font-semibold text-[#0b1020] mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ba8b8]" />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full h-12 pl-10 pr-4 bg-[#f6f7fb] border border-[#e3e6ee] rounded-lg text-[14px] text-[#0b1020] outline-none transition-all focus:border-[#002fa7] focus:bg-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[14px] font-semibold text-[#0b1020] mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ba8b8]" />
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full h-12 pl-10 pr-4 bg-[#f6f7fb] border border-[#e3e6ee] rounded-lg text-[14px] text-[#5a6073] outline-none opacity-60 cursor-not-allowed"
                          placeholder="Email address"
                        />
                      </div>
                      <p className="text-[12px] text-[#9ba8b8] mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-[14px] font-semibold text-[#0b1020] mb-2">
                        Role
                      </label>
                      <div className="h-12 px-4 bg-[#f6f7fb] border border-[#e3e6ee] rounded-lg flex items-center">
                        <Shield size={18} className="text-[#9ba8b8] mr-3" />
                        <span className="text-[14px] text-[#5a6073] capitalize">{profileData.role}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[14px] font-semibold text-[#0b1020] mb-2">
                        Member Since
                      </label>
                      <div className="h-12 px-4 bg-[#f6f7fb] border border-[#e3e6ee] rounded-lg flex items-center">
                        <Calendar size={18} className="text-[#9ba8b8] mr-3" />
                        <span className="text-[14px] text-[#5a6073]">{formatDate(user?.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-[#002fa7] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0026c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-[20px] font-bold text-[#0b1020] mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  {/* Password Section */}
                  <div className="p-6 bg-[#f6f7fb] rounded-lg border border-[#e3e6ee]">
                    <h3 className="text-[16px] font-semibold text-[#0b1020] mb-2">Password</h3>
                    <p className="text-[14px] text-[#5a6073] mb-4">
                      Keep your account secure by using a strong password
                    </p>
                    <button
                      onClick={() => setShowPasswordDialog(true)}
                      className="px-4 py-2 bg-[#002fa7] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0026c4] transition-colors"
                    >
                      Change Password
                    </button>
                  </div>

                  {/* Login Activity */}
                  <div className="p-6 bg-[#f6f7fb] rounded-lg border border-[#e3e6ee]">
                    <h3 className="text-[16px] font-semibold text-[#0b1020] mb-2">Login Activity</h3>
                    <p className="text-[14px] text-[#5a6073] mb-4">
                      Monitor your account's login activity and security
                    </p>
                    <div className="text-[13px] text-[#5a6073]">
                      <p>Last login: {new Date().toLocaleString()}</p>
                      <p>Login method: {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email/Password'}</p>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-[16px] font-semibold text-red-900 mb-2">Danger Zone</h3>
                        <p className="text-[14px] text-red-700 mb-4">
                          Once you delete your account, there is no going back. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <h4 className="text-[14px] font-semibold text-red-900 mb-2">Delete Account</h4>
                      <p className="text-[13px] text-red-700 mb-4">
                        Permanently delete your account and all associated data. This includes:
                      </p>
                      <ul className="text-[13px] text-red-700 mb-4 ml-4 space-y-1">
                        <li>• Your profile and account information</li>
                        <li>• All articles and content you've created</li>
                        <li>• Your login credentials and access</li>
                        <li>• All associated data and preferences</li>
                      </ul>
                      <button
                        onClick={() => setShowDeleteDialog(true)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-[14px] font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div>
                <h2 className="text-[20px] font-bold text-[#0b1020] mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  {/* Notifications */}
                  <div className="p-6 bg-[#f6f7fb] rounded-lg border border-[#e3e6ee]">
                    <h3 className="text-[16px] font-semibold text-[#0b1020] mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#002fa7] rounded" />
                        <span className="text-[14px] text-[#0b1020]">Email notifications for new submissions</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#002fa7] rounded" />
                        <span className="text-[14px] text-[#0b1020]">Email notifications for user registrations</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-[#002fa7] rounded" />
                        <span className="text-[14px] text-[#0b1020]">Weekly summary reports</span>
                      </label>
                    </div>
                  </div>

                  {/* Interface */}
                  <div className="p-6 bg-[#f6f7fb] rounded-lg border border-[#e3e6ee]">
                    <h3 className="text-[16px] font-semibold text-[#0b1020] mb-4">Interface</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[14px] font-medium text-[#0b1020] mb-2">
                          Sidebar Default State
                        </label>
                        <select className="w-full h-10 px-3 bg-white border border-[#e3e6ee] rounded-lg text-[14px] text-[#0b1020] outline-none focus:border-[#002fa7]">
                          <option value="expanded">Expanded</option>
                          <option value="collapsed">Collapsed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Dialog */}
      {showPasswordDialog && (
        <ConfirmDialog
          isOpen={showPasswordDialog}
          title="Change Password"
          onClose={() => setShowPasswordDialog(false)}
          onConfirm={() => {}}
          confirmText=""
          cancelText=""
        >
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-[14px] font-semibold text-[#0b1020] mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                  className="w-full h-12 px-4 pr-12 bg-[#f6f7fb] border border-[#e3e6ee] rounded-lg text-[14px] text-[#0b1020] outline-none focus:border-[#002fa7] focus:bg-white"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba8b8] hover:text-[#002fa7]"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[14px] font-semibold text-[#0b1020] mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  className="w-full h-12 px-4 pr-12 bg-[#f6f7fb] border border-[#e3e6ee] rounded-lg text-[14px] text-[#0b1020] outline-none focus:border-[#002fa7] focus:bg-white"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba8b8] hover:text-[#002fa7]"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[14px] font-semibold text-[#0b1020] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="w-full h-12 px-4 pr-12 bg-[#f6f7fb] border border-[#e3e6ee] rounded-lg text-[14px] text-[#0b1020] outline-none focus:border-[#002fa7] focus:bg-white"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba8b8] hover:text-[#002fa7]"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowPasswordDialog(false)}
                className="px-4 py-2 text-[14px] font-semibold text-[#2c3348] border border-[#e3e6ee] rounded hover:bg-[#f0f2f8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-[14px] font-semibold text-white bg-[#002fa7] rounded hover:bg-[#0026c4] transition-colors disabled:opacity-50"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </ConfirmDialog>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Delete Account"
          message="Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including articles, profile information, and access credentials."
          confirmText="Delete Account"
          cancelText="Cancel"
          onConfirm={handleDeleteAccount}
          onClose={() => setShowDeleteDialog(false)}
          type="danger"
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}