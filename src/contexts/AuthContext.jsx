import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signIn as firebaseSignIn,
  signUp as firebaseSignUp,
  signOutUser,
  signInWithGoogle,
  onAuthStateChanged,
  updateUserProfile as firebaseUpdateProfile,
  getUserProfile,
  isAdmin
} from '../services/firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Get user profile from Firestore
        const userProfile = await getUserProfile(firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...userProfile
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const user = await firebaseSignIn(email, password);
    return user;
  };

  const loginWithGoogle = async () => {
    const user = await signInWithGoogle();
    return user;
  };

  const register = async (email, password, name, role = 'author') => {
    const user = await firebaseSignUp(email, password, { name, role });
    return user;
  };

  const logout = async () => {
    await signOutUser();
  };

  const updateProfile = async (updates) => {
    await firebaseUpdateProfile(updates);
    // Update local state
    setUser(prev => ({ ...prev, ...updates }));
  };

  const resetPassword = async (email) => {
    const { resetPassword: firebaseResetPassword } = await import('../services/firebase/auth');
    await firebaseResetPassword(email);
  };

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.email === 'afanyuemma2002@gmail.com',
    isEditor: user?.role === 'editor' || user?.role === 'admin' || user?.email === 'afanyuemma2002@gmail.com',
    isAuthor: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
