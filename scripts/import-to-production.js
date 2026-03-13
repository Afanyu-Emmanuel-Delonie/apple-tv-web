import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';

// Your production Firebase configuration
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

async function importData(filename) {
  console.log('🚀 Starting data import to production...');
  
  try {
    // Read the export file
    const fileContent = readFileSync(filename, 'utf8');
    const importData = JSON.parse(fileContent);
    
    console.log(`📁 Reading export from ${importData.exportDate}`);
    
    // Import each collection
    for (const [collectionName, documents] of Object.entries(importData.collections)) {
      console.log(`📦 Importing ${documents.length} documents to ${collectionName}...`);
      
      let imported = 0;
      let skipped = 0;
      
      for (const document of documents) {
        try {
          const { id, ...data } = document;
          
          // Convert ISO strings back to Firestore timestamps
          const convertedData = convertToTimestamps(data);
          
          // Import to production
          await setDoc(doc(db, collectionName, id), convertedData);
          imported++;
          
          if (imported % 10 === 0) {
            console.log(`   ⏳ Imported ${imported}/${documents.length} documents...`);
          }
          
        } catch (error) {
          console.warn(`   ⚠️ Skipped document ${document.id}: ${error.message}`);
          skipped++;
        }
      }
      
      console.log(`✅ ${collectionName}: ${imported} imported, ${skipped} skipped`);
    }
    
    console.log('🎉 Import complete!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Helper function to convert ISO strings back to Firestore timestamps
function convertToTimestamps(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const converted = Array.isArray(obj) ? [] : {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && isISOString(value)) {
      // Convert ISO string to Firestore timestamp
      converted[key] = Timestamp.fromDate(new Date(value));
    } else if (value && typeof value === 'object') {
      // Recursively convert nested objects
      converted[key] = convertToTimestamps(value);
    } else {
      converted[key] = value;
    }
  }
  
  return converted;
}

// Helper function to check if string is ISO date
function isISOString(str) {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  return isoRegex.test(str) && !isNaN(Date.parse(str));
}

// Get filename from command line arguments
const filename = process.argv[2];

if (!filename) {
  console.error('❌ Please provide the export filename:');
  console.log('   node import-to-production.js firebase-export-1234567890.json');
  process.exit(1);
}

// Run the import
importData(filename);