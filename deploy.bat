@echo off
REM Apple Fam TV - Firebase Deployment Script for Windows
REM This script builds and deploys the application to Firebase Hosting

echo 🚀 Starting Apple Fam TV deployment process...

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI is not installed. Please install it first:
    echo npm install -g firebase-tools
    pause
    exit /b 1
)

REM Check if user is logged in to Firebase
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ You are not logged in to Firebase. Please login first:
    echo firebase login
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build the project
echo 🔨 Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check the build process.
    pause
    exit /b 1
)

REM Check if build directory exists
if not exist "dist" (
    echo ❌ Build directory not found. Build may have failed.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Deploy to Firebase
echo 🌐 Deploying to Firebase Hosting...
call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ❌ Deployment failed. Please check the error messages above.
    pause
    exit /b 1
)

echo 🎉 Deployment completed successfully!
echo 🌍 Your site is now live at: https://apple-fam-tv.web.app
echo 📊 You can view your project at: https://console.firebase.google.com/project/apple-fam-tv
pause