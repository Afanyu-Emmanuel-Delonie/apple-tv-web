import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#002fa7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5a6073] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
