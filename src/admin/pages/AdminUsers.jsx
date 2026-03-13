import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Search, Shield, UserCheck, FileEdit, Mail, Calendar, Activity, RefreshCw, Users } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getAllUsers, updateUserProfileById, deleteUserProfile, createUser } from "../../services/firebase/auth";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminUsers() {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    editors: 0,
    authors: 0
  });

  // Load users from Firebase
  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getAllUsers();
      
      // Transform Firebase user data to match our UI expectations
      const transformedUsers = fetchedUsers.map(user => {
        // Format dates properly
        let createdDate = 'Unknown';
        if (user.createdAt) {
          try {
            const date = new Date(user.createdAt);
            createdDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          } catch (e) {
            createdDate = 'Unknown';
          }
        }

        let lastLoginDate = 'Never';
        if (user.lastLogin) {
          try {
            const date = new Date(user.lastLogin);
            lastLoginDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          } catch (e) {
            lastLoginDate = 'Never';
          }
        }

        return {
          id: user.uid,
          uid: user.uid,
          name: user.name || user.displayName || 'Unknown User',
          email: user.email || 'No email',
          role: user.role || 'author',
          status: user.status || 'active',
          createdAt: createdDate,
          lastLogin: lastLoginDate,
          loginMethod: user.photoURL ? 'Google' : 'Email',
          photoURL: user.photoURL || null,
          articlesCount: user.articlesCount || 0,
          submissionsCount: user.submissionsCount || 0
        };
      });
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      addToast('Failed to load users. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Refresh users
  const refreshUsers = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
    addToast('Users refreshed successfully', 'success');
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Calculate stats when users change
  useEffect(() => {
    const newStats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      admins: users.filter(u => u.role === 'admin').length,
      editors: users.filter(u => u.role === 'editor').length,
      authors: users.filter(u => u.role === 'author').length
    };
    setStats(newStats);
  }, [users]);

  const roles = [
    { value: "admin", label: "Admin", description: "Full access to all features and settings", color: "bg-[#dc2626]/10 text-[#dc2626]", icon: Shield },
    { value: "editor", label: "Editor", description: "Can manage content, users, and most settings", color: "bg-[#002fa7]/10 text-[#002fa7]", icon: FileEdit },
    { value: "author", label: "Author", description: "Can create and edit own content only", color: "bg-[#047857]/10 text-[#047857]", icon: UserCheck }
  ];

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canDeleteUser = (user) => {
    // Only admins can delete users, and can't delete themselves
    return isAdmin && user.uid !== currentUser?.uid;
  };

  const canEditUser = (user) => {
    // Admins can edit anyone
    if (isAdmin) return true;
    // Editors can edit authors only
    if (currentUser?.role === 'editor' && user.role === 'author') return true;
    // Users can edit themselves
    return user.uid === currentUser?.uid;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    const matchesStatus = filterStatus === "All" || user.status === filterStatus.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const addToast = (message, type) => {
    setToast({ message, type });
  };

  const getRoleIcon = (role) => {
    const roleData = roles.find(r => r.value === role);
    const IconComponent = roleData?.icon || UserCheck;
    return <IconComponent size={16} />;
  };

  const getRoleColor = (role) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.color || "bg-[#8b91a5]/10 text-[#8b91a5]";
  };

  const getStatusColor = (status) => {
    return status === "active" 
      ? "bg-[#047857]/10 text-[#047857]" 
      : "bg-[#8b91a5]/10 text-[#8b91a5]";
  };

  const handleAdd = () => {
    setModalMode("add");
    setFormData({ name: "", email: "", role: "author", status: "active", password: "applefamtv" });
    setShowModal(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setModalMode("edit");
    setFormData({ ...user, password: "" });
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete User",
      message: `Are you sure you want to permanently delete "${user.name}"? This will remove their profile from the system.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteUserProfile(user.uid);
          setUsers(users.filter(u => u.uid !== user.uid));
          addToast("User deleted successfully", "success");
        } catch (error) {
          console.error('Error deleting user:', error);
          addToast("Failed to delete user. Please try again.", "error");
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      if (modalMode === "add") {
        const newUser = await createUser(formData.email, formData.password || "applefamtv", {
          name: formData.name,
          role: formData.role,
          status: formData.status
        });
        
        setUsers([newUser, ...users]);
        addToast(`User invitation created for ${formData.email}. They should register at the registration page with email: ${formData.email} and password: applefamtv`, "success");
      } else if (modalMode === "edit") {
        await updateUserProfileById(formData.uid, {
          name: formData.name,
          role: formData.role,
          status: formData.status
        });
        
        setUsers(users.map(u => u.uid === formData.uid ? {
          ...u,
          name: formData.name,
          role: formData.role,
          status: formData.status
        } : u));
        
        addToast("User updated successfully", "success");
      }
    } catch (error) {
      console.error('Error saving user:', error);
      addToast(error.message || "Failed to save user. Please try again.", "error");
    } finally {
      setCreating(false);
    }
    
    setShowModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-playfair font-black text-[#0b1020] mb-2">Users</h1>
          <p className="text-[13px] sm:text-[14px] text-[#5a6073]">Manage admin users and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshUsers}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-[#002fa7] border border-[#002fa7] text-[13px] sm:text-[14px] font-semibold rounded hover:bg-[#002fa7] hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          {isAdmin && (
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#002fa7] text-white text-[13px] sm:text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors whitespace-nowrap"
            >
              <Plus size={20} />
              Add User
            </button>
          )}
        </div>
      </div>

      {/* Role Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {roles.map(role => (
          <div key={role.value} className="bg-white rounded-lg border border-[#e3e6ee] p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded ${getRoleColor(role.value)}`}>
                {getRoleIcon(role.value)}
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020]">{role.label}</h3>
            </div>
            <p className="text-[13px] text-[#5a6073]">{role.description}</p>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#e3e6ee] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#002fa7]/10 text-[#002fa7] rounded">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[24px] font-bold text-[#0b1020]">{stats.total}</p>
              <p className="text-[12px] text-[#5a6073]">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e3e6ee] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#047857]/10 text-[#047857] rounded">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-[24px] font-bold text-[#0b1020]">{stats.active}</p>
              <p className="text-[12px] text-[#5a6073]">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e3e6ee] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#dc2626]/10 text-[#dc2626] rounded">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-[24px] font-bold text-[#0b1020]">{stats.admins}</p>
              <p className="text-[12px] text-[#5a6073]">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b91a5]" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="author">Author</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-[#e3e6ee] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[#002fa7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[14px] text-[#5a6073]">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-[#8b91a5]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">No Users Found</h3>
            <p className="text-[14px] text-[#5a6073] max-w-[400px] mx-auto mb-6">
              {filterRole === "All" && filterStatus === "All" && !searchTerm
                ? "No users available. Users will appear here once they sign up."
                : "No users match your current filters. Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <table className="w-full">
          <thead className="bg-[#f6f7fb] border-b border-[#e3e6ee]">
            <tr>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">User</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Role</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Status</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Last Login</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Created</th>
              <th className="text-right px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-[#e3e6ee] hover:bg-[#f6f7fb] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-[#002fa7] rounded-full flex items-center justify-center text-white text-[12px] font-bold">
                          {getUserInitials(user.name)}
                        </div>
                      )}
                      {user.uid === currentUser?.uid && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-[#0b1020]">{user.name}</span>
                        {user.uid === currentUser?.uid && (
                          <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[#5a6073]">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase rounded ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] text-[#5a6073]">{user.lastLogin}</td>
                <td className="px-6 py-4 text-[13px] text-[#5a6073]">{user.createdAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleView(user)}
                      className="p-2 text-[#002fa7] hover:bg-[#002fa7]/10 rounded transition-colors"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleEdit(user)}
                      disabled={!canEditUser(user)}
                      className={`p-2 rounded transition-colors ${
                        canEditUser(user)
                          ? 'text-[#047857] hover:bg-[#047857]/10'
                          : 'text-[#8b91a5] cursor-not-allowed'
                      }`}
                      title={canEditUser(user) ? "Edit" : "Cannot edit this user"}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={!canDeleteUser(user)}
                      className={`p-2 rounded transition-colors ${
                        canDeleteUser(user)
                          ? 'text-[#dc2626] hover:bg-[#dc2626]/10'
                          : 'text-[#8b91a5] cursor-not-allowed'
                      }`}
                      title={canDeleteUser(user) ? "Delete" : user.uid === currentUser?.uid ? "Cannot delete yourself" : "Only Admins can delete users"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Users Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg border border-[#e3e6ee] p-8 text-center">
            <div className="w-8 h-8 border-2 border-[#002fa7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[14px] text-[#5a6073]">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e3e6ee] p-8 text-center">
            <div className="w-16 h-16 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-[#8b91a5]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">No Users Found</h3>
            <p className="text-[13px] text-[#5a6073] mb-4">
              {filterRole === "All" && filterStatus === "All" && !searchTerm
                ? "No users available. Users will appear here once they sign up."
                : "No users match your current filters. Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg border border-[#e3e6ee] p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[#002fa7] rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                      {getUserInitials(user.name)}
                    </div>
                  )}
                  {user.uid === currentUser?.uid && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-bold text-[#0b1020] truncate">{user.name}</h3>
                    {user.uid === currentUser?.uid && (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded flex-shrink-0">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#5a6073] truncate">{user.email}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${getStatusColor(user.status)} ml-2 flex-shrink-0`}>
                {user.status}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase rounded ${getRoleColor(user.role)}`}>
                {getRoleIcon(user.role)}
                {user.role}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-[12px]">
              <div>
                <span className="text-[#8b91a5] font-semibold">Last Login</span>
                <p className="text-[#2c3348] mt-1">{user.lastLogin}</p>
              </div>
              <div>
                <span className="text-[#8b91a5] font-semibold">Created</span>
                <p className="text-[#2c3348] mt-1">{user.createdAt}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#e3e6ee]">
              <button 
                onClick={() => handleView(user)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors"
              >
                <Eye size={16} />
                View
              </button>
              <button 
                onClick={() => handleEdit(user)}
                disabled={!canEditUser(user)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-semibold border rounded transition-colors ${
                  canEditUser(user)
                    ? 'text-[#047857] border-[#047857] hover:bg-[#047857] hover:text-white'
                    : 'text-[#8b91a5] border-[#8b91a5] cursor-not-allowed'
                }`}
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(user)}
                disabled={!canDeleteUser(user)}
                className={`p-2 border rounded transition-colors ${
                  canDeleteUser(user)
                    ? 'text-[#dc2626] border-[#dc2626] hover:bg-[#dc2626] hover:text-white'
                    : 'text-[#8b91a5] border-[#8b91a5] cursor-not-allowed'
                }`}
                title={canDeleteUser(user) ? "Delete" : user.uid === currentUser?.uid ? "Cannot delete yourself" : "Only Admins can delete users"}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      <div className="mt-4 text-[13px] text-[#5a6073]">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === "add" ? "Add User" : modalMode === "edit" ? "Edit User" : "User Details"}
        size="lg"
      >
        {modalMode === "view" ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase rounded ${getRoleColor(selectedUser?.role)}`}>
                  {getRoleIcon(selectedUser?.role)}
                  {selectedUser?.role}
                </span>
                <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${getStatusColor(selectedUser?.status)}`}>
                  {selectedUser?.status}
                </span>
              </div>
              <h3 className="text-[20px] font-bold text-[#0b1020] mb-1">{selectedUser?.name}</h3>
              <p className="text-[14px] text-[#5a6073]">{selectedUser?.email}</p>
            </div>
            <div className="space-y-3 text-[14px]">
              <div className="bg-[#f6f7fb] rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[12px] font-semibold text-[#8b91a5]">Created</span>
                    <p className="text-[14px] text-[#2c3348] mt-1">{selectedUser?.createdAt}</p>
                  </div>
                  <div>
                    <span className="text-[12px] font-semibold text-[#8b91a5]">Last Login</span>
                    <p className="text-[14px] text-[#2c3348] mt-1">{selectedUser?.lastLogin}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f6f7fb] rounded-lg p-4">
                <span className="text-[12px] font-semibold text-[#8b91a5]">Role Permissions</span>
                <p className="text-[13px] text-[#2c3348] mt-2">
                  {roles.find(r => r.value === selectedUser?.role)?.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Role</label>
                <select
                  value={formData.role || "author"}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                <p className="text-[12px] text-[#5a6073] mt-2">
                  {roles.find(r => r.value === formData.role)?.description}
                </p>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Status</label>
                <select
                  value={formData.status || "active"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">
                  {modalMode === "add" ? "Password (Default: applefamtv)" : "New Password (leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder={modalMode === "add" ? "applefamtv" : "Leave blank to keep current password"}
                />
                {modalMode === "add" && (
                  <p className="text-[12px] text-[#047857] mt-2 bg-[#047857]/10 p-3 rounded">
                    <strong>Important:</strong> After creating this user, they must register themselves at the registration page using their email and the password "applefamtv". They can then change their password in their profile settings.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-3 text-[14px] font-semibold text-[#2c3348] border border-[#e3e6ee] rounded hover:bg-[#f6f7fb] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-3 text-[14px] font-semibold text-white bg-[#002fa7] rounded hover:bg-[#0026c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {modalMode === "add" ? (creating ? "Creating..." : "Create User") : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
