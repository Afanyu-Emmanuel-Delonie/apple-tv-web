import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Search, Clock } from "lucide-react";
import { newsArticles } from "../../constants/news";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminArticles() {
  const [articles, setArticles] = useState(newsArticles.map(a => ({ ...a, status: "active", expiryDate: null })));
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add, edit, view
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExpireDialog, setShowExpireDialog] = useState(false);
  const [articleToAction, setArticleToAction] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Latest",
    excerpt: "",
    author: "",
    date: new Date().toLocaleDateString(),
    image: "",
    status: "active"
  });

  const categories = ["All", "Latest", "International", "Business", "Politics", "Entertainment"];
  const statuses = ["All", "Active", "Expired"];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || article.category === filterCategory;
    const matchesStatus = filterStatus === "All" || article.status === filterStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleDelete = (article) => {
    setArticleToAction(article);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setArticles(articles.filter(a => a.id !== articleToAction.id));
    showToast("Article deleted successfully", "success");
    setArticleToAction(null);
  };

  const handleExpire = (article) => {
    setArticleToAction(article);
    setShowExpireDialog(true);
  };

  const confirmExpire = () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now for auto-deletion
    
    setArticles(articles.map(a => 
      a.id === articleToAction.id 
        ? { ...a, status: "expired", expiryDate: expiryDate.toISOString() } 
        : a
    ));
    showToast(`Article marked as expired. Will be auto-deleted after 30 days.`, "warning");
    setArticleToAction(null);
  };

  const handleReactivate = (article) => {
    setArticles(articles.map(a => 
      a.id === article.id 
        ? { ...a, status: "active", expiryDate: null } 
        : a
    ));
    showToast("Article reactivated successfully", "success");
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      author: article.author,
      date: article.date,
      image: article.image,
      status: article.status
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    setModalMode("view");
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedArticle(null);
    setFormData({
      title: "",
      category: "Latest",
      excerpt: "",
      author: "",
      date: new Date().toLocaleDateString(),
      image: "",
      status: "active"
    });
    setModalMode("add");
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === "add") {
      const newArticle = {
        id: articles.length + 1,
        ...formData,
        expiryDate: null
      };
      setArticles([newArticle, ...articles]);
      showToast("Article created successfully", "success");
    } else if (modalMode === "edit") {
      setArticles(articles.map(a => 
        a.id === selectedArticle.id ? { ...a, ...formData } : a
      ));
      showToast("Article updated successfully", "success");
    }
    
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return "bg-[#047857]/10 text-[#047857]";
      case "expired":
        return "bg-[#8b91a5]/10 text-[#8b91a5]";
      default:
        return "bg-[#002fa7]/10 text-[#002fa7]";
    }
  };

  const getDaysUntilDeletion = (expiryDate) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="p-8">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${articleToAction?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Expire Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showExpireDialog}
        onClose={() => setShowExpireDialog(false)}
        onConfirm={confirmExpire}
        title="Mark as Expired"
        message={`Mark "${articleToAction?.title}" as expired? The article will be hidden from the public site and automatically deleted after 30 days unless reactivated.`}
        confirmText="Mark as Expired"
        type="warning"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-playfair font-black text-[#0b1020] mb-2">Articles</h1>
          <p className="text-[14px] text-[#5a6073]">Manage all published articles</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#002fa7] text-white text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors"
        >
          <Plus size={20} />
          Add Article
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b91a5]" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f6f7fb] border-b border-[#e3e6ee]">
            <tr>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Title</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Category</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Status</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Date</th>
              <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Author</th>
              <th className="text-right px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => {
              const daysLeft = getDaysUntilDeletion(article.expiryDate);
              return (
                <tr key={article.id} className="border-b border-[#e3e6ee] hover:bg-[#f6f7fb] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-semibold text-[#0b1020]">{article.title}</div>
                    {article.status === "expired" && daysLeft !== null && (
                      <div className="text-[11px] text-[#dc2626] mt-1">
                        Auto-delete in {daysLeft} days
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase rounded bg-[#002fa7]/10 text-[#002fa7]">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${getStatusBadge(article.status)}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#5a6073]">{article.date}</td>
                  <td className="px-6 py-4 text-[13px] text-[#5a6073]">{article.author}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(article)}
                        className="p-2 text-[#002fa7] hover:bg-[#002fa7]/10 rounded transition-colors"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-2 text-[#047857] hover:bg-[#047857]/10 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      {article.status === "active" ? (
                        <button
                          onClick={() => handleExpire(article)}
                          className="p-2 text-[#ea580c] hover:bg-[#ea580c]/10 rounded transition-colors"
                          title="Mark as Expired"
                        >
                          <Clock size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(article)}
                          className="p-2 text-[#047857] hover:bg-[#047857]/10 rounded transition-colors"
                          title="Reactivate"
                        >
                          <Clock size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(article)}
                        className="p-2 text-[#dc2626] hover:bg-[#dc2626]/10 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-[13px] text-[#5a6073]">
        Showing {filteredArticles.length} of {articles.length} articles
      </div>

      {/* Modal for Add/Edit/View */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === "add" ? "Add New Article" :
          modalMode === "edit" ? "Edit Article" :
          "Article Details"
        }
        size="lg"
      >
        {modalMode === "view" ? (
          // View Mode
          <div className="p-6">
            <div className="mb-6">
              <img
                src={selectedArticle?.image}
                alt={selectedArticle?.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Title</label>
                <p className="text-[16px] font-bold text-[#0b1020]">{selectedArticle?.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Category</label>
                  <p className="text-[14px] text-[#2c3348]">{selectedArticle?.category}</p>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Date</label>
                  <p className="text-[14px] text-[#2c3348]">{selectedArticle?.date}</p>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Author</label>
                <p className="text-[14px] text-[#2c3348]">{selectedArticle?.author}</p>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Excerpt</label>
                <p className="text-[14px] text-[#2c3348] leading-relaxed">{selectedArticle?.excerpt}</p>
              </div>
            </div>
          </div>
        ) : (
          // Add/Edit Mode
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder="Enter article title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  >
                    {categories.filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Excerpt *</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7] resize-none"
                  placeholder="Brief description of the article"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end mt-6 pt-6 border-t border-[#e3e6ee]">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-3 text-[14px] font-semibold text-[#2c3348] border border-[#e3e6ee] rounded hover:bg-[#f0f2f8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-[14px] font-semibold text-white bg-[#002fa7] rounded hover:bg-[#0026c4] transition-colors"
              >
                {modalMode === "add" ? "Create Article" : "Update Article"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
