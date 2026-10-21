import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8f7] text-[#073b25]">
        <p className="text-sm font-medium">Loading admin...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/admin/login" state={{ from: location }} replace />
    );
  }

  if (!user || !['admin', 'manager'].includes(user.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
