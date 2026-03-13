import { useState } from "react";
import { create, COLLECTIONS } from "../../services/firebase/firestore";

const events = [
  {
    title: "Tech Summit Cameroon 2024",
    category: "Conference",
    date: "2024-04-15",
    location: "Hilton Hotel, Yaoundé",
    price: "25,000 FCFA",
    description: "Join us for the biggest tech conference in Central Africa! Connect with industry leaders, learn about emerging technologies, and network with fellow tech enthusiasts.\n\nHighlights:\n• Keynote speeches from tech CEOs\n• Panel discussions on AI and blockchain\n• Startup pitch competition\n• Networking sessions\n• Exhibition hall with 50+ companies\n\nDon't miss this opportunity to be part of Cameroon's tech revolution!",
    registrationLink: "https://forms.gle/techsummit2024",
    imageUrl: "",
    status: "active",
    expiryDate: null
  },
  {
    title: "Digital Marketing Workshop",
    category: "Workshop",
    date: "2024-03-28",
    location: "Innovation Hub, Douala",
    price: "15,000 FCFA",
    description: "Hands-on workshop covering the latest digital marketing strategies and tools. Perfect for entrepreneurs, marketers, and business owners looking to grow their online presence.\n\nWhat You'll Learn:\n• Social media marketing strategies\n• Content creation and copywriting\n• Email marketing campaigns\n• SEO and Google Ads basics\n• Analytics and ROI tracking\n\nLimited to 30 participants. Register early!",
    registrationLink: "https://forms.gle/digitalmarketing2024",
    imageUrl: "",
    status: "active",
    expiryDate: null
  },
  {
    title: "Startup Networking Mixer",
    category: "Networking",
    date: "2024-04-05",
    location: "The Lounge, Buea",
    price: "Free",
    description: "Monthly networking event for entrepreneurs, investors, and startup enthusiasts. Connect with like-minded individuals, share ideas, and build valuable relationships.\n\nWho Should Attend:\n• Startup founders and co-founders\n• Angel investors and VCs\n• Tech professionals\n• Business consultants\n• Anyone interested in entrepreneurship\n\nCasual atmosphere with drinks and snacks provided. Come ready to network!",
    registrationLink: "https://forms.gle/startupnetworking2024",
    imageUrl: "",
    status: "active",
    expiryDate: null
  },
  {
    title: "Career Fair 2024",
    category: "Career Fair",
    date: "2024-04-20",
    location: "University of Buea Campus",
    price: "Free",
    description: "Annual career fair bringing together top employers and job seekers. Meet recruiters, submit your CV, and explore career opportunities across various industries.\n\nParticipating Companies:\n• Tech companies (software, IT services)\n• Banks and financial institutions\n• NGOs and international organizations\n• Government agencies\n• Startups and SMEs\n\nBring multiple copies of your CV and dress professionally!",
    registrationLink: "https://forms.gle/careerfair2024",
    imageUrl: "",
    status: "active",
    expiryDate: null
  },
  {
    title: "Web Development Bootcamp",
    category: "Webinar",
    date: "2024-04-10",
    location: "Online (Zoom)",
    price: "10,000 FCFA",
    description: "Intensive 3-day online bootcamp covering modern web development. Learn to build responsive websites using HTML, CSS, JavaScript, and React.\n\nSchedule:\n• Day 1: HTML & CSS Fundamentals\n• Day 2: JavaScript & DOM Manipulation\n• Day 3: React Basics & Project Building\n\nIncludes:\n• Live coding sessions\n• Q&A with instructors\n• Hands-on projects\n• Certificate of completion\n• Lifetime access to recordings\n\nPerfect for beginners and those looking to refresh their skills!",
    registrationLink: "https://forms.gle/webdevbootcamp2024",
    imageUrl: "",
    status: "active",
    expiryDate: null
  }
];

export default function SeedEvents() {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    setSeeding(true);
    setMessage("Seeding events...");
    
    try {
      let successCount = 0;
      
      for (const event of events) {
        await create(COLLECTIONS.EVENTS, event);
        successCount++;
        setMessage(`Seeded ${successCount} of ${events.length}...`);
      }
      
      setMessage(`✅ Successfully seeded ${successCount} events! Refresh the page.`);
    } catch (error) {
      console.error("Seeding error:", error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-[#047857] rounded-lg p-4 shadow-lg z-50">
      <h3 className="text-[14px] font-bold text-[#0b1020] mb-2">Seed Events</h3>
      <p className="text-[12px] text-[#5a6073] mb-3">Add 5 sample events</p>
      <button
        onClick={handleSeed}
        disabled={seeding}
        className="w-full px-4 py-2 bg-[#047857] text-white text-[13px] font-semibold rounded hover:bg-[#059669] transition-colors disabled:opacity-50"
      >
        {seeding ? "Seeding..." : "Seed Now"}
      </button>
      {message && (
        <p className="text-[11px] text-[#5a6073] mt-2">{message}</p>
      )}
    </div>
  );
}
