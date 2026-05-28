import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hook";


interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, token } = useAppSelector(
    (state) => state.auth
  );

  // Final auth check
  const isAuth = isAuthenticated || token || localStorage.getItem("token");

  // Show loader while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect if NOT authenticated
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Allow access
  return <>{children}</>;
};

export default ProtectedRoute;
