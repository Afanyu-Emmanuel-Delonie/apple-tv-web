import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Search, Clock, RotateCcw } from "lucide-react";
import { events } from "../../constants/events";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminEvents() {
  const [eventsList, setEventsList] = useState(
    events.map(event => ({ ...event, status: "active", expiryDate: null }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

  const categories = ["All", "Conference", "Workshop", "Networking", "Career Fair", "Webinar", "Summit"];

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
    const deleteDate = new Date(expiry.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const handleAdd = () => {
    setModalMode("add");
    setFormData({ title: "", category: "Conference", date: "", location: "", price: "", description: "" });
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
    setShowModal(true);
  };

  const handleDelete = (event) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Event",
      message: `Are you sure you want to permanently delete "${event.title}"? This action cannot be undone.`,
      type: "danger",
      onConfirm: () => {
        setEventsList(eventsList.filter(e => e.id !== event.id));
        addToast("Event deleted successfully", "success");
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleExpire = (event) => {
    setConfirmDialog({
      isOpen: true,
      title: "Expire Event",
      message: `Are you sure you want to expire "${event.title}"? It will be automatically deleted after 30 days.`,
      type: "warning",
      onConfirm: () => {
        setEventsList(eventsList.map(e => 
          e.id === event.id ? { ...e, status: "expired", expiryDate: new Date().toISOString() } : e
        ));
        addToast("Event expired successfully", "warning");
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleReactivate = (event) => {
    setEventsList(eventsList.map(e => 
      e.id === event.id ? { ...e, status: "active", expiryDate: null } : e
    ));
    addToast("Event reactivated successfully", "success");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newEvent = { ...formData, id: Date.now(), status: "active", expiryDate: null };
      setEventsList([newEvent, ...eventsList]);
      addToast("Event added successfully", "success");
    } else if (modalMode === "edit") {
      setEventsList(eventsList.map(e => e.id === formData.id ? formData : e));
      addToast("Event updated successfully", "success");
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
          <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-playfair font-black text-[#0b1020] mb-2">Events</h1>
          <p className="text-[13px] sm:text-[14px] text-[#5a6073]">Manage all events and conferences</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#002fa7] text-white text-[13px] sm:text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          Add Event
        </button>
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
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-[#8b91a5]" />
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
                <td className="px-6 py-4 text-[13px] text-[#5a6073]">{event.date}</td>
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
                <span className="font-semibold">Date:</span> {event.date}
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
              <div><span className="font-semibold">Date:</span> {selectedEvent?.date}</div>
              <div><span className="font-semibold">Location:</span> {selectedEvent?.location}</div>
              <div><span className="font-semibold">Price:</span> {selectedEvent?.price}</div>
              {selectedEvent?.description && (
                <div><span className="font-semibold">Description:</span> {selectedEvent?.description}</div>
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
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Date</label>
                <input
                  type="text"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder="e.g., March 15, 2024"
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
                {modalMode === "add" ? "Add Event" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
