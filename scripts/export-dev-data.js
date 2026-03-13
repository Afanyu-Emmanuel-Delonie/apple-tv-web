import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { writeFileSync } from 'fs';

// Your development Firebase configuration
const devConfig = {
  apiKey: "your-dev-api-key",
  authDomain: "your-dev-project.firebaseapp.com",
  projectId: "your-dev-project-id",
  storageBucket: "your-dev-project.appspot.com",
  messagingSenderId: "your-dev-sender-id",
  appId: "your-dev-app-id"
};

// Initialize Firebase
const app = initializeApp(devConfig);
const db = getFirestore(app);

// Collections to export
const COLLECTIONS = [
  'articles',
  'events', 
  'opportunities',
  'users',
  'submissions',
  'notifications'
];

async function exportData() {
  console.log('🚀 Starting data export from development...');
  
  const exportData = {
    exportDate: new Date().toISOString(),
    collections: {}
  };

  try {
    for (const collectionName of COLLECTIONS) {
      console.log(`📦 Exporting ${collectionName}...`);
      
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Convert Firestore timestamps to ISO strings for JSON serialization
        const convertedData = convertTimestamps(data);
        
        documents.push({
          id: doc.id,
          ...convertedData
        });
      });
      
      exportData.collections[collectionName] = documents;
      console.log(`✅ Exported ${documents.length} documents from ${collectionName}`);
    }

    // Write to JSON file
    const filename = `firebase-export-${Date.now()}.json`;
    writeFileSync(filename, JSON.stringify(exportData, null, 2));
    
    console.log(`🎉 Export complete! Data saved to ${filename}`);
    console.log(`📊 Export Summary:`);
    
    Object.entries(exportData.collections).forEach(([collection, docs]) => {
      console.log(`   ${collection}: ${docs.length} documents`);
    });
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  }
}

// Helper function to convert Firestore timestamps to ISO strings
function convertTimestamps(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const converted = Array.isArray(obj) ? [] : {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') {
      // Check if it's a Firestore timestamp
      if (value.seconds && value.nanoseconds !== undefined) {
        converted[key] = new Date(value.seconds * 1000).toISOString();
      } else if (value.toDate && typeof value.toDate === 'function') {
        converted[key] = value.toDate().toISOString();
      } else {
        // Recursively convert nested objects
        converted[key] = convertTimestamps(value);
      }
    } else {
      converted[key] = value;
    }
  }
  
  return converted;
}

// Run the export
exportData();