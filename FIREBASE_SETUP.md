# Firebase Setup Guide for Apple Fam TV

## Current Status
✅ Firebase service structure created (placeholder files)
✅ Environment variables template ready
❌ Firebase project not created
❌ Firebase services not initialized
❌ Environment variables not configured

## Firebase Console Setup Checklist

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `apple-fam-tv`
4. Enable Google Analytics (recommended)
5. Choose Analytics account or create new one

### 2. Enable Authentication
1. Go to **Authentication** → **Get started**
2. **Sign-in method** tab:
   - Enable **Email/Password**
   - Enable **Google** (optional)
   - Configure authorized domains (add your Netlify domain)

### 3. Create Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select location: `us-central1` (or closest to your users)
4. Create these collections:
   ```
   - articles
   - events  
   - opportunities
   - submissions
   - users
   - notifications
   ```

### 4. Setup Storage
1. Go to **Storage** → **Get started**
2. Choose **Start in test mode**
3. Select same location as Firestore
4. Create folder structure:
   ```
   - articles/
   - events/
   - opportunities/
   - submissions/
   - profiles/
   ```

### 5. Configure Web App
1. Go to **Project settings** (gear icon)
2. **General** tab → **Your apps**
3. Click **Web app** icon (`</>`)
4. App nickname: `apple-fam-tv-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Copy the config object

### 6. Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for articles, events, opportunities
    match /{collection}/{document} {
      allow read: if collection in ['articles', 'events', 'opportunities'];
      allow write: if request.auth != null && 
        request.auth.token.role in ['admin', 'editor'];
    }
    
    // Submissions - authenticated users can create, admins can manage
    match /submissions/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.role in ['admin', 'editor'];
      allow create: if request.auth != null;
    }
    
    // Users - users can read/update own profile, admins can manage all
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.role == 'admin');
    }
    
    // Notifications - admins only
    match /notifications/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.role in ['admin', 'editor'];
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access for content images
    match /{collection}/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.role in ['admin', 'editor', 'author'];
    }
    
    // Profile images - users can manage own
    match /profiles/{userId}/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.role == 'admin');
    }
  }
}
```

### 7. Environment Variables Setup

Create `.env` file in project root:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=apple-fam-tv.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=apple-fam-tv
VITE_FIREBASE_STORAGE_BUCKET=apple-fam-tv.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional Analytics
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# App Settings
VITE_APP_NAME=Apple Fam TV
VITE_APP_URL=https://your-netlify-domain.netlify.app
```

### 8. Netlify Environment Variables
Add these in Netlify dashboard → Site settings → Environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Implementation Steps

### Phase 1: Basic Setup
1. Create Firebase project
2. Configure authentication
3. Setup Firestore database
4. Initialize Firebase in app

### Phase 2: Authentication Integration
1. Replace localStorage auth with Firebase Auth
2. Implement admin login/register
3. Add role-based access control
4. Setup user profiles

### Phase 3: Database Migration
1. Migrate articles to Firestore
2. Migrate events to Firestore
3. Migrate opportunities to Firestore
4. Setup real-time submissions

### Phase 4: File Storage
1. Implement image uploads
2. Replace static images with Firebase Storage
3. Add file management in admin

### Phase 5: Advanced Features
1. Real-time notifications
2. Analytics integration
3. Performance monitoring
4. Backup strategies

## Database Schema

### Collections Structure

#### articles
```javascript
{
  id: "auto-generated",
  title: "string",
  content: "string",
  excerpt: "string",
  category: "string",
  author: "string",
  authorId: "string",
  image: "string", // Firebase Storage URL
  status: "active|expired|draft",
  featured: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  expiryDate: "timestamp|null"
}
```

#### submissions
```javascript
{
  id: "auto-generated",
  title: "string",
  type: "News Story|Job Offer|Event|Opportunity",
  category: "string",
  description: "string",
  author: "string",
  email: "string",
  phone: "string",
  location: "string",
  company: "string", // for jobs
  salary: "string", // for jobs
  deadline: "string", // for jobs/opportunities
  eventDate: "string", // for events
  price: "string", // for events
  image: "string|null",
  status: "pending|approved|rejected",
  actionTimestamp: "timestamp|null",
  submittedAt: "timestamp",
  reviewedBy: "string|null"
}
```

#### users
```javascript
{
  id: "auth-uid",
  email: "string",
  displayName: "string",
  role: "admin|editor|author",
  profile: {
    firstName: "string",
    lastName: "string",
    phone: "string",
    avatar: "string"
  },
  createdAt: "timestamp",
  lastLogin: "timestamp"
}
```

## Next Steps

1. **Create Firebase Project** following steps 1-6 above
2. **Get Configuration** and update `.env` file
3. **Initialize Firebase** in the app
4. **Test Connection** with a simple read/write operation
5. **Migrate Authentication** from localStorage to Firebase Auth
6. **Migrate Data** from constants to Firestore

Would you like me to help you with any specific step or create the actual Firebase initialization code?