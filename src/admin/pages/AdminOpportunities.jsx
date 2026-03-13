import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Search, Clock, RotateCcw, Briefcase, RefreshCw, Upload, X } from "lucide-react";
import { getAll, create, update, remove, COLLECTIONS } from "../../services/firebase/firestore";
import { uploadImage, STORAGE_PATHS } from "../../services/firebase/storage";
import { processExpiredOpportunities, getDaysUntilDeletion } from "../../services/firebase/opportunityService";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminOpportunities() {
  const [opportunitiesList, setOpportunitiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

  const categories = ["All", "Jobs", "Internships", "Fellowships", "Volunteering", "Grants"];

  useEffect(() => {
    fetchOpportunities();
    // Check for expired opportunities on mount
    checkExpiredOpportunities();
  }, []);

  const checkExpiredOpportunities = async () => {
    try {
      const result = await processExpiredOpportunities();
      if (result.success && result.processedCount > 0) {
        addToast(`Processed ${result.processedCount} expired opportunities`, 'info');
        // Refresh the list after processing
        fetchOpportunities();
      }
    } catch (error) {
      console.error('Error checking expired opportunities:', error);
    }
  };

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.OPPORTUNITIES);
      setOpportunitiesList(data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      addToast('Failed to load opportunities', 'error');
    } finally {
      setLoading(false);
    }
  };

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
    const deleteDate = new Date(expiry.getTime() + 5 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const handleAdd = () => {
    setModalMode("add");
    setFormData({ 
      title: "", 
      category: "Jobs", 
      company: "", 
      location: "", 
      deadline: "", 
      salary: "", 
      description: "", 
      responsibilities: "",
      requirements: "", 
      benefits: "",
      applicationLink: "", 
      imageUrl: "" 
    });
    setImageFile(null);
    setImagePreview(null);
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
    setImageFile(null);
    setImagePreview(opp.imageUrl || null);
    setShowModal(true);
  };

  const handleDelete = (opp) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Opportunity",
      message: `Are you sure you want to permanently delete "${opp.title}"? This action cannot be undone.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await remove(COLLECTIONS.OPPORTUNITIES, opp.id);
          setOpportunitiesList(opportunitiesList.filter(o => o.id !== opp.id));
          addToast("Opportunity deleted successfully", "success");
        } catch (error) {
          console.error('Error deleting opportunity:', error);
          addToast("Failed to delete opportunity", "error");
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleExpire = (opp) => {
    setConfirmDialog({
      isOpen: true,
      title: "Expire Opportunity",
      message: `Are you sure you want to expire "${opp.title}"? It will be automatically deleted after 5 days.`,
      type: "warning",
      onConfirm: async () => {
        try {
          await update(COLLECTIONS.OPPORTUNITIES, opp.id, { status: "expired", expiryDate: new Date().toISOString() });
          setOpportunitiesList(opportunitiesList.map(o => 
            o.id === opp.id ? { ...o, status: "expired", expiryDate: new Date().toISOString() } : o
          ));
          addToast("Opportunity expired successfully", "warning");
        } catch (error) {
          console.error('Error expiring opportunity:', error);
          addToast("Failed to expire opportunity", "error");
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleReactivate = async (opp) => {
    try {
      await update(COLLECTIONS.OPPORTUNITIES, opp.id, { status: "active", expiryDate: null });
      setOpportunitiesList(opportunitiesList.map(o => 
        o.id === opp.id ? { ...o, status: "active", expiryDate: null } : o
      ));
      addToast("Opportunity reactivated successfully", "success");
    } catch (error) {
      console.error('Error reactivating opportunity:', error);
      addToast("Failed to reactivate opportunity", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast("Image size should be less than 5MB", "error");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (modalMode === "edit") {
      setFormData({ ...formData, imageUrl: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = formData.imageUrl || "";
      
      // Upload image if new file selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, STORAGE_PATHS.OPPORTUNITIES);
      }

      if (modalMode === "add") {
        const newOppData = { ...formData, imageUrl, status: "active", expiryDate: null };
        const newId = await create(COLLECTIONS.OPPORTUNITIES, newOppData);
        setOpportunitiesList([{ id: newId, ...newOppData }, ...opportunitiesList]);
        addToast("Opportunity added successfully", "success");
      } else if (modalMode === "edit") {
        const { id, createdAt, updatedAt, ...updateData } = formData;
        const updatedData = { ...updateData, imageUrl };
        await update(COLLECTIONS.OPPORTUNITIES, formData.id, updatedData);
        setOpportunitiesList(opportunitiesList.map(o => o.id === formData.id ? { ...formData, imageUrl } : o));
        addToast("Opportunity updated successfully", "success");
      }
      setShowModal(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving opportunity:', error);
      addToast("Failed to save opportunity", "error");
    } finally {
      setUploading(false);
    }
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
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchOpportunities}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e3e6ee] text-[#2c3348] text-[13px] sm:text-[14px] font-semibold rounded hover:bg-[#f6f7fb] transition-colors"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button 
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#002fa7] text-white text-[13px] sm:text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Add Opportunity
          </button>
        </div>
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
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={32} className="text-[#002fa7] animate-spin mx-auto mb-4" />
            <p className="text-[14px] text-[#5a6073]">Loading opportunities...</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
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
              <div><span className="font-semibold">Deadline:</span> {selectedOpportunity?.deadline ? new Date(selectedOpportunity.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</div>
              {selectedOpportunity?.salary && (
                <div><span className="font-semibold">Salary:</span> {selectedOpportunity?.salary}</div>
              )}
              {selectedOpportunity?.description && (
                <div><span className="font-semibold">Description:</span> <div className="mt-1 whitespace-pre-line">{selectedOpportunity?.description}</div></div>
              )}
              {selectedOpportunity?.responsibilities && (
                <div><span className="font-semibold">Responsibilities:</span> <div className="mt-1 whitespace-pre-line">{selectedOpportunity?.responsibilities}</div></div>
              )}
              {selectedOpportunity?.requirements && (
                <div><span className="font-semibold">Requirements:</span> <div className="mt-1 whitespace-pre-line">{selectedOpportunity?.requirements}</div></div>
              )}
              {selectedOpportunity?.benefits && (
                <div><span className="font-semibold">Benefits:</span> <div className="mt-1 whitespace-pre-line">{selectedOpportunity?.benefits}</div></div>
              )}
              {selectedOpportunity?.applicationLink && (
                <div>
                  <span className="font-semibold">Application Link:</span>{" "}
                  <a href={selectedOpportunity?.applicationLink} target="_blank" rel="noopener noreferrer" className="text-[#002fa7] hover:underline">
                    {selectedOpportunity?.applicationLink}
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Cover Image (Optional)</label>
                <div className="border-2 border-dashed border-[#e3e6ee] rounded-lg p-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded" />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer py-8">
                      <Upload size={32} className="text-[#8b91a5] mb-2" />
                      <span className="text-[13px] text-[#5a6073] mb-1">Click to upload cover image</span>
                      <span className="text-[11px] text-[#8b91a5]">PNG, JPG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-[11px] text-[#8b91a5] mt-1">If no image is uploaded, a default gradient will be used</p>
              </div>
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
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Deadline *</label>
                <input
                  type="date"
                  value={formData.deadline || ""}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  required
                />
                <p className="text-[11px] text-[#8b91a5] mt-1">Deadline cannot be in the past</p>
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
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Description *</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  rows="4"
                  placeholder="Provide a detailed description of the opportunity..."
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Responsibilities (Optional)</label>
                <textarea
                  value={formData.responsibilities || ""}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  rows="4"
                  placeholder="• List key responsibilities\n• One per line\n• Use bullet points for clarity"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Requirements (Optional)</label>
                <textarea
                  value={formData.requirements || ""}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  rows="4"
                  placeholder="• List the requirements\n• Qualifications needed\n• Experience level"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Benefits (Optional)</label>
                <textarea
                  value={formData.benefits || ""}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  rows="4"
                  placeholder="• Health insurance\n• Professional development\n• Flexible working hours\n• Other perks and benefits"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Application Link *</label>
                <input
                  type="url"
                  value={formData.applicationLink || ""}
                  onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder="https://example.com/apply"
                  required
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
                disabled={uploading}
                className="px-6 py-3 text-[14px] font-semibold text-white bg-[#002fa7] rounded hover:bg-[#0026c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  modalMode === "add" ? "Add Opportunity" : "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
