// 🔐 Initial Admin User Setup for Production
// Run this in browser console on https://apple-fam-tv.web.app/admin/register

// Step 1: Register your admin account first using the registration form
// Step 2: Then run this script to set your role to 'admin'

async function setupInitialAdmin() {
  console.log('🔐 Setting up initial admin user...');
  
  try {
    // Get current user
    const auth = window.auth || firebase.auth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('❌ No user logged in. Please register/login first.');
      return;
    }
    
    console.log(`👤 Current user: ${user.email}`);
    
    // Create user document with admin role
    const userDoc = {
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      role: 'admin',
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    };
    
    // Add to Firestore
    const db = window.db || firebase.firestore();
    await db.collection('users').doc(user.uid).set(userDoc);
    
    console.log('✅ Admin user created successfully!');
    console.log('📊 User details:');
    console.log(`   Email: ${userDoc.email}`);
    console.log(`   Role: ${userDoc.role}`);
    console.log(`   Display Name: ${userDoc.displayName}`);
    console.log('');
    console.log('🔄 Please refresh the page and navigate to /admin/dashboard');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('');
    console.log('🔧 Manual setup instructions:');
    console.log('1. Go to Firebase Console → Firestore');
    console.log('2. Create collection "users"');
    console.log('3. Add document with your user ID');
    console.log('4. Set fields: email, role: "admin", isActive: true');
  }
}

// Run the setup
setupInitialAdmin();