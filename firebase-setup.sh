#!/bin/bash

# Apple Fam TV - Firebase Setup Script
# This script helps initialize Firebase services for the project

echo "🔥 Apple Fam TV - Firebase Setup"
echo "================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI is available"

# Login to Firebase
echo "🔐 Logging into Firebase..."
firebase login

# List available projects
echo "📋 Available Firebase projects:"
firebase projects:list

# Set the project
echo "🎯 Setting up project..."
firebase use apple-fam-tv

# Deploy Firestore rules and indexes
echo "🛡️ Deploying Firestore rules and indexes..."
firebase deploy --only firestore

# Deploy Storage rules
echo "📁 Deploying Storage rules..."
firebase deploy --only storage

# Create initial admin user (you'll need to do this manually in Firebase Console)
echo "👤 MANUAL STEP REQUIRED:"
echo "   1. Go to Firebase Console > Authentication"
echo "   2. Create a user with email/password"
echo "   3. Go to Firestore Database"
echo "   4. Create a document in 'users' collection:"
echo "      - Document ID: [user-uid-from-auth]"
echo "      - Fields:"
echo "        * email: [admin-email]"
echo "        * role: 'admin'"
echo "        * name: 'Admin User'"
echo "        * createdAt: [current-timestamp]"

echo ""
echo "🎉 Firebase setup completed!"
echo "📝 Next steps:"
echo "   1. Complete the manual admin user setup above"
echo "   2. Update your .env file with Firebase config"
echo "   3. Test the application locally: npm run dev"
echo "   4. Deploy to hosting: npm run deploy"
echo ""
echo "🌐 Firebase Console: https://console.firebase.google.com/project/apple-fam-tv"