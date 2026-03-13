# 🚀 Complete Production Setup Guide

## Step 1: Create Your Admin Account

### Method A: Using Registration Page
1. Go to: https://apple-fam-tv.web.app/admin/register
2. Fill out the registration form with your details
3. Click "Create Account"
4. You'll be logged in but won't have admin permissions yet

### Method B: Firebase Console (If registration doesn't work)
1. Go to [Firebase Console](https://console.firebase.google.com/project/apple-fam-tv/authentication)
2. Click "Authentication" → "Users" → "Add User"
3. Enter your email and password
4. Click "Add User"

## Step 2: Set Admin Role

### Method A: Browser Console (Recommended)
1. After registering, stay on the admin page
2. Open browser console (F12 → Console)
3. Copy and paste this script:

```javascript
// 🔐 Initial Admin User Setup
async function setupInitialAdmin() {
  console.log('🔐 Setting up initial admin user...');
  
  try {
    // Get Firebase instances
    const { auth, db } = window;
    const user = auth.currentUser;
    
    if (!user) {
      console.error('❌ No user logged in. Please register/login first.');
      return;
    }
    
    console.log(`👤 Setting up admin for: ${user.email}`);
    
    // Create user document with admin role
    const userDoc = {
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      role: 'admin',
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    };
    
    // Add to Firestore using your app's functions
    const { create, COLLECTIONS } = window;
    await create(COLLECTIONS.USERS, userDoc, user.uid);
    
    console.log('✅ Admin user created successfully!');
    console.log('🔄 Refresh the page and go to /admin/dashboard');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupInitialAdmin();
```

### Method B: Firebase Console (Manual)
1. Go to [Firestore Database](https://console.firebase.google.com/project/apple-fam-tv/firestore)
2. Click "Start collection" → Enter "users"
3. Click "Auto-ID" or use your user ID from Authentication
4. Add these fields:
   - `email`: your-email@example.com
   - `displayName`: Your Name
   - `role`: admin
   - `isActive`: true
   - `createdAt`: timestamp (now)

## Step 3: Access Admin Dashboard
1. Go to: https://apple-fam-tv.web.app/admin/dashboard
2. You should now see the full admin interface
3. You can create articles, events, and opportunities

## Step 4: Add Sample Content

Once you have admin access, use the data seeding script:

1. Stay on the admin dashboard
2. Open browser console (F12)
3. Copy and paste the content from `quick-seed-console.js`
4. Press Enter and wait for completion
5. Refresh to see your new content

## Troubleshooting

### "Access Denied" Error
- Make sure your user document exists in Firestore
- Verify the `role` field is set to "admin"
- Check that `isActive` is true

### "Firebase not defined" Error
- Make sure you're on the admin pages (not public pages)
- Try refreshing the page and running the script again

### Registration Not Working
- Use Firebase Console to create the user manually
- Then follow Method B to set the admin role

## What You'll Get After Setup

✅ **Admin Access**: Full dashboard with all features
✅ **Content Management**: Create/edit articles, events, opportunities
✅ **User Management**: Manage other admin users
✅ **Analytics**: View site statistics
✅ **Notifications**: Real-time admin notifications

## Quick Verification

After setup, you should be able to:
1. Access `/admin/dashboard` without errors
2. See statistics cards with numbers
3. Navigate to Articles, Events, Opportunities sections
4. Create new content

---

**Once you have admin access, you can add professional sample content in just 2 minutes using the seeding script!**