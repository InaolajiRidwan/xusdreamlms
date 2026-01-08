import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyPage = () => {
  const [status, setStatus] = useState("loading");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const verifyEmail = async () => {
      try {
        await axios.get(
          `http://localhost:8080/api/v1/auth/verify-email/${token}`
        );
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        console.error("Email verification error:", error);
        if (error.response?.status === 400 || error.response?.status === 410) {
          setStatus("invalid");
        } else {
          setStatus("error");
        }
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleRetry = () => {
    if (token) {
      setStatus("loading");
      const verifyEmail = async () => {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/v1/auth/verify-email`,
            { token }
          );
          setStatus("success");
        } catch (error) {
          setStatus("error");
        }
      };
      verifyEmail();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="mb-8 text-center">
          {/* LMS Logo Placeholder */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-200">
            <span className="text-white text-2xl font-bold italic">LMS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Account Verification</h1>
        </div>

        {/* LOADING STATE */}
        {status === "loading" && (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-600">Checking your credentials...</p>
            <p className="text-sm text-gray-400 mt-1">Please wait while we secure your account.</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && (
          <div className="text-center animate-in fade-in duration-500">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 border border-green-100">
              <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Verification Successful!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your email has been verified. You're ready to start learning. Redirecting you to login...
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition duration-200 shadow-md shadow-green-100"
            >
              Start Learning Now
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <div className="text-center animate-in fade-in duration-500">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6 border border-red-100">
              <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">System Error</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">We couldn't reach our servers. Please check your connection and try again.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-md shadow-blue-100"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 px-4 bg-transparent border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition duration-200"
              >
                Go back to login
              </button>
            </div>
          </div>
        )}

        {/* INVALID / EXPIRED STATE */}
        {status === "invalid" && (
          <div className="text-center animate-in fade-in duration-500">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-50 mb-6 border border-amber-100">
              <svg className="h-10 w-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Link Expired</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              This link is no longer valid. For security reasons, verification links expire after a short period.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition duration-200"
            >
              Request New Link
            </button>
          </div>
        )}
      </div>
      
      {/* Footer Branding */}
      <p className="fixed bottom-8 text-sm text-gray-400">
        &copy; 2024 Your LMS Academy. All rights reserved.
      </p>
    </div>
  );
};

export default VerifyPage;