import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { showError } from "@/utils/toast";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  // In a real app, this would check if the user is authenticated and has admin role
  const isAdmin = true; // Mock admin check - replace with actual auth logic
  
  if (!isAdmin) {
    showError("Access denied. Administrator privileges required.");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;