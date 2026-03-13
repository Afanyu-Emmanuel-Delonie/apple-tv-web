import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, getFirestore, collection, getDocs, query, orderBy, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { app, isFirebaseConfigured } from './config';

// Only initialize Firebase services if properly configured
export const auth = isFirebaseConfigured ? getAuth(app) : null;
export const db = isFirebaseConfigured ? getFirestore(app) : null;
const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null;

/**
 * Create user with email and password (Admin function)
 * Creates invitation record instead of actual Firebase user to avoid session conflicts
 */
export async function createUser(email, password, userData) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  
  // Check if user should be admin
  const role = (email === 'afanyuemma2002@gmail.com') ? 'admin' : (userData.role || 'author');
  
  // Generate a temporary UID for the invitation
  const tempUid = 'invite_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  // Create user invitation in Firestore
  const userProfile = {
    name: userData.name,
    email: email,
    role: role,
    status: 'invited',
    createdAt: new Date().toISOString(),
    createdBy: 'admin',
    loginMethod: 'email',
    tempPassword: password,
    isInvitation: true
  };
  
  await createUserProfile(tempUid, userProfile);
  
  return { uid: tempUid, ...userProfile };
}

/**
 * Update user password (Admin function)
 */
export async function updateUserPassword(uid, newPassword) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  
  // Note: This requires Firebase Admin SDK for production
  // For now, we'll just update the profile to indicate password change request
  await updateUserProfileById(uid, {
    passwordChangeRequested: true,
    passwordChangeRequestedAt: new Date().toISOString()
  });
  
  // In production, you would use Firebase Admin SDK:
  // await admin.auth().updateUser(uid, { password: newPassword });
}

/**
 * Check if user is admin (including specific email)
 */
export function isAdmin(user) {
  return user?.role === 'admin' || user?.email === 'afanyuemma2002@gmail.com';
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  let userDoc = await getUserProfile(userCredential.user.uid);
  
  // Check if user should be admin and upgrade if needed
  if (email === 'afanyuemma2002@gmail.com' && userDoc?.role !== 'admin') {
    await updateUserProfileById(userCredential.user.uid, { role: 'admin' });
    userDoc.role = 'admin';
  }
  
  // Update last login
  await updateUserProfileById(userCredential.user.uid, {
    lastLogin: new Date().toISOString()
  });
  
  return { ...userCredential.user, ...userDoc };
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Check if user profile exists, create if not
  let userProfile = await getUserProfile(user.uid);
  if (!userProfile) {
    const role = (user.email === 'afanyuemma2002@gmail.com') ? 'admin' : 'author';
    
    userProfile = {
      name: user.displayName,
      email: user.email,
      role: role,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'google',
      photoURL: user.photoURL,
      loginMethod: 'google'
    };
    await createUserProfile(user.uid, userProfile);
  } else if (user.email === 'afanyuemma2002@gmail.com' && userProfile.role !== 'admin') {
    await updateUserProfileById(user.uid, { role: 'admin' });
    userProfile.role = 'admin';
  }
  
  // Update last login
  await updateUserProfileById(user.uid, {
    lastLogin: new Date().toISOString()
  });
  
  return { ...user, ...userProfile };
}

/**
 * Register new user
 */
export async function signUp(email, password, userData) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  
  // Check if there's an invitation for this email
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);
  let invitation = null;
  let invitationId = null;
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.email === email && data.isInvitation) {
      invitation = data;
      invitationId = doc.id;
    }
  });
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: userData.name || invitation?.name });
  
  const role = (email === 'afanyuemma2002@gmail.com') ? 'admin' : (invitation?.role || userData.role || 'author');
  
  await createUserProfile(userCredential.user.uid, {
    name: userData.name || invitation?.name,
    email: email,
    role: role,
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: invitation ? 'admin-invitation' : 'registration',
    loginMethod: 'email'
  });
  
  // Delete the invitation record if it exists
  if (invitationId) {
    await deleteDoc(doc(db, 'users', invitationId));
  }
  
  return userCredential.user;
}

/**
 * Create user profile in Firestore
 */
export async function createUserProfile(uid, userData) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, userData);
  return userData;
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}

/**
 * Get all users from Firestore
 */
export async function getAllUsers() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push({
      id: doc.id,
      uid: doc.id,
      ...doc.data()
    });
  });
  
  return users;
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfileById(uid, updates) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Delete user profile from Firestore
 */
export async function deleteUserProfile(uid) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  const userRef = doc(db, 'users', uid);
  await deleteDoc(userRef);
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  return await signOut(auth);
}

/**
 * Reset password
 */
export async function resetPassword(email) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  return await sendPasswordResetEmail(auth, email);
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  const user = auth.currentUser;
  if (user) {
    if (updates.displayName) {
      await updateProfile(user, { displayName: updates.displayName });
    }
    // Update Firestore profile
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, updates, { merge: true });
  }
}

/**
 * Get current user
 */
export function getCurrentUser() {
  if (!isFirebaseConfigured) {
    return null;
  }
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChanged(callback) {
  if (!isFirebaseConfigured) {
    // Call callback with null user if Firebase not configured
    callback(null);
    return () => {};
  }
  return firebaseOnAuthStateChanged(auth, callback);
}
