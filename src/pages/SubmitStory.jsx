import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, X } from "lucide-react";
import { create, createNotification, COLLECTIONS } from "../services/firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../services/firebase/config";
import { useFormTracking } from "../hooks/useAnalytics";

export default function SubmitStory() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackStorySubmit } = useFormTracking();
  const [formData, setFormData] = useState({
    submissionType: "story",
    name: "",
    email: "",
    phone: "",
    title: "",
    category: "",
    description: "",
    location: "",
    deadline: "",
    company: "",
    salary: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (formData.image) {
        const storage = getStorage(app);
        const imageRef = ref(storage, `submissions/${Date.now()}_${formData.image.name}`);
        const snapshot = await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      
      // Create submission object
      const submission = {
        title: formData.title,
        type: formData.submissionType === "story" ? "News Story" : 
              formData.submissionType === "job" ? "Job Offer" : "Opportunity",
        category: formData.category,
        author: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: "pending",
        description: formData.description,
        location: formData.location,
        deadline: formData.deadline,
        company: formData.company,
        salary: formData.salary,
        imageUrl: imageUrl,
        submissionType: formData.submissionType
      };
      
      // Save to Firebase
      const submissionId = await create(COLLECTIONS.SUBMISSIONS, submission);
      
      // Create notification for new submission
      await createNotification(
        'submission',
        'New Submission Received',
        `New ${submission.type.toLowerCase()} submission "${submission.title}" received from ${submission.author}.`,
        {
          submissionId,
          submissionType: submission.type,
          submitter: {
            name: submission.author,
            email: submission.email
          },
          content: {
            title: submission.title,
            category: submission.category
          }
        }
      );
      
      // Track successful submission
      trackStorySubmit(formData.submissionType);
      
      // Show success toast
      setShowToast(true);
      
      // Reset form
      setFormData({
        submissionType: "story",
        name: "",
        email: "",
        phone: "",
        title: "",
        category: "",
        description: "",
        location: "",
        deadline: "",
        company: "",
        salary: "",
        image: null
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Hide toast after 5 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting story:', error);
      alert('Failed to submit your story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#e3e6ee] p-4 flex items-start gap-3 min-w-[320px] max-w-[400px]">
            <div className="w-10 h-10 rounded-full bg-[#047857]/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} className="text-[#047857]" />
            </div>
            <div className="flex-1">
              <h4 className="text-[14px] font-bold text-[#0b1020] mb-1">Submission Received!</h4>
              <p className="text-[13px] text-[#5a6073]">
                Thank you! Your submission has been received and will be reviewed by our admin team shortly.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-[#8b91a5] hover:text-[#0b1020] transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#002fa7] to-[#0066cc] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70">
              Share With Us
            </span>
          </div>
          <h1 className="text-[clamp(28px,6vw,56px)] font-playfair font-black text-white leading-[1.05] mb-4">
            Submit Your <span className="italic">Story</span>
          </h1>
          <p className="text-[16px] text-white/80 max-w-[700px] leading-relaxed">
            Have a news story, job opportunity, or event to share? We'd love to hear from you. Your voice matters in keeping our community informed and connected.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-6 py-12">
        
        {/* Submission Type Selection */}
        <div className="mb-8">
          <h2 className="text-[24px] font-playfair font-black text-[#0b1020] mb-4">What would you like to submit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, submissionType: "story" }))}
              className={`p-6 rounded-lg border-2 transition-all ${
                formData.submissionType === "story"
                  ? "border-[#002fa7] bg-[#002fa7]/5"
                  : "border-[#e3e6ee] hover:border-[#002fa7]/50"
              }`}
            >
              <div className="w-12 h-12 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020] text-center">News Story</h3>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, submissionType: "job" }))}
              className={`p-6 rounded-lg border-2 transition-all ${
                formData.submissionType === "job"
                  ? "border-[#002fa7] bg-[#002fa7]/5"
                  : "border-[#e3e6ee] hover:border-[#002fa7]/50"
              }`}
            >
              <div className="w-12 h-12 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020] text-center">Job Offer</h3>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, submissionType: "opportunity" }))}
              className={`p-6 rounded-lg border-2 transition-all ${
                formData.submissionType === "opportunity"
                  ? "border-[#002fa7] bg-[#002fa7]/5"
                  : "border-[#e3e6ee] hover:border-[#002fa7]/50"
              }`}
            >
              <div className="w-12 h-12 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#0b1020] text-center">Opportunity</h3>
            </button>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#e3e6ee] rounded-2xl p-8">
          <h2 className="text-[24px] font-playfair font-black text-[#0b1020] mb-6">
            {formData.submissionType === "story" && "Share Your Story"}
            {formData.submissionType === "job" && "Post a Job Offer"}
            {formData.submissionType === "opportunity" && "Share an Opportunity"}
          </h2>

          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-[16px] font-bold text-[#0b1020] mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                placeholder="+237 XXX XXX XXX"
              />
            </div>
          </div>

          {/* Submission Details */}
          <div className="mb-6">
            <h3 className="text-[16px] font-bold text-[#0b1020] mb-4">
              {formData.submissionType === "story" && "Story Details"}
              {formData.submissionType === "job" && "Job Details"}
              {formData.submissionType === "opportunity" && "Opportunity Details"}
            </h3>
            
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                placeholder={
                  formData.submissionType === "story" ? "Enter story headline" :
                  formData.submissionType === "job" ? "Enter job title" :
                  "Enter opportunity title"
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
              >
                <option value="">Select a category</option>
                {formData.submissionType === "story" && (
                  <>
                    <option value="Latest">Latest News</option>
                    <option value="International">International</option>
                    <option value="Business">Business</option>
                    <option value="Politics">Politics</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Regional">Regional News</option>
                  </>
                )}
                {formData.submissionType === "job" && (
                  <>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </>
                )}
                {formData.submissionType === "opportunity" && (
                  <>
                    <option value="Jobs">Jobs</option>
                    <option value="Internships">Internships</option>
                    <option value="Fellowships">Fellowships</option>
                    <option value="Volunteering">Volunteering</option>
                    <option value="Grants">Grants</option>
                  </>
                )}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7] resize-none"
                placeholder={
                  formData.submissionType === "story" ? "Tell us your story in detail..." :
                  formData.submissionType === "job" ? "Describe the job role, requirements, and responsibilities..." :
                  "Describe the opportunity in detail..."
                }
              />
            </div>

            {(formData.submissionType === "job" || formData.submissionType === "opportunity") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                  />
                </div>
              </div>
            )}

            {formData.submissionType === "job" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                    placeholder="Company or organization name"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
                    placeholder="e.g., 500,000 - 800,000 XAF"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-semibold text-[#2c3348] mb-2">Upload Image</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 border border-[#e3e6ee] rounded text-[14px] focus:outline-none focus:border-[#002fa7]"
              />
              <p className="text-[12px] text-[#8b91a5] mt-1">Optional: Add a relevant image (Max 5MB)</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-8 py-4 text-white text-[14px] font-semibold rounded transition-colors ${
              isSubmitting 
                ? "bg-[#8b91a5] cursor-not-allowed" 
                : "bg-[#002fa7] hover:bg-[#0026c4]"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </button>

          <p className="text-[12px] text-[#8b91a5] text-center mt-4">
            Your submission will be reviewed by our team before publishing. We'll contact you via email if we need additional information.
          </p>
        </form>
      </div>
    </div>
  );
}
