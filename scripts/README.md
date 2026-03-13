# 📊 Data Migration Guide - Dev to Production

This guide helps you migrate data from your development database to production.

## 🎯 Quick Start (Recommended)

### Option 1: Seed with Sample Data
```bash
cd scripts
npm install
npm run seed-prod
```

This will add professional sample content to your production database including:
- 3 sample articles (Welcome, Business, Regional news)
- 2 sample events (Tech summit, Workshop)
- 3 sample opportunities (Job, Internship, Grant)

## 🔄 Full Migration Process

### Step 1: Export Development Data
1. Update `export-dev-data.js` with your development Firebase config
2. Run the export:
```bash
cd scripts
npm install
npm run export-dev
```

### Step 2: Import to Production
```bash
npm run import-prod firebase-export-[timestamp].json
```

## 📋 Manual Steps Required

### 1. Configure Development Firebase Config
Edit `scripts/export-dev-data.js` and replace:
```javascript
const devConfig = {
  apiKey: "your-dev-api-key",
  authDomain: "your-dev-project.firebaseapp.com",
  projectId: "your-dev-project-id",
  storageBucket: "your-dev-project.appspot.com",
  messagingSenderId: "your-dev-sender-id",
  appId: "your-dev-app-id"
};
```

### 2. Set Production Environment Variables
Make sure your `.env` file has production Firebase config:
```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=apple-fam-tv.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=apple-fam-tv
VITE_FIREBASE_STORAGE_BUCKET=apple-fam-tv.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🛠 Available Scripts

### `npm run export-dev`
- Exports all data from development database
- Creates JSON file with timestamp
- Handles Firestore timestamp conversion

### `npm run import-prod`
- Imports data to production database
- Usage: `npm run import-prod filename.json`
- Converts timestamps back to Firestore format

### `npm run seed-prod`
- Seeds production with sample data
- No configuration needed
- Creates professional demo content

## 📦 Collections Migrated

- **Articles**: News stories and content
- **Events**: Community events and workshops
- **Opportunities**: Jobs, internships, grants
- **Users**: Admin and user accounts
- **Submissions**: User-submitted content
- **Notifications**: System notifications

## ⚠️ Important Notes

1. **Backup First**: Always backup production before importing
2. **Test Environment**: Test migration on staging first
3. **User Accounts**: User passwords won't migrate (Firebase Auth limitation)
4. **File Uploads**: Images/files need separate migration
5. **IDs Preserved**: Document IDs are maintained during migration

## 🚨 Troubleshooting

### Permission Errors
- Ensure Firebase project has proper permissions
- Check Firestore security rules allow admin operations

### Timestamp Issues
- Scripts handle Firestore timestamp conversion automatically
- If issues persist, check date formats in source data

### Large Datasets
- For large datasets, consider batch processing
- Monitor Firestore quotas and limits

## 🎉 Quick Production Setup

For immediate production content, just run:
```bash
cd scripts
npm install
npm run seed-prod
```

This gives you professional sample content that website owners can see immediately!