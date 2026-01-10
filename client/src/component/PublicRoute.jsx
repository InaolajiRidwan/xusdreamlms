// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PublicRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to appropriate dashboard based on role
  if (auth && auth.accessToken) {
    const userRole = auth.role || auth.user?.role;
    
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (userRole === "student") {
      return <Navigate to="/userdashboard" replace />;
    }
    
    // Default redirect if role is not recognized
    return <Navigate to="/userdashboard" replace />;
  }

  // If not authenticated, allow access to public pages
  return children;
};