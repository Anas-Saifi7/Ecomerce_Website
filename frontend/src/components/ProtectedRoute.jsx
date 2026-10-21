import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f2] text-[#073b25]">
        <p className="text-sm font-medium">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
