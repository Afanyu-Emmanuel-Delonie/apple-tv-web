import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Search, Shield, UserCheck, FileEdit, EyeOff } from "lucide-react";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminUsers() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Admin",
      email: "john@appletv.com",
      role: "admin",
      status: "active",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-20 10:30 AM"
    },
    {
      id: 2,
      name: "Sarah Editor",
      email: "sarah@appletv.com",
      role: "editor",
      status: "active",
      createdAt: "2024-01-12",
      lastLogin: "2024-01-19 03:45 PM"
    },
    {
      id: 3,
      name: "Mike Writer",
      email: "mike@appletv.com",
      role: "author",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2024-01-18 09:15 AM"
    },
    {
      id: 4,
      name: "Jane Contributor",
      email: "jane@appletv.com",
      role: "author",
      status: "inactive",
      createdAt: "2024-01-08",
      lastLogin: "2024-01-10 02:20 PM"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

  const roles = [
    { value: "admin", label: "Admin", description: "Full access to all features and settings" },
    { value: "editor", label: "Editor", description: "Can manage content, users, and most settings" },
    { value: "author", label: "Author", description: "Can create and edit own content only" }
  ];

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
    switch(role) {
      case "admin": return <Shield size={16} />;
      case "editor": return <FileEdit size={16} />;
      case "author": return <UserCheck size={16} />;
      default: return <UserCheck size={16} />;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case "admin": return "bg-[#dc2626]/10 text-[#dc2626]";
      case "editor": return "bg-[#002fa7]/10 text-[#002fa7]";
      case "author": return "bg-[#047857]/10 text-[#047857]";
      default: return "bg-[#8b91a5]/10 text-[#8b91a5]";
    }
  };

  const getStatusColor = (status) => {
    return status === "active" 
      ? "bg-[#047857]/10 text-[#047857]" 
      : "bg-[#8b91a5]/10 text-[#8b91a5]";
  };

  const handleAdd = () => {
    setModalMode("add");
    setFormData({ name: "", email: "", role: "author", status: "active", password: "" });
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
      message: `Are you sure you want to permanently delete "${user.name}"? This action cannot be undone.`,
      type: "danger",
      onConfirm: () => {
        setUsers(users.filter(u => u.id !== user.id));
        addToast("User deleted successfully", "success");
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newUser = { 
        ...formData, 
        id: Date.now(), 
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: "Never"
      };
      setUsers([newUser, ...users]);
      addToast("User created successfully", "success");
    } else if (modalMode === "edit") {
      setUsers(users.map(u => u.id === formData.id ? formData : u));
      addToast("User updated successfully", "success");
    }
    setShowModal(false);
  };

  return (
    <div className="p-8">
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-playfair font-black text-[#0b1020] mb-2">Users</h1>
          <p className="text-[14px] text-[#5a6073]">Manage admin users and permissions</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#002fa7] text-white text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Role Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] overflow-hidden">
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
                  <div className="text-[14px] font-semibold text-[#0b1020]">{user.name}</div>
                  <div className="text-[12px] text-[#5a6073]">{user.email}</div>
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
                      className="p-2 text-[#047857] hover:bg-[#047857]/10 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 text-[#dc2626] hover:bg-[#dc2626]/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-[13px] text-[#5a6073]">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setShowPassword(false);
        }}
        title={modalMode === "add" ? "Register New User" : modalMode === "edit" ? "Edit User" : "User Details"}
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
          <div className="relative bg-white rounded-[24px] overflow-hidden">
            {/* Blob decorations inside modal */}
            <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full bg-[#002fa7] pointer-events-none" />
            <div className="absolute -bottom-[70px] -left-[50px] w-[180px] h-[180px] rounded-full bg-[#002fa7] pointer-events-none" />
            <div className="absolute top-[60px] -right-[20px] w-[90px] h-[90px] rounded-full bg-white/15 pointer-events-none" />

            {/* Form content */}
            <div className="relative z-10 p-6">
              <h2 className="font-playfair text-[30px] font-bold text-[#0f1c2e] text-center mb-[6px]">
                {modalMode === "add" ? "Register User" : "Edit User"}
              </h2>
              <p className="text-[13px] text-[#9ba8b8] text-center mb-8 font-light">
                {modalMode === "add" ? "Create a new user account" : "Update user information"}
              </p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white"
                        placeholder="Email Address"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <select
                      value={formData.role || "author"}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all focus:border-[#002fa7] focus:bg-white"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                    <p className="text-[12px] text-[#9ba8b8] mt-2 px-1">
                      {roles.find(r => r.value === formData.role)?.description}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <select
                      value={formData.status || "active"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all focus:border-[#002fa7] focus:bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password || ""}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full h-12 px-4 bg-[#f0f4fa] border-[1.5px] border-transparent rounded-[10px] text-[14px] text-[#0f1c2e] outline-none transition-all placeholder:text-[#b0bac8] focus:border-[#002fa7] focus:bg-white"
                        placeholder={modalMode === "add" ? "Password" : "New Password (leave blank to keep current)"}
                        autoComplete={modalMode === "add" ? "new-password" : "new-password"}
                        required={modalMode === "add"}
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
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setShowPassword(false);
                    }}
                    className="flex-1 h-12 bg-transparent text-[#4a5568] text-[14px] font-medium border-[1.5px] border-[#dde3ed] rounded-[10px] transition-all hover:border-[#002fa7] hover:bg-[#f0f6ff] hover:text-[#002fa7] active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-12 bg-[#002fa7] text-white text-[14px] font-semibold rounded-[10px] tracking-[0.04em] transition-all hover:bg-[#0026c4] active:scale-[0.98]"
                  >
                    {modalMode === "add" ? "Create User" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
