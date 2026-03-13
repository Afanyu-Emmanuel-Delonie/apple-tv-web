import { useState } from "react";
import { create, COLLECTIONS } from "../../services/firebase/firestore";
import Toast from "../components/Toast";

export default function SeedArticles() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const sampleArticles = [
    {
      title: "Cameroon Launches New Digital Innovation Hub in Douala",
      category: "Technology",
      excerpt: "The government inaugurates a state-of-the-art technology center aimed at fostering startup growth and digital entrepreneurship across the nation.",
      content: "Cameroon has taken a significant step towards digital transformation with the official launch of the Digital Innovation Hub in Douala. This initiative, backed by both government and private sector partners, aims to provide resources, mentorship, and funding opportunities for tech entrepreneurs.\n\nThe hub features modern office spaces, high-speed internet connectivity, and access to industry experts. It is expected to host over 100 startups within the first year of operation.\n\nGovernment officials emphasized the importance of this development in creating jobs and attracting foreign investment to the technology sector.",
      author: "John Mbah",
      isSensitive: false,
      status: "active"
    },
    {
      title: "Regional Health Initiative Reaches 50,000 Beneficiaries",
      category: "Health",
      excerpt: "A comprehensive health outreach program across the 10 regions of Cameroon has successfully provided medical services to over 50,000 citizens.",
      content: "The Ministry of Health announced the successful completion of Phase 1 of its regional health initiative, which aimed to bring quality healthcare services to underserved communities.\n\nThe program included free medical consultations, vaccinations, and health education workshops. Mobile clinics were deployed to remote areas, ensuring accessibility for all citizens.\n\nPhase 2 of the initiative will focus on establishing permanent health centers in priority regions and training local healthcare workers.",
      author: "Dr. Marie Nkomo",
      isSensitive: false,
      status: "active"
    },
    {
      title: "International Business Forum Attracts Global Investors",
      category: "Business",
      excerpt: "Cameroon hosts a major international business forum, attracting investors and entrepreneurs from over 30 countries to explore investment opportunities.",
      content: "The annual International Business Forum held in Yaoundé brought together business leaders, government officials, and investors to discuss economic opportunities in Cameroon.\n\nKey sectors highlighted included agriculture, energy, telecommunications, and manufacturing. Several bilateral agreements were signed, promising significant foreign direct investment.\n\nExperts predict these investments will create thousands of jobs and boost the country's GDP growth in the coming years.",
      author: "Samuel Tonga",
      isSensitive: false,
      status: "active"
    },
    {
      title: "Political Developments Shape National Agenda",
      category: "Politics",
      excerpt: "Recent political developments have set the stage for important policy reforms aimed at improving governance and public service delivery.",
      content: "Parliament has passed several key legislative measures aimed at strengthening democratic institutions and improving transparency in government operations.\n\nThe reforms include new regulations on public procurement, enhanced oversight mechanisms, and measures to combat corruption.\n\nCivil society organizations have praised these developments as a step in the right direction, though they call for continued vigilance in implementation.",
      author: "Amara Diallo",
      isSensitive: false,
      status: "active"
    },
    {
      title: "Entertainment Industry Celebrates Local Talent at Awards Ceremony",
      category: "Entertainment",
      excerpt: "Cameroon's vibrant entertainment industry came together to celebrate outstanding achievements in music, film, and performing arts.",
      content: "The annual Entertainment Excellence Awards recognized outstanding contributions to Cameroon's cultural landscape. Winners included renowned musicians, filmmakers, and performers who have brought international recognition to the country.\n\nThe ceremony featured live performances and highlighted the diversity of Cameroon's entertainment scene, from traditional music to contemporary genres.\n\nIndustry leaders called for increased investment in the creative sector to support emerging talent and boost the economy.",
      author: "Vivian Ekane",
      isSensitive: false,
      status: "active"
    }
  ];

  const handleSeed = async () => {
    try {
      setLoading(true);
      let successCount = 0;

      for (const article of sampleArticles) {
        try {
          await create(COLLECTIONS.ARTICLES, article);
          successCount++;
        } catch (error) {
          console.error('Error seeding article:', error);
        }
      }

      setToast({
        message: `Successfully seeded ${successCount} articles!`,
        type: "success"
      });
    } catch (error) {
      console.error('Error seeding articles:', error);
      setToast({
        message: "Failed to seed articles",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-6 py-3 rounded-lg text-white font-semibold text-[14px] ${
            toast.type === "success" ? "bg-[#047857]" : "bg-[#dc2626]"
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      <button
        onClick={handleSeed}
        disabled={loading}
        className="fixed bottom-6 right-6 px-6 py-3 bg-[#047857] text-white text-[14px] font-semibold rounded-lg hover:bg-[#065f46] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? "Seeding..." : "Seed Articles"}
      </button>
    </>
  );
}
