import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // If no user found
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // redirect to home or any safe page
  }

  // If everything is okay
  return children;
};

export default ProtectedRoute;
