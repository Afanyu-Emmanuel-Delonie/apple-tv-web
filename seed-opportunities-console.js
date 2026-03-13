// Run this script in browser console while logged in as admin
// Navigate to: http://localhost:5173/admin/opportunities
// Open console (F12) and paste this entire script

const opportunities = [
  {
    title: "Software Engineer - Full Stack",
    category: "Jobs",
    company: "Tech Solutions Africa",
    location: "Douala, Cameroon",
    deadline: "March 30, 2024",
    salary: "500,000 - 800,000 FCFA",
    description: "Join our dynamic team to build innovative web applications using React, Node.js, and modern technologies. We're looking for passionate developers with 3+ years of experience in full-stack development.\n\nResponsibilities:\n• Develop and maintain web applications\n• Collaborate with cross-functional teams\n• Write clean, maintainable code\n• Participate in code reviews\n\nRequirements:\n• 3+ years of experience in full-stack development\n• Strong knowledge of React and Node.js\n• Experience with databases (MongoDB, PostgreSQL)\n• Excellent problem-solving skills",
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
    deadline: "April 5, 2024",
    salary: "150,000 FCFA/month",
    description: "6-month paid internship opportunity to learn digital marketing strategies, social media management, and campaign analytics. Perfect for recent graduates or students looking to gain practical experience.\n\nWhat You'll Learn:\n• Social media marketing and management\n• Content creation and copywriting\n• Email marketing campaigns\n• Analytics and reporting\n• SEO and SEM basics\n\nRequirements:\n• Currently pursuing or recently completed a degree in Marketing, Communications, or related field\n• Strong written and verbal communication skills\n• Creative mindset and attention to detail\n• Basic knowledge of social media platforms",
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
    deadline: "April 15, 2024",
    salary: "Fully Funded",
    description: "12-month leadership development program for emerging African leaders. Includes mentorship, networking opportunities, and a $5,000 project grant. Open to professionals with 2+ years of experience in any field.\n\nProgram Benefits:\n• Monthly stipend of $500\n• $5,000 project implementation grant\n• Access to global network of leaders\n• Personalized mentorship\n• Leadership training workshops\n• Certificate upon completion\n\nEligibility:\n• African citizen aged 25-35\n• 2+ years of professional experience\n• Demonstrated leadership potential\n• Commitment to social impact\n• Fluent in English or French",
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
    deadline: "April 20, 2024",
    salary: "400,000 - 600,000 FCFA",
    description: "Analyze business data and create insights using Python, SQL, and visualization tools. Work remotely with a dynamic team serving clients across Africa.\n\nKey Responsibilities:\n• Collect, process, and analyze large datasets\n• Create dashboards and reports using Tableau/Power BI\n• Identify trends and patterns in data\n• Present findings to stakeholders\n• Collaborate with business teams\n\nRequirements:\n• 2+ years of experience in data analysis\n• Proficiency in Python and SQL\n• Experience with Tableau or Power BI\n• Strong analytical and problem-solving skills\n• Bachelor's degree in Statistics, Computer Science, or related field",
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
    deadline: "May 1, 2024",
    salary: "Up to 5,000,000 FCFA",
    description: "Funding opportunity for innovative small business ideas in technology, agriculture, and creative industries. Applicants must submit a detailed business plan and demonstrate potential for job creation and community impact.\n\nGrant Details:\n• Up to 5,000,000 FCFA in funding\n• Business mentorship and support\n• Access to co-working spaces\n• Networking opportunities\n• 6-month incubation program\n\nEligibility Criteria:\n• Cameroonian citizen or resident\n• Business idea in tech, agriculture, or creative industries\n• Detailed business plan required\n• Potential for job creation (minimum 3 jobs)\n• Commitment to community impact\n• Age 21-45\n\nApplication Requirements:\n• Executive summary\n• Detailed business plan\n• Financial projections\n• Team information\n• Impact statement",
    applicationLink: "https://forms.gle/example5",
    imageUrl: "",
    status: "active",
    expiryDate: null
  }
];

console.log('🌱 Opportunity Seeder Ready!');
console.log('📝 5 opportunities prepared for seeding');
console.log('');
console.log('To seed the database, run: seedOpportunities()');
console.log('');

async function seedOpportunities() {
  console.log('🚀 Starting seed process...\n');
  
  try {
    // Import Firebase functions
    const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    // Get Firestore instance from your app
    const db = getFirestore();
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const opp of opportunities) {
      try {
        const docRef = await addDoc(collection(db, 'opportunities'), {
          ...opp,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`✅ Created: ${opp.title}`);
        console.log(`   ID: ${docRef.id}`);
        console.log(`   Category: ${opp.category}`);
        console.log('');
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to create: ${opp.title}`);
        console.error(`   Error: ${error.message}`);
        console.log('');
        errorCount++;
      }
    }
    
    console.log('═══════════════════════════════════════');
    console.log(`✅ Successfully seeded: ${successCount} opportunities`);
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} opportunities`);
    }
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('🔄 Refresh the page to see the new opportunities!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    console.log('');
    console.log('💡 Make sure you are:');
    console.log('   1. Logged in as admin');
    console.log('   2. On the admin opportunities page');
    console.log('   3. Firebase is properly configured');
  }
}

// Alternative method: Use the app's existing Firebase instance
async function seedOpportunitiesAlt() {
  console.log('🚀 Starting seed process (Alternative method)...\n');
  
  try {
    // This assumes your app exposes Firebase functions globally
    // Adjust based on your actual implementation
    
    const response = await fetch('/api/seed-opportunities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ opportunities })
    });
    
    if (response.ok) {
      console.log('✅ All opportunities seeded successfully!');
      console.log('🔄 Refresh the page to see the new opportunities!');
    } else {
      console.error('❌ Seeding failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('');
    console.log('💡 Try the main seedOpportunities() function instead');
  }
}

console.log('📚 Available commands:');
console.log('   seedOpportunities()     - Seed using Firebase directly');
console.log('   opportunities           - View the data that will be seeded');
