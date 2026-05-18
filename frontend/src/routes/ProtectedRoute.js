import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, user } = useSelector((state) => state.auth || {});

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.access_level_id)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
