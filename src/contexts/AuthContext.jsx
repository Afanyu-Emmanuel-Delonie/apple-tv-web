import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Initialize Firebase auth listener
    // For now, check localStorage for demo purposes
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // TODO: Implement Firebase authentication
    // For now, demo implementation
    const demoUser = {
      id: '1',
      email: email,
      name: 'Admin User',
      role: 'admin'
    };
    setUser(demoUser);
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    return demoUser;
  };

  const register = async (email, password, name, role = 'author') => {
    // TODO: Implement Firebase registration
    const newUser = {
      id: Date.now().toString(),
      email: email,
      name: name,
      role: role
    };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  };

  const logout = async () => {
    // TODO: Implement Firebase logout
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (updates) => {
    // TODO: Implement Firebase profile update
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor' || user?.role === 'admin',
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
