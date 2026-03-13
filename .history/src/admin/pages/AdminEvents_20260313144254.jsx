/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Search, Clock, RotateCcw, Calendar, RefreshCw, Upload, X } from "lucide-react";
import { getAll, create, update, remove, COLLECTIONS } from "../../services/firebase/firestore";
import { uploadImage, STORAGE_PATHS } from "../../services/firebase/storage";
import { processExpiredEvents, getDaysUntilDeletion } from "../../services/firebase/eventService";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminEvents() {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

  const categories = ["All", "Conference", "Workshop", "Networking", "Career Fair", "Webinar", "Summit"];

  useEffect(() => {
    fetchEvents();
    checkExpiredEvents();
  }, []);

  const checkExpiredEvents = async () => {
    try {
      const result = await processExpiredEvents();
      if (result.success && result.processedCount > 0) {
        addToast(`Processed ${result.processedCount} expired events`, 'info');
        fetchEvents();
      }
    } catch (error) {
      console.error('Error checking expired events:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.EVENTS);
      setEventsList(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      addToast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = eventsList.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || event.category === filterCategory;
    const matchesStatus = filterStatus === "All" || event.status === filterStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const addToast = (message, type) => {
    setToast({ message, type });
  };

  const getDaysUntilDeletion = (expiryDate) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const deleteDate = new Date(expiry.getTime() + 3 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const handleAdd = () => {
    setModalMode("add");
    setFormData({ 
      title: "", 
      category: "Conference", 
      date: "", 
      location: "", 
      price: "", 
      description: "",
      registrationLink: "",
      imageUrl: "" 
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEdit = (event) => {
    setModalMode("edit");
    setFormData(event);
    setImageFile(null);
    setImagePreview(event.imageUrl || null);
    setShowModal(true);
  };

  const handleDelete = (event) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Event",
      message: `Are you sure you want to permanently delete "${event.title}"? This action cannot be undone.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await remove(COLLECTIONS.EVENTS, event.id);
          setEventsList(eventsList.filter(e => e.id !== event.id));
          addToast("Event deleted successfully", "success");
        } catch (error) {
          console.error('Error deleting event:', error);
          addToast("Failed to delete event", "error");
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleExpire = (event) => {
    setConfirmDialog({
      isOpen: true,
      title: "Expire Event",
      message: `Are you sure you want to expire "${event.title}"? It will be automatically deleted after 3 days (in case of extensions).`,
      type: "warning",
      onConfirm: async () => {
        try {
          await update(COLLECTIONS.EVENTS, event.id, { status: "expired", expiryDate: new Date().toISOString() });
          setEventsList(eventsList.map(e => 
            e.id === event.id ? { ...e, status: "expired", expiryDate: new Date().toISOString() } : e
          ));
          addToast("Event expired successfully", "warning");
        } catch (error) {
          console.error('Error expiring event:', error);
          addToast("Failed to expire event", "error");
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleReactivate = async (event) => {
    try {
      await update(COLLECTIONS.EVENTS, event.id, { status: "active", expiryDate: null });
      setEventsList(eventsList.map(e => 
        e.id === event.id ? { ...e, status: "active", expiryDate: null } : e
      ));
      addToast("Event reactivated successfully", "success");
    } catch (error) {
      console.error('Error reactivating event:', error);
      addToast("Failed to reactivate event", "error");
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
        imageUrl = await uploadImage(imageFile, STORAGE_PATHS.EVENTS);
      }

      if (modalMode === "add") {
        const newEventData = { ...formData, imageUrl, status: "active", expiryDate: null };
        const newId = await create(COLLECTIONS.EVENTS, newEventData);
        setEventsList([{ id: newId, ...newEventData }, ...eventsList]);
        addToast("Event added successfully", "success");
      } else if (modalMode === "edit") {
        const { id, createdAt, updatedAt, ...updateData } = formData;
        const updatedData = { ...updateData, imageUrl };
        await update(COLLECTIONS.EVENTS, formData.id, updatedData);
        setEventsList(eventsList.map(e => e.id === formData.id ? { ...formData, imageUrl } : e));
        addToast("Event updated successfully", "success");
      }
      setShowModal(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving event:', error);
      addToast("Failed to save event", "error");
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
          <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-playfair font-black text-[#0b1020] mb-2">Events</h1>
          <p className="text-[13px] sm:text-[14px] text-[#5a6073]">Manage all events and conferences</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchEvents}
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
            Add Event
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
              placeholder="Search events..."
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

      {/* Events Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-[#e3e6ee] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={32} className="text-[#002fa7] animate-spin mx-auto mb-4" />
            <p className="text-[14px] text-[#5a6073]">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Ca size={32} className="text-[#8b91a5]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">No Events Found</h3>
            <p className="text-[14px] text-[#5a6073] max-w-[400px] mx-auto mb-6">
              {filterStatus === "All" && filterCategory === "All"
                ? "No events available. Click 'Add Event' to create your first event."
                : "No events match your current filters. Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <table className="w-full">
          <thead className="bg-[#f6f7fb] border-b border-[#e3e6ee]">
            <tr>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Title</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Category</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Date</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Location</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Status</th>
              <th className="text-right px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-b border-[#e3e6ee] hover:bg-[#f6f7fb] transition-colors">
                <td className="px-6 py-4">
                  <div className="text-[14px] font-semibold text-[#0b1020]">{event.title}</div>
                  {event.status === "expired" && (
                    <div className="text-[11px] text-[#8b91a5] mt-1">
                      Auto-delete in {getDaysUntilDeletion(event.expiryDate)} days
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-[11px] font-bold uppercase rounded bg-[#002fa7]/10 text-[#002fa7]">
                    {event.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] text-[#5a6073]">
                  {event.date ? new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                </td>
                <td className="px-6 py-4 text-[13px] text-[#5a6073]">{event.location}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                    event.status === "active" ? "bg-[#047857]/10 text-[#047857]" : "bg-[#8b91a5]/10 text-[#8b91a5]"
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleView(event)}
                      className="p-2 text-[#002fa7] hover:bg-[#002fa7]/10 rounded transition-colors"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleEdit(event)}
                      className="p-2 text-[#047857] hover:bg-[#047857]/10 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    {event.status === "active" && (
                      <button
                        onClick={() => handleExpire(event)}
                        className="p-2 text-[#ea580c] hover:bg-[#ea580c]/10 rounded transition-colors"
                        title="Expire"
                      >
                        <Clock size={18} />
                      </button>
                    )}
                    {event.status === "expired" && (
                      <button
                        onClick={() => handleReactivate(event)}
                        className="p-2 text-[#047857] hover:bg-[#047857]/10 rounded transition-colors"
                        title="Reactivate"
                      >
                        <RotateCcw size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(event)}
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

      {/* Events Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e3e6ee] p-8 text-center">
            <div className="w-16 h-16 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-[#8b91a5]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">No Events Found</h3>
            <p className="text-[13px] text-[#5a6073] mb-4">
              {filterStatus === "All" && filterCategory === "All"
                ? "No events available. Click 'Add Event' to create your first event."
                : "No events match your current filters. Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg border border-[#e3e6ee] p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-[15px] font-bold text-[#0b1020] flex-1">{event.title}</h3>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded whitespace-nowrap ${
                event.status === "active" ? "bg-[#047857]/10 text-[#047857]" : "bg-[#8b91a5]/10 text-[#8b91a5]"
              }`}>
                {event.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[#002fa7]/10 text-[#002fa7]">
                  {event.category}
                </span>
              </div>
              <div className="text-[13px] text-[#5a6073]">
                <span className="font-semibold">Date:</span> {event.date ? new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
              </div>
              <div className="text-[13px] text-[#5a6073]">
                <span className="font-semibold">Location:</span> {event.location}
              </div>
              {event.status === "expired" && (
                <div className="text-[11px] text-[#8b91a5]">
                  Auto-delete in {getDaysUntilDeletion(event.expiryDate)} days
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => handleView(event)}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors"
              >
                <Eye size={16} />
                View
              </button>
              <button 
                onClick={() => handleEdit(event)}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#047857] border border-[#047857] rounded hover:bg-[#047857] hover:text-white transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              {event.status === "active" && (
                <button
                  onClick={() => handleExpire(event)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#ea580c] border border-[#ea580c] rounded hover:bg-[#ea580c] hover:text-white transition-colors"
                >
                  <Clock size={16} />
                  Expire
                </button>
              )}
              {event.status === "expired" && (
                <button
                  onClick={() => handleReactivate(event)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#047857] border border-[#047857] rounded hover:bg-[#047857] hover:text-white transition-colors"
                >
                  <RotateCcw size={16} />
                  Reactivate
                </button>
              )}
              <button
                onClick={() => handleDelete(event)}
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
        Showing {filteredEvents.length} of {eventsList.length} events
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === "add" ? "Add Event" : modalMode === "edit" ? "Edit Event" : "Event Details"}
        size="lg"
      >
        {modalMode === "view" ? (
          <div className="p-6">
            <div className="mb-4">
              <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                selectedEvent?.status === "active" ? "bg-[#047857]/10 text-[#047857]" : "bg-[#8b91a5]/10 text-[#8b91a5]"
              }`}>
                {selectedEvent?.status}
              </span>
            </div>
            <h3 className="text-[20px] font-bold text-[#0b1020] mb-4">{selectedEvent?.title}</h3>
            <div className="space-y-3 text-[14px]">
              <div><span className="font-semibold">Category:</span> {selectedEvent?.category}</div>
              <div><span className="font-semibold">Date:</span> {selectedEvent?.date ? new Date(selectedEvent.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</div>
              <div><span className="font-semibold">Location:</span> {selectedEvent?.location}</div>
              <div><span className="font-semibold">Price:</span> {selectedEvent?.price}</div>
              {selectedEvent?.registrationLink && (
                <div>
                  <span className="font-semibold">Registration:</span>{" "}
                  <a href={selectedEvent?.registrationLink} target="_blank" rel="noopener noreferrer" className="text-[#002fa7] hover:underline">
                    {selectedEvent?.registrationLink}
                  </a>
                </div>
              )}
              {selectedEvent?.description && (
                <div><span className="font-semibold">Description:</span> <div className="mt-1 whitespace-pre-line">{selectedEvent?.description}</div></div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Event Image (Optional)</label>
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
                      <span className="text-[13px] text-[#5a6073] mb-1">Click to upload event image</span>
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
                  value={formData.category || "Conference"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                >
                  {categories.filter(c => c !== "All").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Event Date *</label>
                <input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  required
                />
                <p className="text-[11px] text-[#8b91a5] mt-1">Event date cannot be in the past</p>
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
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Price</label>
                <input
                  type="text"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder="e.g., Free or $50"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Description *</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  rows="4"
                  placeholder="Provide event details, agenda, speakers, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Registration Link *</label>
                <input
                  type="url"
                  value={formData.registrationLink || ""}
                  onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder="https://example.com/register"
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
                  modalMode === "add" ? "Add Event" : "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
