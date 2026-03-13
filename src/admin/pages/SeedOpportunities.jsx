// Temporary Seed Component
// Add this to your admin opportunities page temporarily to seed data

import { useState } from "react";
import { create, COLLECTIONS } from "../../services/firebase/firestore";

const opportunities = [
  {
    title: "Software Engineer - Full Stack",
    category: "Jobs",
    company: "Tech Solutions Africa",
    location: "Douala, Cameroon",
    deadline: "2024-03-30",
    salary: "500,000 - 800,000 FCFA",
    description: "Join our dynamic team to build innovative web applications using React, Node.js, and modern technologies. We're looking for passionate developers with 3+ years of experience in full-stack development. This is an exciting opportunity to work on cutting-edge projects that impact millions of users across Africa.",
    responsibilities: "• Develop and maintain web applications using React and Node.js\n• Collaborate with cross-functional teams to define and ship new features\n• Write clean, maintainable, and well-documented code\n• Participate in code reviews and provide constructive feedback\n• Troubleshoot and debug applications\n• Optimize applications for maximum speed and scalability\n• Stay up-to-date with emerging technologies and industry trends",
    requirements: "• 3+ years of experience in full-stack development\n• Strong knowledge of React, Node.js, and JavaScript/TypeScript\n• Experience with databases (MongoDB, PostgreSQL)\n• Familiarity with RESTful APIs and microservices architecture\n• Excellent problem-solving and analytical skills\n• Bachelor's degree in Computer Science or related field\n• Good communication skills in English or French\n• Experience with Git and version control",
    benefits: "• Competitive salary (500,000 - 800,000 FCFA)\n• Health insurance coverage\n• Professional development and training opportunities\n• Flexible working hours\n• Modern office space with latest equipment\n• Annual performance bonuses\n• Paid vacation and sick leave\n• Team building activities and events",
    applicationLink: "https://forms.gle/example1",
    imageUrl: "",
    status: "active",
    expiryDate: null
  },
  {
    title: "Marketing Intern",
    category: "Internships",
    company: "Digital Marketing Hub",
    location: "Yaoundé, Cameroon",
    deadline: "2024-04-05",
    salary: "150,000 FCFA/month",
    description: "6-month paid internship opportunity to learn digital marketing strategies, social media management, and campaign analytics. Perfect for recent graduates or students looking to gain practical experience in a fast-growing digital marketing agency.",
    responsibilities: "• Assist in creating and managing social media content\n• Support email marketing campaigns\n• Conduct market research and competitor analysis\n• Help with content creation and copywriting\n• Monitor and report on campaign performance\n• Assist in SEO and SEM activities\n• Participate in brainstorming sessions for marketing strategies",
    requirements: "• Currently pursuing or recently completed a degree in Marketing, Communications, or related field\n• Strong written and verbal communication skills\n• Creative mindset and attention to detail\n• Basic knowledge of social media platforms (Facebook, Instagram, Twitter, LinkedIn)\n• Proficiency in Microsoft Office or Google Workspace\n• Ability to work in a team environment\n• Eagerness to learn and take initiative",
    benefits: "• Monthly stipend of 150,000 FCFA\n• Hands-on experience in digital marketing\n• Mentorship from experienced marketers\n• Certificate of completion\n• Potential for full-time employment after internship\n• Networking opportunities\n• Access to marketing tools and software\n• Flexible schedule for students",
    applicationLink: "https://forms.gle/example2",
    imageUrl: "",
    status: "active",
    expiryDate: null
  },
  {
    title: "African Leadership Fellowship Program",
    category: "Fellowships",
    company: "Leadership Institute",
    location: "Pan-African (Remote)",
    deadline: "2024-04-15",
    salary: "Fully Funded",
    description: "12-month leadership development program for emerging African leaders. This prestigious fellowship includes mentorship, networking opportunities, and a $5,000 project grant. Open to professionals with 2+ years of experience in any field who are committed to making a positive impact in their communities.",
    responsibilities: "• Participate in monthly leadership workshops and training sessions\n• Develop and implement a community impact project\n• Engage with fellow fellows and mentors regularly\n• Attend quarterly in-person meetups (expenses covered)\n• Share learnings and insights with the cohort\n• Complete program assignments and reflections\n• Contribute to the fellowship community",
    requirements: "• African citizen aged 25-35\n• 2+ years of professional experience in any field\n• Demonstrated leadership potential and commitment to social impact\n• Fluent in English or French\n• Available for full-time participation (remote)\n• Strong application essay showcasing vision and goals\n• Two professional references\n• Access to reliable internet connection",
    benefits: "• Monthly stipend of $500 for 12 months\n• $5,000 project implementation grant\n• Access to global network of leaders and alumni\n• Personalized mentorship from industry experts\n• Leadership training and workshops\n• Certificate upon successful completion\n• Travel expenses for quarterly meetups\n• Lifetime access to fellowship resources and community",
    applicationLink: "https://forms.gle/example3",
    imageUrl: "",
    status: "active",
    expiryDate: null
  },
  {
    title: "Data Analyst",
    category: "Jobs",
    company: "Analytics Pro Cameroon",
    location: "Remote",
    deadline: "2024-04-20",
    salary: "400,000 - 600,000 FCFA",
    description: "Analyze business data and create insights using Python, SQL, and visualization tools. Work remotely with a dynamic team serving clients across Africa. This role offers the opportunity to work on diverse projects and make data-driven decisions that impact business growth.",
    responsibilities: "• Collect, process, and analyze large datasets\n• Create dashboards and reports using Tableau or Power BI\n• Identify trends, patterns, and insights in data\n• Present findings and recommendations to stakeholders\n• Collaborate with business teams to understand data needs\n• Develop and maintain data pipelines\n• Ensure data quality and accuracy\n• Document analysis processes and methodologies",
    requirements: "• 2+ years of experience in data analysis\n• Proficiency in Python and SQL\n• Experience with Tableau or Power BI\n• Strong analytical and problem-solving skills\n• Bachelor's degree in Statistics, Computer Science, Mathematics, or related field\n• Excellent communication and presentation skills\n• Self-motivated and able to work independently\n• Experience with Excel and statistical analysis",
    benefits: "• Competitive salary (400,000 - 600,000 FCFA)\n• 100% remote work\n• Flexible working hours\n• Professional development budget\n• Access to online courses and certifications\n• Health insurance\n• Annual performance bonuses\n• Collaborative and supportive team culture\n• Opportunity to work on diverse projects",
    applicationLink: "https://forms.gle/example4",
    imageUrl: "",
    status: "active",
    expiryDate: null
  },
  {
    title: "Small Business Development Grant",
    category: "Grants",
    company: "Entrepreneurship Fund Cameroon",
    location: "Cameroon",
    deadline: "2024-05-01",
    salary: "Up to 5,000,000 FCFA",
    description: "Funding opportunity for innovative small business ideas in technology, agriculture, and creative industries. This grant program supports entrepreneurs who demonstrate potential for job creation and community impact. Successful applicants will receive funding, mentorship, and access to business resources.",
    responsibilities: "• Develop and execute detailed business plan\n• Create jobs and contribute to community development\n• Attend monthly mentorship sessions\n• Submit quarterly progress reports\n• Participate in entrepreneurship workshops\n• Network with other grant recipients\n• Maintain financial records and accountability\n• Complete 6-month incubation program",
    requirements: "• Cameroonian citizen or permanent resident\n• Business idea in technology, agriculture, or creative industries\n• Detailed business plan with financial projections\n• Potential to create minimum 3 jobs within 12 months\n• Demonstrated commitment to community impact\n• Age 21-45\n• Executive summary and pitch deck\n• Team information (if applicable)\n• Impact statement and sustainability plan",
    benefits: "• Grant funding up to 5,000,000 FCFA\n• Business mentorship and coaching\n• Access to co-working spaces\n• Networking with investors and entrepreneurs\n• 6-month incubation program\n• Legal and accounting support\n• Marketing and branding assistance\n• Access to business resources and tools\n• Potential for follow-on funding",
    applicationLink: "https://forms.gle/example5",
    imageUrl: "",
    status: "active",
    expiryDate: null
  }
];

export default function SeedOpportunities() {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    setSeeding(true);
    setMessage("Seeding opportunities...");
    
    try {
      let successCount = 0;
      
      for (const opp of opportunities) {
        await create(COLLECTIONS.OPPORTUNITIES, opp);
        successCount++;
        setMessage(`Seeded ${successCount} of ${opportunities.length}...`);
      }
      
      setMessage(`✅ Successfully seeded ${successCount} opportunities! Refresh the page.`);
    } catch (error) {
      console.error("Seeding error:", error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-[#002fa7] rounded-lg p-4 shadow-lg z-50">
      <h3 className="text-[14px] font-bold text-[#0b1020] mb-2">Seed Database</h3>
      <p className="text-[12px] text-[#5a6073] mb-3">Add 5 sample opportunities</p>
      <button
        onClick={handleSeed}
        disabled={seeding}
        className="w-full px-4 py-2 bg-[#002fa7] text-white text-[13px] font-semibold rounded hover:bg-[#0026c4] transition-colors disabled:opacity-50"
      >
        {seeding ? "Seeding..." : "Seed Now"}
      </button>
      {message && (
        <p className="text-[11px] text-[#5a6073] mt-2">{message}</p>
      )}
    </div>
  );
}

// INSTRUCTIONS:
// 1. Import this component in AdminOpportunities.jsx:
//    import SeedOpportunities from './SeedOpportunities';
//
// 2. Add it to the JSX (at the bottom, before closing div):
//    <SeedOpportunities />
//
// 3. Click "Seed Now" button
// 4. Wait for success message
// 5. Refresh the page
// 6. Remove the component after seeding
