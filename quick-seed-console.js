// 🚀 Quick Production Data Seeder
// Copy and paste this into your browser console on https://apple-fam-tv.web.app/admin/dashboard

// Sample Articles
const sampleArticles = [
  {
    title: "Welcome to Apple Fam TV",
    content: "Apple Fam TV is your premier destination for news, events, and opportunities in Cameroon and beyond. We are committed to keeping our community informed and connected through reliable, timely, and engaging content. Our platform serves as a bridge between communities, bringing you the latest updates from all 10 regions of Cameroon, international news that matters, business insights, and opportunities that can transform lives. Join our growing community and be part of the conversation that shapes our future.",
    excerpt: "Discover Apple Fam TV - your trusted source for news, events, and opportunities in Cameroon.",
    category: "Latest",
    author: "Apple Fam TV Team",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop",
    status: "active"
  },
  {
    title: "Cameroon's Digital Transformation Accelerates in 2026",
    content: "Cameroon is experiencing unprecedented growth in its digital economy, with government initiatives driving innovation across multiple sectors. The new Digital Cameroon 2026 strategy has already attracted significant foreign investment and created thousands of jobs in the technology sector. From fintech startups in Douala to agritech solutions in rural areas, entrepreneurs are leveraging technology to solve local challenges while competing on the global stage. This digital revolution is not just changing how business is done, but also improving access to education, healthcare, and financial services for millions of Cameroonians.",
    excerpt: "Exploring Cameroon's digital economy boom and the opportunities it creates for businesses and entrepreneurs.",
    category: "Business",
    author: "Business Desk",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop",
    status: "active"
  },
  {
    title: "Infrastructure Development Transforms Regional Connectivity",
    content: "Major infrastructure projects are revolutionizing connectivity across Cameroon's 10 regions. The new highway connecting Yaoundé to Douala has reduced travel time by 40%, while rural electrification projects have brought power to over 200 communities this year. These developments are not just about physical infrastructure - digital connectivity initiatives have expanded 4G coverage to 85% of the country, enabling remote work, online education, and digital commerce in previously underserved areas. The ripple effects are visible in improved healthcare delivery, better educational outcomes, and increased economic opportunities for rural communities.",
    excerpt: "How infrastructure investments are connecting communities and creating opportunities across all regions.",
    category: "Regional",
    author: "Regional Correspondent",
    imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=400&fit=crop",
    status: "active"
  },
  {
    title: "International Partnerships Boost Cameroon's Global Standing",
    content: "Cameroon's strategic partnerships with international organizations are yielding significant benefits for the country's development agenda. Recent agreements with the European Union, African Development Bank, and World Bank have secured over $2 billion in funding for sustainable development projects. These partnerships focus on climate resilience, renewable energy, and human capital development. The country's active participation in regional bodies like CEMAC and the African Union has also strengthened its position as a key player in Central African politics and economics.",
    excerpt: "Cameroon strengthens international ties through strategic partnerships and multilateral cooperation.",
    category: "International",
    author: "International Desk",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop",
    status: "active"
  }
];

// Sample Events
const sampleEvents = [
  {
    title: "Cameroon Tech Summit 2026",
    description: "Join us for the largest technology conference in Central Africa! The Cameroon Tech Summit brings together innovators, entrepreneurs, investors, and tech enthusiasts for three days of learning, networking, and collaboration. Featured speakers include leading CEOs from across Africa, government officials, and international tech leaders. Topics include AI, blockchain, fintech, agritech, and sustainable technology solutions. Don't miss startup pitch competitions, investor meetups, and hands-on workshops.",
    date: new Date('2026-04-15'),
    location: "Palais des Congrès, Yaoundé",
    price: "Free (Registration Required)",
    registrationUrl: "https://example.com/tech-summit",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    status: "active"
  },
  {
    title: "Young Entrepreneurs Bootcamp",
    description: "A comprehensive 3-day intensive program designed for aspiring entrepreneurs aged 18-35. Learn essential business skills including business model development, financial planning, marketing strategies, and fundraising. The program includes mentorship sessions with successful entrepreneurs, pitch practice, and networking opportunities. Participants will develop a complete business plan and have the chance to win seed funding of up to 500,000 XAF.",
    date: new Date('2026-03-28'),
    location: "Douala Business Incubator",
    price: "25,000 XAF (Includes materials and meals)",
    registrationUrl: "https://example.com/entrepreneur-bootcamp",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    status: "active"
  },
  {
    title: "Women in Leadership Conference",
    description: "Celebrating and empowering women leaders across Cameroon. This conference brings together successful women from various sectors including business, politics, academia, and civil society. Attendees will participate in panel discussions, leadership workshops, and networking sessions. Special focus on work-life balance, breaking glass ceilings, and creating opportunities for the next generation of women leaders.",
    date: new Date('2026-05-08'),
    location: "Hilton Hotel, Douala",
    price: "15,000 XAF",
    registrationUrl: "https://example.com/women-leadership",
    imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop",
    status: "active"
  }
];

// Sample Opportunities
const sampleOpportunities = [
  {
    title: "Senior Software Engineer - Full Stack",
    description: "We are seeking an experienced Full Stack Developer to join our innovative fintech startup. You'll work with cutting-edge technologies including React, Node.js, Python, and AWS cloud services. The role involves building scalable financial applications, implementing security best practices, and mentoring junior developers. We offer competitive salary, equity options, flexible working arrangements, and opportunities for professional growth in a fast-paced startup environment.",
    type: "job",
    company: "FinTech Cameroon",
    location: "Douala, Cameroon (Hybrid)",
    salary: "1,200,000 - 1,800,000 XAF",
    deadline: new Date('2026-04-30'),
    applicationUrl: "https://example.com/fintech-engineer",
    status: "active"
  },
  {
    title: "African Development Bank Graduate Program",
    description: "Join the prestigious ADB Graduate Development Program and kickstart your career in international development. This 18-month program offers rotations across different departments, comprehensive training, and mentorship from senior professionals. Graduates work on impactful projects across Africa in areas such as infrastructure development, private sector growth, and governance. The program includes competitive compensation, international exposure, and excellent career progression opportunities.",
    type: "internship",
    company: "African Development Bank",
    location: "Abidjan, Côte d'Ivoire",
    salary: "Competitive stipend + benefits",
    deadline: new Date('2026-05-15'),
    applicationUrl: "https://example.com/adb-graduate",
    status: "active"
  },
  {
    title: "Innovation Grant for Climate Solutions",
    description: "Apply for grants up to 5,000,000 XAF to develop innovative solutions addressing climate change challenges in Cameroon. Priority areas include renewable energy, sustainable agriculture, waste management, and climate adaptation technologies. The program provides not just funding but also technical support, mentorship, and market access opportunities. Successful applicants join a network of climate innovators and have access to follow-up funding for scaling their solutions.",
    type: "grant",
    company: "Green Innovation Fund",
    location: "Cameroon",
    salary: "Up to 5,000,000 XAF",
    deadline: new Date('2026-06-01'),
    applicationUrl: "https://example.com/climate-grant",
    status: "active"
  },
  {
    title: "Digital Marketing Specialist",
    description: "Join our growing marketing team to drive digital transformation for local businesses. You'll develop and execute comprehensive digital marketing strategies, manage social media campaigns, create engaging content, and analyze performance metrics. The ideal candidate has experience with Google Ads, Facebook Marketing, content creation, and analytics tools. We offer professional development opportunities, creative freedom, and the chance to work with diverse clients across various industries.",
    type: "job",
    company: "Digital Solutions Agency",
    location: "Yaoundé, Cameroon",
    salary: "800,000 - 1,200,000 XAF",
    deadline: new Date('2026-04-15'),
    applicationUrl: "https://example.com/marketing-specialist",
    status: "active"
  }
];

// Function to add data to Firestore
async function seedProductionData() {
  console.log('🌱 Starting production data seeding...');
  
  try {
    // Import Firebase functions (assuming they're available globally)
    const { create, COLLECTIONS } = window;
    
    if (!create || !COLLECTIONS) {
      console.error('❌ Firebase functions not available. Make sure you\'re on the admin dashboard.');
      return;
    }
    
    // Add articles
    console.log('📰 Adding sample articles...');
    for (const article of sampleArticles) {
      await create(COLLECTIONS.ARTICLES, {
        ...article,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      });
    }
    console.log(`✅ Added ${sampleArticles.length} articles`);
    
    // Add events
    console.log('📅 Adding sample events...');
    for (const event of sampleEvents) {
      await create(COLLECTIONS.EVENTS, {
        ...event,
        createdAt: new Date(),
        createdBy: 'system'
      });
    }
    console.log(`✅ Added ${sampleEvents.length} events`);
    
    // Add opportunities
    console.log('💼 Adding sample opportunities...');
    for (const opportunity of sampleOpportunities) {
      await create(COLLECTIONS.OPPORTUNITIES, {
        ...opportunity,
        createdAt: new Date(),
        createdBy: 'system'
      });
    }
    console.log(`✅ Added ${sampleOpportunities.length} opportunities`);
    
    console.log('🎉 Production data seeding complete!');
    console.log('📊 Summary:');
    console.log(`   Articles: ${sampleArticles.length}`);
    console.log(`   Events: ${sampleEvents.length}`);
    console.log(`   Opportunities: ${sampleOpportunities.length}`);
    console.log('');
    console.log('🔄 Refresh the page to see the new content!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seeding
seedProductionData();