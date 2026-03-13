import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Building2, DollarSign, Clock, ExternalLink, ArrowLeft, Briefcase } from "lucide-react";
import { getById, COLLECTIONS } from "../services/firebase/firestore";
import OpportunitiesCTA from "../components/OpportunitiesCTA";

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const data = await getById(COLLECTIONS.OPPORTUNITIES, id);
      if (data) {
        setOpportunity(data);
      } else {
        setError("Opportunity not found");
      }
    } catch (err) {
      console.error("Error fetching opportunity:", err);
      setError("Failed to load opportunity");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[14px] text-[#5a6073]">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-[#f6f7fb] rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase size={40} className="text-[#8b91a5]" />
          </div>
          <h1 className="text-[24px] font-playfair font-black text-[#0b1020] mb-3">Opportunity Not Found</h1>
          <p className="text-[14px] text-[#5a6073] mb-6">
            The opportunity you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#002fa7] text-white text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      Jobs: "#0066cc",
      Internships: "#047857",
      Fellowships: "#7c3aed",
      Volunteering: "#dc2626",
      Grants: "#ea580c"
    };
    return colors[category] || "#002fa7";
  };

  const categoryColor = getCategoryColor(opportunity.category);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Back Button */}
      <div className="bg-[#f6f7fb] border-b border-[#e3e6ee]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-[#2c3348] hover:text-[#002fa7] transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Opportunities
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#002fa7] to-[#0066cc] py-12 sm:py-16 overflow-hidden">
        {opportunity.imageUrl && (
          <>
            <img src={opportunity.imageUrl} alt={opportunity.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#002fa7]/90 to-[#0066cc]/90" />
          </>
        )}
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className="px-3 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase text-white rounded"
              style={{ backgroundColor: categoryColor }}
            >
              {opportunity.category}
            </span>
            <span
              className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase rounded ${
                opportunity.status === "active"
                  ? "bg-[#047857] text-white"
                  : "bg-[#8b91a5] text-white"
              }`}
            >
              {opportunity.status}
            </span>
          </div>
          <h1 className="text-[clamp(28px,6vw,48px)] font-playfair font-black text-white leading-[1.1] mb-6">
            {opportunity.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Building2 size={18} />
              <span className="text-[13px] sm:text-[14px] font-medium">{opportunity.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span className="text-[13px] sm:text-[14px] font-medium">{opportunity.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white border border-[#e3e6ee] rounded-lg p-6 sm:p-8 mb-6">
              <h2 className="text-[20px] sm:text-[24px] font-playfair font-black text-[#0b1020] mb-4">
                About This Opportunity
              </h2>
              <div className="text-[14px] sm:text-[15px] text-[#2c3348] leading-[1.7] whitespace-pre-line">
                {opportunity.description}
              </div>
            </div>

            {/* Responsibilities */}
            {opportunity.responsibilities && (
              <div className="bg-white border border-[#e3e6ee] rounded-lg p-6 sm:p-8 mb-6">
                <h2 className="text-[20px] sm:text-[24px] font-playfair font-black text-[#0b1020] mb-4">
                  Key Responsibilities
                </h2>
                <div className="text-[14px] sm:text-[15px] text-[#2c3348] leading-[1.7] whitespace-pre-line">
                  {opportunity.responsibilities}
                </div>
              </div>
            )}

            {/* Requirements */}
            {opportunity.requirements && (
              <div className="bg-white border border-[#e3e6ee] rounded-lg p-6 sm:p-8 mb-6">
                <h2 className="text-[20px] sm:text-[24px] font-playfair font-black text-[#0b1020] mb-4">
                  Requirements & Qualifications
                </h2>
                <div className="text-[14px] sm:text-[15px] text-[#2c3348] leading-[1.7] whitespace-pre-line">
                  {opportunity.requirements}
                </div>
              </div>
            )}

            {/* Benefits */}
            {opportunity.benefits && (
              <div className="bg-white border border-[#e3e6ee] rounded-lg p-6 sm:p-8 mb-6">
                <h2 className="text-[20px] sm:text-[24px] font-playfair font-black text-[#0b1020] mb-4">
                  Benefits & Perks
                </h2>
                <div className="text-[14px] sm:text-[15px] text-[#2c3348] leading-[1.7] whitespace-pre-line">
                  {opportunity.benefits}
                </div>
              </div>
            )}

            {/* Application Instructions */}
            <div className="bg-[#f6f7fb] border border-[#e3e6ee] rounded-lg p-6 sm:p-8">
              <h2 className="text-[18px] sm:text-[20px] font-playfair font-black text-[#0b1020] mb-4">
                How to Apply
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#5a6073] mb-6 leading-relaxed">
                Click the button below to visit the application page. Make sure you have all required documents ready before starting your application.
              </p>
              <a
                href={opportunity.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002fa7] text-white text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors"
              >
                Apply Now
                <ExternalLink size={18} />
              </a>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info Card */}
            <div className="bg-white border border-[#e3e6ee] rounded-lg p-6 sticky top-6">
              <h3 className="text-[16px] sm:text-[18px] font-playfair font-black text-[#0b1020] mb-6">
                Quick Information
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#002fa7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-[#002fa7]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#8b91a5] uppercase tracking-wide mb-1">
                      Deadline
                    </div>
                    <div className="text-[14px] font-semibold text-[#0b1020]">
                      {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#002fa7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign size={18} className="text-[#002fa7]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#8b91a5] uppercase tracking-wide mb-1">
                      Compensation
                    </div>
                    <div className="text-[14px] font-semibold text-[#0b1020]">{opportunity.salary}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#002fa7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#002fa7]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#8b91a5] uppercase tracking-wide mb-1">
                      Location
                    </div>
                    <div className="text-[14px] font-semibold text-[#0b1020]">{opportunity.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#002fa7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} className="text-[#002fa7]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#8b91a5] uppercase tracking-wide mb-1">
                      Company
                    </div>
                    <div className="text-[14px] font-semibold text-[#0b1020]">{opportunity.company}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#002fa7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase size={18} className="text-[#002fa7]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#8b91a5] uppercase tracking-wide mb-1">
                      Category
                    </div>
                    <div className="text-[14px] font-semibold text-[#0b1020]">{opportunity.category}</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e3e6ee]">
                <a
                  href={opportunity.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#002fa7] text-white text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors"
                >
                  Apply Now
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <OpportunitiesCTA
        eyebrow="Explore More"
        headline="Discover More "
        highlightText="Opportunities"
        description="Browse through our curated list of jobs, internships, fellowships, and grants to find your perfect match."
        primaryButtonText="View All Opportunities"
        accentColor="#002fa7"
      />
    </div>
  );
}
