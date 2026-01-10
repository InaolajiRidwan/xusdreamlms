// components/PrivateRoute.jsx - Pure Tailwind Version
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { auth, loading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
        {/* Animated Student Illustration */}
        <div className="relative mb-10">
          <div className="w-48 h-48 relative">
            {/* Student Silhouette */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              {/* Head */}
              <div className="w-16 h-16 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full mx-auto mb-4 relative">
                <div className="absolute w-12 h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2"></div>
              </div>
              
              {/* Body */}
              <div className="w-20 h-28 bg-gradient-to-b from-blue-600 to-blue-800 rounded-xl mx-auto relative">
                {/* Arms holding laptop */}
                <div className="absolute -left-4 top-8 w-6 h-16 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full transform -rotate-45"></div>
                <div className="absolute -right-4 top-8 w-6 h-16 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full transform rotate-45"></div>
              </div>
              
              {/* Laptop */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-40 h-24 bg-gradient-to-b from-gray-900 to-black rounded-lg shadow-2xl">
                <div className="absolute inset-2 bg-gradient-to-br from-gray-900 to-black rounded flex items-center justify-center">
                  {/* Loading dots on screen */}
                  <div className="flex space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '100ms'}}></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
                  </div>
                </div>
              </div>
              
              {/* Floating Books */}
              <div 
                className="absolute -top-4 -left-6 w-8 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg transform rotate-12"
                style={{
                  animation: 'float 2s ease-in-out infinite'
                }}
              ></div>
              <div 
                className="absolute -top-2 -right-8 w-8 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-lg transform -rotate-12"
                style={{
                  animation: 'float 2s ease-in-out infinite',
                  animationDelay: '300ms'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            <span className="text-blue-600">Welcome</span> to Your Learning Space
          </h2>
          <p className="text-gray-600 mb-6">
            Setting up your personalized dashboard with courses, assignments, and resources...
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === 1 ? 'bg-blue-500' : 
                    i === 2 ? 'bg-green-500' : 
                    i === 3 ? 'bg-yellow-500' : 
                    i === 4 ? 'bg-purple-500' : 'bg-pink-500'
                  }`}
                  style={{ 
                    animation: 'pulse 1.5s infinite',
                    animationDelay: `${i * 200}ms`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Status Message */}
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-700">Connected to Learning Network</span>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center">
          <p className="text-sm text-gray-500">XUSDIGITAL DREAMLMS • Elevating Education</p>
        </div>

        {/* Add inline style for float animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(12deg); }
            50% { transform: translateY(-10px) rotate(12deg); }
          }
        `}</style>
      </div>
    );
  }

  // Rest of authentication logic
  if (!auth || !auth.accessToken) {
    return <Navigate to="/login" replace />;
  }

  const userRole = auth?.role || auth?.user?.role;

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;