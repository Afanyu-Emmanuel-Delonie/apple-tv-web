# Firebase Authentication Setup Guide

## 1. Firebase Console Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `apple-fam-tv`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication
1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Google** provider:
   - Click on Google
   - Toggle "Enable"
   - Add your project support email
   - Click "Save"

### Get Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" icon (`</>`)
4. Register app name: `apple-fam-tv-web`
5. Copy the configuration object

## 2. Environment Setup

### Create .env file
```bash
# Copy the example file
cp .env.example .env
```

### Fill in Firebase Config
Replace the values in `.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 3. Firestore Database Setup

### Create Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select location closest to your users
5. Click "Done"

### Security Rules (for production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Only admins can manage users
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Public read access for content
    match /articles/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /opportunities/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 4. Google Sign-In Setup

### Configure OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **OAuth consent screen**
4. Fill in required fields:
   - App name: `Apple Fam TV`
   - User support email: your email
   - Developer contact: your email
5. Save and continue

### Add Authorized Domains
1. In Firebase Console > **Authentication** > **Settings**
2. Go to **Authorized domains**
3. Add your domains:
   - `localhost` (for development)
   - Your production domain

## 5. Test Authentication

### Development Testing
1. Start your development server: `npm run dev`
2. Go to `/admin/login`
3. Try both email/password and Google sign-in
4. Check Firebase Console > **Authentication** > **Users** to see registered users

### Create First Admin User
1. Register a user through the app
2. Go to Firebase Console > **Firestore Database**
3. Find the user document in `users` collection
4. Edit the document and change `role` field to `"admin"`

## 6. Production Deployment

### Update Security Rules
Switch Firestore to production mode with proper security rules (see above).

### Environment Variables
Make sure your production environment has the correct Firebase config variables.

### Domain Authorization
Add your production domain to Firebase authorized domains.

## Troubleshooting

### Common Issues
1. **"Firebase not initialized"**: Check if `.env` file exists and has correct values
2. **"Auth domain not authorized"**: Add your domain to Firebase authorized domains
3. **"Google sign-in failed"**: Check OAuth consent screen configuration
4. **"Permission denied"**: Update Firestore security rules

### Debug Mode
Add this to see Firebase errors in console:
```javascript
// In firebase/config.js
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

// Only in development
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## Next Steps

After authentication is working:
1. Set up Firestore for data storage
2. Implement user roles and permissions
3. Add password reset functionality
4. Set up email verification
5. Add user profile management

---

🎉 **Your Firebase Authentication is now ready!**