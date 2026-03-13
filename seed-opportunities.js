// Seed script for opportunities
// Run this in browser console on admin page

const opportunities = [
  {
    title: "Software Engineer - Full Stack",
    category: "Jobs",
    company: "Tech Solutions Africa",
    location: "Douala, Cameroon",
    deadline: "March 30, 2024",
    salary: "500,000 - 800,000 FCFA",
    description: "Join our dynamic team to build innovative web applications using React, Node.js, and modern technologies. We're looking for passionate developers with 3+ years of experience in full-stack development.",
    applicationLink: "https://techsolutions.com/careers/apply",
    status: "active",
    expiryDate: null
  },
  {
    title: "Marketing Intern",
    category: "Internships",
    company: "Digital Marketing Hub",
    location: "Yaoundé, Cameroon",
    deadline: "April 5, 2024",
    salary: "150,000 FCFA/month",
    description: "6-month paid internship opportunity to learn digital marketing strategies, social media management, and campaign analytics. Perfect for recent graduates or students looking to gain practical experience.",
    applicationLink: "https://digitalmarketinghub.cm/internship",
    status: "active",
    expiryDate: null
  },
  {
    title: "African Leadership Fellowship Program",
    category: "Fellowships",
    company: "Leadership Institute",
    location: "Pan-African (Remote)",
    deadline: "April 15, 2024",
    salary: "Fully Funded",
    description: "12-month leadership development program for emerging African leaders. Includes mentorship, networking opportunities, and a $5,000 project grant. Open to professionals with 2+ years of experience in any field.",
    applicationLink: "https://leadershipinstitute.org/fellowship/apply",
    status: "active",
    expiryDate: null
  },
  {
    title: "Small Business Development Grant",
    category: "Grants",
    company: "Entrepreneurship Fund Cameroon",
    location: "Cameroon",
    deadline: "May 1, 2024",
    salary: "Up to 5,000,000 FCFA",
    description: "Funding opportunity for innovative small business ideas in technology, agriculture, and creative industries. Applicants must submit a detailed business plan and demonstrate potential for job creation and community impact.",
    applicationLink: "https://entrepreneurshipfund.cm/grants/apply",
    status: "active",
    expiryDate: null
  }
];

// Instructions:
// 1. Open your browser console (F12)
// 2. Navigate to admin opportunities page
// 3. Copy and paste this entire script
// 4. The opportunities will be added to Firestore

console.log('Seeding opportunities...');
console.log('Make sure you are logged in as admin and Firebase is configured!');
console.log('\nTo seed, run: seedOpportunities()');

async function seedOpportunities() {
  try {
    const { create, COLLECTIONS } = await import('./src/services/firebase/firestore.js');
    
    for (const opp of opportunities) {
      const id = await create(COLLECTIONS.OPPORTUNITIES, opp);
      console.log(`✓ Created: ${opp.title} (ID: ${id})`);
    }
    
    console.log('\n✓ All opportunities seeded successfully!');
    console.log('Refresh the page to see the new opportunities.');
  } catch (error) {
    console.error('Error seeding opportunities:', error);
  }
}
