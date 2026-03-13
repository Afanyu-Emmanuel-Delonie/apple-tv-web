import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Search, Clock, RotateCcw } from "lucide-react";
import { opportunities } from "../../constants/opportunities";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminOpportunities() {
  const [opportunitiesList, setOpportunitiesList] = useState(
    opportunities.map(opp => ({ ...opp, status: "active", expiryDate: null }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

  const categories = ["All", "Jobs", "Internships", "Fellowships", "Volunteering", "Grants"];

  const filteredOpportunities = opportunitiesList.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || opp.category === filterCategory;
    const matchesStatus = filterStatus === "All" || opp.status === filterStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const addToast = (message, type) => {
    setToast({ message, type });
  };

  const getDaysUntilDeletion = (expiryDate) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const deleteDate = new Date(expiry.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const handleAdd = () => {
    setModalMode("add");
    setFormData({ title: "", category: "Jobs", company: "", location: "", deadline: "", salary: "", description: "" });
    setShowModal(true);
  };

  const handleView = (opp) => {
    setSelectedOpportunity(opp);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEdit = (opp) => {
    setModalMode("edit");
    setFormData(opp);
    setShowModal(true);
  };

  const handleDelete = (opp) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Opportunity",
      message: `Are you sure you want to permanently delete "${opp.title}"? This action cannot be undone.`,
      type: "danger",
      onConfirm: () => {
        setOpportunitiesList(opportunitiesList.filter(o => o.id !== opp.id));
        addToast("Opportunity deleted successfully", "success");
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleExpire = (opp) => {
    setConfirmDialog({
      isOpen: true,
      title: "Expire Opportunity",
      message: `Are you sure you want to expire "${opp.title}"? It will be automatically deleted after 30 days.`,
      type: "warning",
      onConfirm: () => {
        setOpportunitiesList(opportunitiesList.map(o => 
          o.id === opp.id ? { ...o, status: "expired", expiryDate: new Date().toISOString() } : o
        ));
        addToast("Opportunity expired successfully", "warning");
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleReactivate = (opp) => {
    setOpportunitiesList(opportunitiesList.map(o => 
      o.id === opp.id ? { ...o, status: "active", expiryDate: null } : o
    ));
    addToast("Opportunity reactivated successfully", "success");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newOpp = { ...formData, id: Date.now(), status: "active", expiryDate: null };
      setOpportunitiesList([newOpp, ...opportunitiesList]);
      addToast("Opportunity added successfully", "success");
    } else if (modalMode === "edit") {
      setOpportunitiesList(opportunitiesList.map(o => o.id === formData.id ? formData : o));
      addToast("Opportunity updated successfully", "success");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-playfair font-black text-[#0b1020] mb-2">Opportunities</h1>
          <p className="text-[13px] sm:text-[14px] text-[#5a6073]">Manage jobs, internships, and opportunities</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#002fa7] text-white text-[13px] sm:text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          Add Opportunity
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b91a5]" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-[#e3e6ee] rounded text-[13px] sm:text-[14px] focus:outline-none focus:border-[#002fa7]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 sm:py-3 border border-[#e3e6ee] rounded text-[13px] sm:text-[14px] focus:outline-none focus:border-[#002fa7]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 sm:py-3 border border-[#e3e6ee] rounded text-[13px] sm:text-[14px] focus:outline-none focus:border-[#002fa7]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Opportunities Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-[#e3e6ee] overflow-hidden">
        {filteredOpportunities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={32} className="text-[#8b91a5]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">No Opportunities Found</h3>
            <p className="text-[14px] text-[#5a6073] max-w-[400px] mx-auto mb-6">
              {filterStatus === "All" && filterCategory === "All"
                ? "No opportunities available. Click 'Add Opportunity' to create your first opportunity."
                : "No opportunities match your current filters. Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <table className="w-full">
          <thead className="bg-[#f6f7fb] border-b border-[#e3e6ee]">
            <tr>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Title</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Category</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Company</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Location</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Status</th>
              <th className="text-right px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOpportunities.map((opp) => (
              <tr key={opp.id} className="border-b border-[#e3e6ee] hover:bg-[#f6f7fb] transition-colors">
                <td className="px-6 py-4">
                  <div className="text-[14px] font-semibold text-[#0b1020]">{opp.title}</div>
                  {opp.status === "expired" && (
                    <div className="text-[11px] text-[#8b91a5] mt-1">
                      Auto-delete in {getDaysUntilDeletion(opp.expiryDate)} days
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-[11px] font-bold uppercase rounded bg-[#002fa7]/10 text-[#002fa7]">
                    {opp.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] text-[#5a6073]">{opp.company}</td>
                <td className="px-6 py-4 text-[13px] text-[#5a6073]">{opp.location}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                    opp.status === "active" ? "bg-[#047857]/10 text-[#047857]" : "bg-[#8b91a5]/10 text-[#8b91a5]"
                  }`}>
                    {opp.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleView(opp)}
                      className="p-2 text-[#002fa7] hover:bg-[#002fa7]/10 rounded transition-colors"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleEdit(opp)}
                      className="p-2 text-[#047857] hover:bg-[#047857]/10 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    {opp.status === "active" && (
                      <button
                        onClick={() => handleExpire(opp)}
                        className="p-2 text-[#ea580c] hover:bg-[#ea580c]/10 rounded transition-colors"
                        title="Expire"
                      >
                        <Clock size={18} />
                      </button>
                    )}
                    {opp.status === "expired" && (
                      <button
                        onClick={() => handleReactivate(opp)}
                        className="p-2 text-[#047857] hover:bg-[#047857]/10 rounded transition-colors"
                        title="Reactivate"
                      >
                        <RotateCcw size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(opp)}
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
        )}
      </div>

      {/* Opportunities Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredOpportunities.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e3e6ee] p-8 text-center">
            <div className="w-16 h-16 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={32} className="text-[#8b91a5]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">No Opportunities Found</h3>
            <p className="text-[13px] text-[#5a6073] mb-4">
              {filterStatus === "All" && filterCategory === "All"
                ? "No opportunities available. Click 'Add Opportunity' to create your first opportunity."
                : "No opportunities match your current filters. Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => (
          <div key={opp.id} className="bg-white rounded-lg border border-[#e3e6ee] p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-[15px] font-bold text-[#0b1020] flex-1">{opp.title}</h3>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded whitespace-nowrap ${
                opp.status === "active" ? "bg-[#047857]/10 text-[#047857]" : "bg-[#8b91a5]/10 text-[#8b91a5]"
              }`}>
                {opp.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[#002fa7]/10 text-[#002fa7]">
                  {opp.category}
                </span>
              </div>
              <div className="text-[13px] text-[#5a6073]">
                <span className="font-semibold">Company:</span> {opp.company}
              </div>
              <div className="text-[13px] text-[#5a6073]">
                <span className="font-semibold">Location:</span> {opp.location}
              </div>
              {opp.status === "expired" && (
                <div className="text-[11px] text-[#8b91a5]">
                  Auto-delete in {getDaysUntilDeletion(opp.expiryDate)} days
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => handleView(opp)}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors"
              >
                <Eye size={16} />
                View
              </button>
              <button 
                onClick={() => handleEdit(opp)}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#047857] border border-[#047857] rounded hover:bg-[#047857] hover:text-white transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              {opp.status === "active" && (
                <button
                  onClick={() => handleExpire(opp)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#ea580c] border border-[#ea580c] rounded hover:bg-[#ea580c] hover:text-white transition-colors"
                >
                  <Clock size={16} />
                  Expire
                </button>
              )}
              {opp.status === "expired" && (
                <button
                  onClick={() => handleReactivate(opp)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#047857] border border-[#047857] rounded hover:bg-[#047857] hover:text-white transition-colors"
                >
                  <RotateCcw size={16} />
                  Reactivate
                </button>
              )}
              <button
                onClick={() => handleDelete(opp)}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#dc2626] border border-[#dc2626] rounded hover:bg-[#dc2626] hover:text-white transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        )))
        }
      </div>

      <div className="mt-4 text-[12px] sm:text-[13px] text-[#5a6073]">
        Showing {filteredOpportunities.length} of {opportunitiesList.length} opportunities
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === "add" ? "Add Opportunity" : modalMode === "edit" ? "Edit Opportunity" : "Opportunity Details"}
        size="lg"
      >
        {modalMode === "view" ? (
          <div className="p-6">
            <div className="mb-4">
              <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                selectedOpportunity?.status === "active" ? "bg-[#047857]/10 text-[#047857]" : "bg-[#8b91a5]/10 text-[#8b91a5]"
              }`}>
                {selectedOpportunity?.status}
              </span>
            </div>
            <h3 className="text-[20px] font-bold text-[#0b1020] mb-4">{selectedOpportunity?.title}</h3>
            <div className="space-y-3 text-[14px]">
              <div><span className="font-semibold">Category:</span> {selectedOpportunity?.category}</div>
              <div><span className="font-semibold">Company:</span> {selectedOpportunity?.company}</div>
              <div><span className="font-semibold">Location:</span> {selectedOpportunity?.location}</div>
              <div><span className="font-semibold">Deadline:</span> {selectedOpportunity?.deadline}</div>
              {selectedOpportunity?.salary && (
                <div><span className="font-semibold">Salary:</span> {selectedOpportunity?.salary}</div>
              )}
              {selectedOpportunity?.description && (
                <div><span className="font-semibold">Description:</span> {selectedOpportunity?.description}</div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Category</label>
                <select
                  value={formData.category || "Jobs"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                >
                  {categories.filter(c => c !== "All").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company || ""}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Deadline</label>
                <input
                  type="text"
                  value={formData.deadline || ""}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder="e.g., March 30, 2024"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Salary (Optional)</label>
                <input
                  type="text"
                  value={formData.salary || ""}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Description</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  rows="4"
                />
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
                className="px-6 py-3 text-[14px] font-semibold text-white bg-[#002fa7] rounded hover:bg-[#0026c4] transition-colors"
              >
                {modalMode === "add" ? "Add Opportunity" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
