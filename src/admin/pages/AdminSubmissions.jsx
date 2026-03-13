import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Clock, RotateCcw, Inbox } from "lucide-react";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { getAll, update, routeSubmission, createSubmissionNotification, COLLECTIONS } from "../../services/firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import PageLoader from "../../components/PageLoader";
import { usePageReloadLoader } from "../../hooks/useSessionLoader";

export default function AdminSubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const showLoader = usePageReloadLoader([loading], 1200);

  // Load submissions from Firebase on mount
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        const data = await getAll(COLLECTIONS.SUBMISSIONS);
        // Sort by creation date (newest first)
        const sortedData = data.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        });
        setSubmissions(sortedData);
      } catch (error) {
        console.error('Error loading submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  const [filterStatus, setFilterStatus] = useState("All");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [submissionToAction, setSubmissionToAction] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredSubmissions = filterStatus === "All" 
    ? submissions 
    : submissions.filter(s => s.status === filterStatus.toLowerCase());

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-[#ea580c]/10 text-[#ea580c]";
      case "approved": return "bg-[#047857]/10 text-[#047857]";
      case "rejected": return "bg-[#dc2626]/10 text-[#dc2626]";
      default: return "bg-[#8b91a5]/10 text-[#8b91a5]";
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailsModal(true);
  };

  const handleApproveClick = (submission) => {
    setSubmissionToAction(submission);
    setShowApproveDialog(true);
  };

  const handleRejectClick = (submission) => {
    setSubmissionToAction(submission);
    setShowRejectDialog(true);
  };

  const getFormattedDate = (submission) => {
    if (submission.createdAt && submission.createdAt.seconds) {
      const date = new Date(submission.createdAt.seconds * 1000);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffInHours / 24);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
      }
    }
    return 'Recently';
  };

  const canUndoAction = (submission) => {
    if (!submission.actionTimestamp || submission.status === "pending") return false;
    const actionTime = submission.actionTimestamp.seconds ? 
      new Date(submission.actionTimestamp.seconds * 1000) : 
      new Date(submission.actionTimestamp);
    const now = new Date();
    const hoursPassed = (now - actionTime) / (1000 * 60 * 60);
    return hoursPassed < 1;
  };

  const getMinutesRemaining = (submission) => {
    if (!submission.actionTimestamp) return 0;
    const actionTime = submission.actionTimestamp.seconds ? 
      new Date(submission.actionTimestamp.seconds * 1000) : 
      new Date(submission.actionTimestamp);
    const now = new Date();
    const minutesPassed = (now - actionTime) / (1000 * 60);
    return Math.max(0, Math.floor(60 - minutesPassed));
  };

  const getRoutingDestination = (submission) => {
    const { submissionType, type, category } = submission;
    
    if (submissionType === 'story' || type === 'News Story') {
      return { collection: 'Articles', section: `${category} News` };
    } else if (submissionType === 'job' || type === 'Job Offer') {
      return { collection: 'Opportunities', section: 'Job Opportunities' };
    } else if (submissionType === 'opportunity' || type === 'Opportunity') {
      if (category === 'Events' || submission.eventDate) {
        return { collection: 'Events', section: 'Upcoming Events' };
      } else {
        return { collection: 'Opportunities', section: `${category} Opportunities` };
      }
    }
    return { collection: 'Unknown', section: 'Unknown' };
  };

  const confirmApprove = async () => {
    try {
      // First route the submission to appropriate collection and create notification
      const routingResult = await routeSubmission(submissionToAction);
      
      // Then update submission status with routing info
      await update(COLLECTIONS.SUBMISSIONS, submissionToAction.id, {
        status: "approved",
        actionTimestamp: new Date(),
        routedTo: routingResult.documentId,
        targetCollection: routingResult.targetCollection,
        notificationId: routingResult.notificationId
      });
      
      // Create notification for submission approval
      await createSubmissionNotification(submissionToAction, 'approved', user);
      
      setSubmissions(submissions.map(s => 
        s.id === submissionToAction.id ? { 
          ...s, 
          status: "approved", 
          actionTimestamp: { seconds: Date.now() / 1000 },
          routedTo: routingResult.documentId,
          targetCollection: routingResult.targetCollection
        } : s
      ));
      
      showToast(`"${submissionToAction.title}" has been approved, published, and added to messages for posting`, "success");
    } catch (error) {
      console.error('Error approving submission:', error);
      if (error.message.includes('Duplicate')) {
        showToast(`Cannot approve: ${error.message}`, 'error');
      } else {
        showToast('Failed to approve submission', 'error');
      }
    }
    setSubmissionToAction(null);
  };

  const confirmReject = async () => {
    try {
      await update(COLLECTIONS.SUBMISSIONS, submissionToAction.id, {
        status: "rejected",
        actionTimestamp: new Date()
      });
      
      // Create notification for submission rejection
      await createSubmissionNotification(submissionToAction, 'rejected', user);
      
      setSubmissions(submissions.map(s => 
        s.id === submissionToAction.id ? { 
          ...s, 
          status: "rejected", 
          actionTimestamp: { seconds: Date.now() / 1000 }
        } : s
      ));
      
      showToast(`"${submissionToAction.title}" has been rejected`, "warning");
    } catch (error) {
      console.error('Error rejecting submission:', error);
      showToast('Failed to reject submission', 'error');
    }
    setSubmissionToAction(null);
  };

  const handleUndoAction = async (submission) => {
    try {
      await update(COLLECTIONS.SUBMISSIONS, submission.id, {
        status: "pending",
        actionTimestamp: null
      });
      
      setSubmissions(submissions.map(s => 
        s.id === submission.id ? { ...s, status: "pending", actionTimestamp: null } : s
      ));
      
      showToast(`"${submission.title}" has been moved back to pending`, "info");
    } catch (error) {
      console.error('Error undoing action:', error);
      showToast('Failed to undo action', 'error');
    }
  };

  if (showLoader) {
    return <PageLoader isLoading={true} />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={confirmApprove}
        title="Approve Submission"
        message={`Are you sure you want to approve "${submissionToAction?.title}"? This will automatically publish the content to the appropriate section of the public site.`}
        confirmText="Approve"
        type="primary"
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={confirmReject}
        title="Reject Submission"
        message={`Are you sure you want to reject "${submissionToAction?.title}"? The submitter will be notified via email.`}
        confirmText="Reject"
        type="danger"
      />

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-playfair font-black text-[#0b1020] mb-2">Submissions</h1>
        <p className="text-[13px] sm:text-[14px] text-[#5a6073]">Review and approve user submissions</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Approved", "Rejected"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-semibold rounded transition-colors ${
                filterStatus === status
                  ? "bg-[#002fa7] text-white"
                  : "bg-[#f6f7fb] text-[#2c3348] hover:bg-[#e3e6ee]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="bg-white rounded-lg border border-[#e3e6ee] p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[14px] text-[#5a6073]">Loading submissions...</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-lg border border-[#e3e6ee] p-12 text-center">
              <div className="w-16 h-16 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox size={32} className="text-[#8b91a5]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">No Submissions Found</h3>
              <p className="text-[14px] text-[#5a6073] max-w-[400px] mx-auto">
                {filterStatus === "All" 
                  ? "There are no submissions yet. New submissions will appear here for review."
                  : `No ${filterStatus.toLowerCase()} submissions found. Try selecting a different filter.`
                }
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg border border-[#e3e6ee] p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <h3 className="text-[16px] sm:text-[18px] font-bold text-[#0b1020] mb-2 pr-2">{submission.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[12px] sm:text-[13px] text-[#5a6073]">
                      <span className="font-semibold">{submission.type}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>By {submission.author}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">{submission.email}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{getFormattedDate(submission)}</span>
                    </div>
                    {submission.status === "pending" && (
                      <div className="flex items-center gap-2 mt-2 text-[11px] sm:text-[12px] text-[#002fa7]">
                        <div className="w-2 h-2 rounded-full bg-[#002fa7]" />
                        <span>Will be published to: {getRoutingDestination(submission).section}</span>
                      </div>
                    )}
                    {canUndoAction(submission) && (
                      <div className="flex items-center gap-2 mt-2 text-[11px] sm:text-[12px] text-[#ea580c]">
                        <Clock size={14} />
                        <span>Undo available for {getMinutesRemaining(submission)} more minutes</span>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase rounded whitespace-nowrap self-start ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleViewDetails(submission)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-[12px] sm:text-[13px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors"
                  >
                    <Eye size={16} />
                    <span>View Details</span>
                  </button>
                  {submission.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApproveClick(submission)}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-[12px] sm:text-[13px] font-semibold text-white bg-[#047857] rounded hover:bg-[#036647] transition-colors"
                      >
                        <CheckCircle size={16} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectClick(submission)}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-[12px] sm:text-[13px] font-semibold text-white bg-[#dc2626] rounded hover:bg-[#b91c1c] transition-colors"
                      >
                        <XCircle size={16} />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                  {(submission.status === "approved" || submission.status === "rejected") && canUndoAction(submission) && (
                    <button
                      onClick={() => handleUndoAction(submission)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-[12px] sm:text-[13px] font-semibold text-[#ea580c] border border-[#ea580c] rounded hover:bg-[#ea580c] hover:text-white transition-colors"
                    >
                      <RotateCcw size={16} />
                      <span className="hidden sm:inline">Undo {submission.status === "approved" ? "Approval" : "Rejection"}</span>
                      <span className="sm:hidden">Undo</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-4 text-[12px] sm:text-[13px] text-[#5a6073]">
        Showing {filteredSubmissions.length} of {submissions.length} submissions
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Submission Details"
        size="lg"
      >
        {selectedSubmission && (
          <div className="p-6">
            {/* Image if available */}
            {selectedSubmission.imageUrl && (
              <div className="mb-6">
                <img
                  src={selectedSubmission.imageUrl}
                  alt={selectedSubmission.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Status Badge and Routing Info */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className={`px-4 py-2 text-[12px] font-bold uppercase rounded ${getStatusColor(selectedSubmission.status)}`}>
                {selectedSubmission.status}
              </span>
              {selectedSubmission.status === "pending" && (
                <div className="flex items-center gap-2 text-[13px] text-[#002fa7]">
                  <div className="w-2 h-2 rounded-full bg-[#002fa7]" />
                  <span>Will publish to: <strong>{getRoutingDestination(selectedSubmission).section}</strong></span>
                </div>
              )}
              {selectedSubmission.status === "approved" && selectedSubmission.routedTo && (
                <div className="flex items-center gap-2 text-[13px] text-[#047857]">
                  <div className="w-2 h-2 rounded-full bg-[#047857]" />
                  <span>Published to: <strong>{getRoutingDestination(selectedSubmission).section}</strong></span>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Title</label>
              <p className="text-[20px] font-bold text-[#0b1020]">{selectedSubmission.title}</p>
            </div>

            {/* Type and Category */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Type</label>
                <p className="text-[14px] text-[#2c3348]">{selectedSubmission.type}</p>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Category</label>
                <p className="text-[14px] text-[#2c3348]">{selectedSubmission.category}</p>
              </div>
            </div>

            {/* Submitter Information */}
            <div className="bg-[#f6f7fb] rounded-lg p-4 mb-6">
              <h4 className="text-[14px] font-bold text-[#0b1020] mb-3">Submitter Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#8b91a5] mb-1">Name</label>
                  <p className="text-[13px] text-[#2c3348]">{selectedSubmission.author}</p>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#8b91a5] mb-1">Email</label>
                  <p className="text-[13px] text-[#2c3348] break-all">{selectedSubmission.email}</p>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#8b91a5] mb-1">Phone</label>
                  <p className="text-[13px] text-[#2c3348]">{selectedSubmission.phone}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-[#8b91a5] mb-2">Description</label>
              <p className="text-[14px] text-[#2c3348] leading-relaxed">{selectedSubmission.description}</p>
            </div>

            {/* Additional Details based on type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {selectedSubmission.location && (
                <div>
                  <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Location</label>
                  <p className="text-[14px] text-[#2c3348]">{selectedSubmission.location}</p>
                </div>
              )}
              {selectedSubmission.company && (
                <div>
                  <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Company</label>
                  <p className="text-[14px] text-[#2c3348]">{selectedSubmission.company}</p>
                </div>
              )}
              {selectedSubmission.salary && (
                <div>
                  <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Salary</label>
                  <p className="text-[14px] text-[#047857] font-semibold">{selectedSubmission.salary}</p>
                </div>
              )}
              {selectedSubmission.deadline && (
                <div>
                  <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Deadline</label>
                  <p className="text-[14px] text-[#2c3348]">{selectedSubmission.deadline}</p>
                </div>
              )}
              {selectedSubmission.eventDate && (
                <div>
                  <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Event Date</label>
                  <p className="text-[14px] text-[#2c3348]">{selectedSubmission.eventDate}</p>
                </div>
              )}
              {selectedSubmission.price && (
                <div>
                  <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Price</label>
                  <p className="text-[14px] text-[#047857] font-semibold">{selectedSubmission.price}</p>
                </div>
              )}
            </div>

            {/* Submission Date */}
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-[#8b91a5] mb-1">Submitted</label>
              <p className="text-[14px] text-[#2c3348]">{getFormattedDate(selectedSubmission)}</p>
            </div>

            {/* Action Buttons */}
            {selectedSubmission.status === "pending" && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-[#e3e6ee]">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleApproveClick(selectedSubmission);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#047857] rounded hover:bg-[#036647] transition-colors"
                >
                  <CheckCircle size={18} />
                  Approve Submission
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleRejectClick(selectedSubmission);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#dc2626] rounded hover:bg-[#b91c1c] transition-colors"
                >
                  <XCircle size={18} />
                  Reject Submission
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}