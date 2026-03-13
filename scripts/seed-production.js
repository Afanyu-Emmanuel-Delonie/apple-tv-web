import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Production Firebase configuration (uses environment variables)
const prodConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(prodConfig);
const db = getFirestore(app);

// Sample data for production
const sampleData = {
  articles: [
    {
      title: "Welcome to Apple Fam TV",
      content: "Apple Fam TV is your premier destination for news, events, and opportunities in Cameroon and beyond. We are committed to keeping our community informed and connected through reliable, timely, and engaging content.",
      excerpt: "Discover Apple Fam TV - your trusted source for news, events, and opportunities in Cameroon.",
      category: "Latest",
      author: "Apple Fam TV Team",
      imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop",
      status: "active",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: "system"
    },
    {
      title: "Cameroon's Economic Growth in 2026",
      content: "Cameroon continues to show promising economic indicators in 2026, with significant growth in the technology and agriculture sectors. The government's new digital transformation initiatives are creating numerous opportunities for young entrepreneurs and established businesses alike.",
      excerpt: "Exploring Cameroon's economic progress and the opportunities it creates for businesses and entrepreneurs.",
      category: "Business",
      author: "Economic Desk",
      imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop",
      status: "active",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: "system"
    },
    {
      title: "Regional Development Projects Across Cameroon",
      content: "Major infrastructure projects are underway across all 10 regions of Cameroon, focusing on improving connectivity, healthcare, and education. These initiatives aim to reduce regional disparities and promote inclusive growth.",
      excerpt: "Comprehensive overview of development projects transforming communities across Cameroon's regions.",
      category: "Regional",
      author: "Regional Correspondent",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=400&fit=crop",
      status: "active",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: "system"
    }
  ],
  
  events: [
    {
      title: "Digital Innovation Summit 2026",
      description: "Join us for Cameroon's premier technology conference featuring industry leaders, startup showcases, and networking opportunities. Learn about the latest trends in digital transformation and connect with innovators across Africa.",
      date: Timestamp.fromDate(new Date('2026-04-15')),
      location: "Douala Convention Center, Cameroon",
      price: "Free",
      registrationUrl: "https://example.com/register",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      status: "active",
      createdAt: Timestamp.now(),
      createdBy: "system"
    },
    {
      title: "Youth Entrepreneurship Workshop",
      description: "A comprehensive workshop designed for young entrepreneurs looking to start or scale their businesses. Topics include business planning, funding opportunities, and market analysis.",
      date: Timestamp.fromDate(new Date('2026-03-25')),
      location: "Yaoundé Business Hub",
      price: "5,000 XAF",
      registrationUrl: "https://example.com/youth-workshop",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
      status: "active",
      createdAt: Timestamp.now(),
      createdBy: "system"
    }
  ],
  
  opportunities: [
    {
      title: "Software Developer - Full Stack",
      description: "We are seeking a talented Full Stack Developer to join our growing tech team. You will work on exciting projects using modern technologies including React, Node.js, and cloud platforms.",
      type: "job",
      company: "TechCorp Cameroon",
      location: "Douala, Cameroon",
      salary: "800,000 - 1,200,000 XAF",
      deadline: Timestamp.fromDate(new Date('2026-04-30')),
      applicationUrl: "https://example.com/apply-developer",
      status: "active",
      createdAt: Timestamp.now(),
      createdBy: "system"
    },
    {
      title: "African Development Bank Internship Program",
      description: "Join the African Development Bank's prestigious internship program and gain valuable experience in international development, finance, and project management.",
      type: "internship",
      company: "African Development Bank",
      location: "Abidjan, Côte d'Ivoire",
      salary: "Stipend provided",
      deadline: Timestamp.fromDate(new Date('2026-05-15')),
      applicationUrl: "https://example.com/adb-internship",
      status: "active",
      createdAt: Timestamp.now(),
      createdBy: "system"
    },
    {
      title: "Young Entrepreneurs Grant Program",
      description: "Apply for grants up to 2,000,000 XAF to support innovative business ideas from young entrepreneurs in Cameroon. Focus areas include technology, agriculture, and sustainable development.",
      type: "grant",
      company: "Ministry of Youth Affairs",
      location: "Cameroon",
      salary: "Up to 2,000,000 XAF",
      deadline: Timestamp.fromDate(new Date('2026-06-01')),
      applicationUrl: "https://example.com/youth-grant",
      status: "active",
      createdAt: Timestamp.now(),
      createdBy: "system"
    }
  ]
};

async function seedProductionData() {
  console.log('🌱 Starting production data seeding...');
  
  try {
    // Seed each collection
    for (const [collectionName, documents] of Object.entries(sampleData)) {
      console.log(`📦 Seeding ${documents.length} documents to ${collectionName}...`);
      
      for (const document of documents) {
        await addDoc(collection(db, collectionName), document);
      }
      
      console.log(`✅ Successfully seeded ${collectionName}`);
    }
    
    console.log('🎉 Production data seeding complete!');
    console.log('📊 Seeded:');
    console.log(`   Articles: ${sampleData.articles.length} documents`);
    console.log(`   Events: ${sampleData.events.length} documents`);
    console.log(`   Opportunities: ${sampleData.opportunities.length} documents`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seeding
seedProductionData();