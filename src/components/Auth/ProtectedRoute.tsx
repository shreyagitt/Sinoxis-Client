import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Direct auth check from localStorage
  const token = localStorage.getItem("token");

  const isAuthenticated = !!token;

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Allow access
  return <>{children}</>;
};

export default ProtectedRoute;