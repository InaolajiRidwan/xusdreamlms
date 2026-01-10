import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEyeSlash, FaEye, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import studentImg from "../assets/students-with-laptop-medium-shot.jpg";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Basic password strength calculation
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 7) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        "/api/v1/auth/sign-up",
        {
          fullName,
          email,
          password,
        },
        { withCredentials: true }
      );
      toast.success(
        <div>
          <div className="font-bold">Account created successfully!</div>
          <div className="text-sm">
            Please check your email to verify your account.
          </div>
        </div>,
        { position: "top-center", autoClose: 5000, theme: "colored" }
      );
      setSignupSuccess(true);
      localStorage.setItem("pendingVerificationEmail", email);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage, { theme: "colored" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        "http://localhost:8080/api/v1/auth/resend-verification",
        { email }
      );
      toast.success("Verification email has been resent!", {
        position: "top-center",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend email.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColors = [
    "bg-gray-300",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-green-500",
  ];
  const strengthText = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];

  // Verification Screen UI
  if (signupSuccess) {
    return (
      <>
        <ToastContainer />
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-6">
              <svg
                className="h-8 w-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 19v-8.93a2 2 0 01.89-1.66l7.71-6.32a2 2 0 012.79.02l7.71 6.32A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19h18M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              A verification link has been sent to{" "}
              <span className="font-semibold text-gray-800">{email}</span>.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm text-gray-600 space-y-2">
              <p>Please click the link to activate your account.</p>
              <p className="font-semibold">
                Didn't receive the email? Check your spam folder or click below
                to resend.
              </p>
            </div>
            <div className="mt-8 flex flex-col space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Resend Verification Email"}
              </button>
              <Link
                to="/login"
                className="w-full px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Signup Form UI
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img
            src={studentImg}
            alt="Students with laptop"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h2 className="text-5xl font-bold mb-6">
                XUSDIGITAL{" "}
                <span className="text-red-500 underline">DreamLms</span>
              </h2>
              <p className="text-2xl">
                Transform Your Future Through Education
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center lg:text-left mb-10">
              <h1 className="text-3xl font-bold text-gray-800 text-center">
                XUSDIGITAL{" "}
                <span className="text-red-500 underline">DreamLms</span>
              </h1>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 text-center">
                Get Started
              </h2>
              <p className="mt-2 text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Input */}
              <div className="relative">
                <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-3 py-1.5 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-3 py-1.5 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-1.5 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${strengthColors[passwordStrength]}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-20 text-right">
                    {strengthText[passwordStrength]}
                  </span>
                </div>
              )}

              <div className="text-xs md:text-md text-gray-500">
                By signing up, you agree to our{" "}
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  Terms
                </a>{" "}
                &{" "}
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 md:py-5 px-4 border border-transparent rounded-lg shadow-sm text-sm md:text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
