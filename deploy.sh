#!/bin/bash

# Apple Fam TV - Firebase Deployment Script
# This script builds and deploys the application to Firebase Hosting

echo "🚀 Starting Apple Fam TV deployment process..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ You are not logged in to Firebase. Please login first:"
    echo "firebase login"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed. Please check the build process."
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Firebase
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

# Check deployment status
if [ $? -eq 0 ]; then
    echo "🎉 Deployment completed successfully!"
    echo "🌍 Your site is now live at: https://apple-fam-tv.web.app"
    echo "📊 You can view your project at: https://console.firebase.google.com/project/apple-fam-tv"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi