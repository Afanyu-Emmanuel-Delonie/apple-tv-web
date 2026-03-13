import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Search, Clock, RefreshCw, Upload, X, AlertTriangle, Lock } from "lucide-react";
import { getAll, createWithDuplicateCheck, updateWithDuplicateCheck, remove, createContentNotification, COLLECTIONS } from "../../services/firebase/firestore";
import { uploadImage, STORAGE_PATHS } from "../../services/firebase/storage";
import { categories } from "../../constants/news";
import { useAuth } from "../../contexts/AuthContext";
import { hasPermission, canModifyItem, filterItemsByPermission, PERMISSIONS } from "../../utils/permissions";
import PageLoader from "../../components/PageLoader";
import { usePageReloadLoader } from "../../hooks/useSessionLoader";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminArticles() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const showLoader = usePageReloadLoader([loading], 1200);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [formData, setFormData] = useState({
    title: "",
    category: "Latest",
    excerpt: "",
    content: "",
    author: "",
    imageUrl: "",
    isSensitive: false,
    status: "active"
  });

  const availableCategories = ["All", ...categories.map(cat => cat.name)];

  // Calculate category statistics based on filtered articles
  const getCategoryStats = () => {
    const stats = {};
    const activeArticles = filteredArticles.filter(article => article.status === "active");
    
    availableCategories.forEach(categoryName => {
      if (categoryName === "All") {
        stats[categoryName] = {
          count: activeArticles.length,
          color: "#002fa7"
        };
      } else {
        const categoryArticles = activeArticles.filter(article => article.category === categoryName);
        const categoryData = categories.find(cat => cat.name === categoryName);
        stats[categoryName] = {
          count: categoryArticles.length,
          color: categoryData?.color || "#8b91a5"
        };
      }
    });
    
    return stats;
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter articles based on user permissions and search/filter criteria
  useEffect(() => {
    let filtered = filterItemsByPermission(articles, user, 'article');
    
    // Apply search and category filters
    filtered = filtered.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" || article.category === filterCategory;
      const matchesStatus = filterStatus === "All" || article.status === filterStatus.toLowerCase();
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredArticles(filtered);
  }, [articles, user, searchTerm, filterCategory, filterStatus]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.ARTICLES);
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      addToast('Failed to load articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message, type) => {
    setToast({ message, type });
  };

  // Check if user can create articles
  const canCreateArticle = hasPermission(user, PERMISSIONS.CREATE_ARTICLE);
  
  // Check if user can edit/delete specific article
  const canEditArticle = (article) => canModifyItem(user, article, 'edit', 'article');
  const canDeleteArticle = (article) => canModifyItem(user, article, 'delete', 'article');

  const handleAdd = () => {
    if (!canCreateArticle) {
      addToast('You do not have permission to create articles', 'error');
      return;
    }
    
    setModalMode("add");
    setFormData({
      title: "",
      category: "Headlines",
      excerpt: "",
      content: "",
      author: user?.displayName || user?.name || "",
      imageUrl: "",
      isSensitive: false,
      status: "active"
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEdit = (article) => {
    if (!canEditArticle(article)) {
      addToast('You do not have permission to edit this article', 'error');
      return;
    }
    
    setModalMode("edit");
    setFormData(article);
    setImageFile(null);
    setImagePreview(article.imageUrl || null);
    setShowModal(true);
  };

  const handleDelete = (article) => {
    if (!canDeleteArticle(article)) {
      addToast('You do not have permission to delete this article', 'error');
      return;
    }
    
    setConfirmDialog({
      isOpen: true,
      title: "Delete Article",
      message: `Are you sure you want to permanently delete "${article.title}"? This action cannot be undone.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await remove(COLLECTIONS.ARTICLES, article.id);
          setArticles(articles.filter(a => a.id !== article.id));
          
          // Create notification for deleted article
          await createContentNotification(COLLECTIONS.ARTICLES, article, user, 'deleted');
          
          addToast("Article deleted successfully", "success");
        } catch (error) {
          console.error('Error deleting article:', error);
          addToast("Failed to delete article", "error");
        }
        setConfirmDialog({ isOpen: false });
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
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
        imageUrl = await uploadImage(imageFile, STORAGE_PATHS.ARTICLES);
      }

      if (modalMode === "add") {
        const newArticleData = { 
          ...formData, 
          imageUrl, 
          status: "active",
          createdBy: user?.uid,
          author: formData.author || user?.displayName || user?.name || "Unknown"
        };
        try {
          const newId = await createWithDuplicateCheck(COLLECTIONS.ARTICLES, newArticleData, false);
          const newArticle = { id: newId, ...newArticleData };
          setArticles([newArticle, ...articles]);
          
          // Create notification for new article
          await createContentNotification(COLLECTIONS.ARTICLES, newArticle, user, 'created');
          
          addToast("Article added successfully", "success");
        } catch (error) {
          if (error.message.includes('Duplicate')) {
            addToast(error.message, "error");
            return;
          }
          throw error;
        }
      } else if (modalMode === "edit") {
        const { id, createdAt, updatedAt, ...updateData } = formData;
        const updatedData = { ...updateData, imageUrl };
        try {
          await updateWithDuplicateCheck(COLLECTIONS.ARTICLES, formData.id, updatedData, false);
          const updatedArticle = { ...formData, imageUrl };
          setArticles(articles.map(a => a.id === formData.id ? updatedArticle : a));
          
          // Create notification for updated article
          await createContentNotification(COLLECTIONS.ARTICLES, updatedArticle, user, 'updated');
          
          addToast("Article updated successfully", "success");
        } catch (error) {
          if (error.message.includes('Duplicate')) {
            addToast(error.message, "error");
            return;
          }
          throw error;
        }
      }
      setShowModal(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving article:', error);
      addToast("Failed to save article", "error");
    } finally {
      setUploading(false);
    }
  };

  if (showLoader) {
    return <PageLoader isLoading={true} />;
  }

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
          <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-playfair font-black text-[#0b1020] mb-2">Articles</h1>
          <p className="text-[13px] sm:text-[14px] text-[#5a6073]">Manage all published articles</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchArticles}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e3e6ee] text-[#2c3348] text-[13px] sm:text-[14px] font-semibold rounded hover:bg-[#f6f7fb] transition-colors"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button 
            onClick={handleAdd}
            disabled={!canCreateArticle}
            className={`flex items-center justify-center gap-2 px-6 py-3 text-[13px] sm:text-[14px] font-semibold rounded transition-colors whitespace-nowrap ${
              canCreateArticle 
                ? "bg-[#002fa7] text-white hover:bg-[#0026c4]" 
                : "bg-[#8b91a5] text-white cursor-not-allowed"
            }`}
            title={!canCreateArticle ? "You don't have permission to create articles" : ""}
          >
            <Plus size={20} />
            Add Article
          </button>
        </div>
      </div>

      {/* Category Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {Object.entries(getCategoryStats()).map(([category, stats]) => (
          <div 
            key={category}
            className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
              filterCategory === category 
                ? 'border-current shadow-md' 
                : 'border-[#e3e6ee] hover:border-[#d1d5db]'
            }`}
            style={{ 
              borderColor: filterCategory === category ? stats.color : undefined,
              backgroundColor: filterCategory === category ? `${stats.color}08` : undefined
            }}
            onClick={() => setFilterCategory(category)}
          >
            <div className="flex items-center justify-between mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stats.color }}
              />
              <span 
                className="text-[24px] sm:text-[28px] font-black"
                style={{ color: stats.color }}
              >
                {stats.count}
              </span>
            </div>
            <div className="text-[12px] sm:text-[13px] font-semibold text-[#2c3348] truncate">
              {category}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8b91a5] mt-1">
              {stats.count === 1 ? 'Article' : 'Articles'}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b91a5]" />
            <input
              type="text"
              placeholder="Search articles..."
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
            {availableCategories.map(cat => (
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

      {/* Articles Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-[#e3e6ee] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={32} className="text-[#002fa7] animate-spin mx-auto mb-4" />
            <p className="text-[14px] text-[#5a6073]">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-[#8b91a5]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">No Articles Found</h3>
            <p className="text-[14px] text-[#5a6073] max-w-[400px] mx-auto mb-6">
              {filterStatus === "All" && filterCategory === "All"
                ? "No articles available. Click 'Add Article' to create your first article."
                : "No articles match your current filters. Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#f6f7fb] border-b border-[#e3e6ee]">
              <tr>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Title</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Category</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Author</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Status</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Sensitive</th>
                <th className="text-right px-6 py-4 text-[13px] font-semibold text-[#2c3348]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id} className="border-b border-[#e3e6ee] hover:bg-[#f6f7fb] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-semibold text-[#0b1020]">{article.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase rounded bg-[#002fa7]/10 text-[#002fa7]">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#5a6073]">{article.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                      article.status === "active" ? "bg-[#047857]/10 text-[#047857]" : "bg-[#8b91a5]/10 text-[#8b91a5]"
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {article.isSensitive && (
                      <div className="flex items-center gap-1 text-[#dc2626]">
                        <AlertTriangle size={16} />
                        <span className="text-[11px] font-semibold">Yes</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleView(article)}
                        className="p-2 text-[#002fa7] hover:bg-[#002fa7]/10 rounded transition-colors"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      {canEditArticle(article) ? (
                        <button 
                          onClick={() => handleEdit(article)}
                          className="p-2 text-[#047857] hover:bg-[#047857]/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      ) : (
                        <button 
                          className="p-2 text-[#8b91a5] cursor-not-allowed"
                          title="You don't have permission to edit this article"
                          disabled
                        >
                          <Lock size={18} />
                        </button>
                      )}
                      {canDeleteArticle(article) ? (
                        <button
                          onClick={() => handleDelete(article)}
                          className="p-2 text-[#dc2626] hover:bg-[#dc2626]/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <button 
                          className="p-2 text-[#8b91a5] cursor-not-allowed"
                          title="You don't have permission to delete this article"
                          disabled
                        >
                          <Lock size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Articles Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e3e6ee] p-8 text-center">
            <div className="w-16 h-16 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-[#8b91a5]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#0b1020] mb-2">No Articles Found</h3>
            <p className="text-[13px] text-[#5a6073] mb-4">
              {filterStatus === "All" && filterCategory === "All"
                ? "No articles available. Click 'Add Article' to create your first article."
                : "No articles match your current filters. Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg border border-[#e3e6ee] p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-[15px] font-bold text-[#0b1020] flex-1">{article.title}</h3>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded whitespace-nowrap ${
                  article.status === "active" ? "bg-[#047857]/10 text-[#047857]" : "bg-[#8b91a5]/10 text-[#8b91a5]"
                }`}>
                  {article.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[#002fa7]/10 text-[#002fa7]">
                    {article.category}
                  </span>
                  {article.isSensitive && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[#dc2626]/10 text-[#dc2626] flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Sensitive
                    </span>
                  )}
                </div>
                <div className="text-[13px] text-[#5a6073]">
                  <span className="font-semibold">Author:</span> {article.author}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => handleView(article)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors"
                >
                  <Eye size={16} />
                  View
                </button>
                {canEditArticle(article) ? (
                  <button 
                    onClick={() => handleEdit(article)}
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#047857] border border-[#047857] rounded hover:bg-[#047857] hover:text-white transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                ) : (
                  <button 
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#8b91a5] border border-[#8b91a5] rounded cursor-not-allowed"
                    title="You don't have permission to edit this article"
                    disabled
                  >
                    <Lock size={16} />
                    Edit
                  </button>
                )}
                {canDeleteArticle(article) ? (
                  <button
                    onClick={() => handleDelete(article)}
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#dc2626] border border-[#dc2626] rounded hover:bg-[#dc2626] hover:text-white transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                ) : (
                  <button 
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#8b91a5] border border-[#8b91a5] rounded cursor-not-allowed"
                    title="You don't have permission to delete this article"
                    disabled
                  >
                    <Lock size={16} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-[12px] sm:text-[13px] text-[#5a6073]">
        Showing {filteredArticles.length} of {articles.length} articles
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === "add" ? "Add Article" : modalMode === "edit" ? "Edit Article" : "Article Details"}
        size="lg"
      >
        {modalMode === "view" ? (
          <div className="p-6">
            <div className="mb-4">
              <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                selectedArticle?.status === "active" ? "bg-[#047857]/10 text-[#047857]" : "bg-[#8b91a5]/10 text-[#8b91a5]"
              }`}>
                {selectedArticle?.status}
              </span>
              {selectedArticle?.isSensitive && (
                <span className="ml-2 px-3 py-1 text-[11px] font-bold uppercase rounded bg-[#dc2626]/10 text-[#dc2626] inline-flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Sensitive Content
                </span>
              )}
            </div>
            <h3 className="text-[20px] font-bold text-[#0b1020] mb-4">{selectedArticle?.title}</h3>
            <div className="space-y-3 text-[14px]">
              <div><span className="font-semibold">Category:</span> {selectedArticle?.category}</div>
              <div><span className="font-semibold">Author:</span> {selectedArticle?.author}</div>
              {selectedArticle?.imageUrl && (
                <div>
                  <span className="font-semibold">Image:</span>
                  <img src={selectedArticle?.imageUrl} alt={selectedArticle?.title} className="w-full h-48 object-cover rounded mt-2" />
                </div>
              )}
              {selectedArticle?.excerpt && (
                <div><span className="font-semibold">Excerpt:</span> <div className="mt-1">{selectedArticle?.excerpt}</div></div>
              )}
              {selectedArticle?.content && (
                <div><span className="font-semibold">Content:</span> <div className="mt-1 whitespace-pre-line">{selectedArticle?.content}</div></div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Article Image (Optional)</label>
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
                      <span className="text-[13px] text-[#5a6073] mb-1">Click to upload article image</span>
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
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Category *</label>
                  <select
                    value={formData.category || "Headlines"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  >
                    {availableCategories.filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Author *</label>
                  <input
                    type="text"
                    value={formData.author || ""}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Excerpt *</label>
                <textarea
                  value={formData.excerpt || ""}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  rows="3"
                  placeholder="Brief summary of the article"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Content *</label>
                <textarea
                  value={formData.content || ""}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  rows="6"
                  placeholder="Full article content"
                  required
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#dc2626]/10 rounded-lg">
                <input
                  type="checkbox"
                  id="isSensitive"
                  checked={formData.isSensitive || false}
                  onChange={(e) => setFormData({ ...formData, isSensitive: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="isSensitive" className="text-[13px] font-semibold text-[#dc2626] cursor-pointer">
                  Mark as sensitive content (sexual assault, accidents, violence, etc.)
                </label>
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
                  modalMode === "add" ? "Add Article" : "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
