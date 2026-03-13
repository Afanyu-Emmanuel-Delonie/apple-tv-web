import { useState } from "react";
import { CheckCircle, XCircle, Eye, Clock, RotateCcw } from "lucide-react";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([
    { 
      id: 1, 
      title: "Breaking: New Government Policy Announced", 
      type: "News Story", 
      category: "Politics",
      author: "John Doe", 
      email: "john@example.com", 
      phone: "+237 670 123 456",
      date: "2 hours ago", 
      status: "pending",
      actionTimestamp: null,
      description: "The government has announced a new policy regarding education reform. This comprehensive policy aims to improve the quality of education across all regions and make it more accessible to students from all backgrounds. The policy includes provisions for increased funding, teacher training programs, and infrastructure development.",
      location: "Yaoundé, Cameroon",
      image: "/src/assets/latest-news/g20-sumit.png"
    },
    { 
      id: 2, 
      title: "Software Developer Position at TechCorp", 
      type: "Job Offer", 
      category: "Full-time",
      author: "Jane Smith", 
      email: "jane@example.com", 
      phone: "+237 680 234 567",
      date: "5 hours ago", 
      status: "pending",
      actionTimestamp: null,
      description: "We are looking for an experienced Software Developer to join our growing team. The ideal candidate should have strong skills in React, Node.js, and cloud technologies. This is a full-time position with competitive salary and benefits.",
      location: "Douala, Cameroon",
      company: "TechCorp Solutions",
      salary: "800,000 - 1,200,000 XAF",
      deadline: "March 30, 2024"
    },
    { 
      id: 3, 
      title: "Youth Leadership Summit 2024", 
      type: "Event", 
      category: "Conference",
      author: "Mike Johnson", 
      email: "mike@example.com", 
      phone: "+237 690 345 678",
      date: "1 day ago", 
      status: "approved",
      actionTimestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      description: "Join us for the annual Youth Leadership Summit where young leaders from across Africa will gather to discuss innovation, entrepreneurship, and social impact. The event features keynote speakers, workshops, and networking opportunities.",
      location: "Yaoundé Conference Center",
      eventDate: "April 15-17, 2024",
      price: "Free"
    },
    { 
      id: 4, 
      title: "Marketing Internship at StartupHub", 
      type: "Opportunity", 
      category: "Internship",
      author: "Sarah Williams", 
      email: "sarah@example.com", 
      phone: "+237 670 456 789",
      date: "2 days ago", 
      status: "rejected",
      actionTimestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      description: "StartupHub is offering a 6-month marketing internship for students and recent graduates. This is a great opportunity to gain hands-on experience in digital marketing, social media management, and content creation.",
      location: "Douala, Cameroon",
      company: "StartupHub",
      deadline: "March 25, 2024"
    },
  ]);

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

  const canUndoAction = (submission) => {
    if (!submission.actionTimestamp || submission.status === "pending") return false;
    const actionTime = new Date(submission.actionTimestamp);
    const now = new Date();
    const hoursPassed = (now - actionTime) / (1000 * 60 * 60);
    return hoursPassed < 1;
  };

  const getMinutesRemaining = (submission) => {
    if (!submission.actionTimestamp) return 0;
    const actionTime = new Date(submission.actionTimestamp);
    const now = new Date();
    const minutesPassed = (now - actionTime) / (1000 * 60);
    return Math.max(0, Math.floor(60 - minutesPassed));
  };

  const confirmApprove = () => {
    setSubmissions(submissions.map(s => 
      s.id === submissionToAction.id ? { ...s, status: "approved", actionTimestamp: new Date().toISOString() } : s
    ));
    showToast(`"${submissionToAction.title}" has been approved successfully`, "success");
    setSubmissionToAction(null);
  };

  const confirmReject = () => {
    setSubmissions(submissions.map(s => 
      s.id === submissionToAction.id ? { ...s, status: "rejected", actionTimestamp: new Date().toISOString() } : s
    ));
    showToast(`"${submissionToAction.title}" has been rejected`, "warning");
    setSubmissionToAction(null);
  };

  const handleUndoAction = (submission) => {
    setSubmissions(submissions.map(s => 
      s.id === submission.id ? { ...s, status: "pending", actionTimestamp: null } : s
    ));
    showToast(`"${submission.title}" has been moved back to pending`, "info");
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

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={confirmApprove}
        title="Approve Submission"
        message={`Are you sure you want to approve "${submissionToAction?.title}"? This will publish the content to the public site.`}
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
      <div className="mb-8">
        <h1 className="text-[32px] font-playfair font-black text-[#0b1020] mb-2">Submissions</h1>
        <p className="text-[14px] text-[#5a6073]">Review and approve user submissions</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-[#e3e6ee] p-6 mb-6">
        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-[13px] font-semibold rounded transition-colors ${
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
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="bg-white rounded-lg border border-[#e3e6ee] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">{submission.title}</h3>
                <div className="flex items-center gap-4 text-[13px] text-[#5a6073]">
                  <span className="font-semibold">{submission.type}</span>
                  <span>•</span>
                  <span>By {submission.author}</span>
                  <span>•</span>
                  <span>{submission.email}</span>
                  <span>•</span>
                  <span>{submission.date}</span>
                </div>
                {canUndoAction(submission) && (
                  <div className="flex items-center gap-2 mt-2 text-[12px] text-[#ea580c]">
                    <Clock size={14} />
                    <span>Undo available for {getMinutesRemaining(submission)} more minutes</span>
                  </div>
                )}
              </div>
              <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${getStatusColor(submission.status)}`}>
                {submission.status}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleViewDetails(submission)}
                className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#002fa7] border border-[#002fa7] rounded hover:bg-[#002fa7] hover:text-white transition-colors"
              >
                <Eye size={16} />
                View Details
              </button>
              {submission.status === "pending" && (
                <>
                  <button
                    onClick={() => handleApproveClick(submission)}
                    className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-[#047857] rounded hover:bg-[#036647] transition-colors"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectClick(submission)}
                    className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-[#dc2626] rounded hover:bg-[#b91c1c] transition-colors"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </>
              )}
              {(submission.status === "approved" || submission.status === "rejected") && canUndoAction(submission) && (
                <button
                  onClick={() => handleUndoAction(submission)}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#ea580c] border border-[#ea580c] rounded hover:bg-[#ea580c] hover:text-white transition-colors"
                >
                  <RotateCcw size={16} />
                  Undo {submission.status === "approved" ? "Approval" : "Rejection"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-[13px] text-[#5a6073]">
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
            {selectedSubmission.image && (
              <div className="mb-6">
                <img
                  src={selectedSubmission.image}
                  alt={selectedSubmission.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Status Badge */}
            <div className="mb-6">
              <span className={`px-4 py-2 text-[12px] font-bold uppercase rounded ${getStatusColor(selectedSubmission.status)}`}>
                {selectedSubmission.status}
              </span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#8b91a5] mb-1">Name</label>
                  <p className="text-[13px] text-[#2c3348]">{selectedSubmission.author}</p>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#8b91a5] mb-1">Email</label>
                  <p className="text-[13px] text-[#2c3348]">{selectedSubmission.email}</p>
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
            <div className="grid grid-cols-2 gap-4 mb-6">
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
              <p className="text-[14px] text-[#2c3348]">{selectedSubmission.date}</p>
            </div>

            {/* Action Buttons */}
            {selectedSubmission.status === "pending" && (
              <div className="flex items-center gap-3 pt-6 border-t border-[#e3e6ee]">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleApproveClick(selectedSubmission);
                  }}
                  className="flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#047857] rounded hover:bg-[#036647] transition-colors"
                >
                  <CheckCircle size={18} />
                  Approve Submission
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleRejectClick(selectedSubmission);
                  }}
                  className="flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#dc2626] rounded hover:bg-[#b91c1c] transition-colors"
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
