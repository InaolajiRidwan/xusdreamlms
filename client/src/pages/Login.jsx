import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "/api/v1/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      setAuth({
        accessToken: response.data.accessToken,
        role: response.data.user.role,
      });

      setTimeout(() => {
        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/userdashboard");
        }
      }, 2000);

      toast.success("Welcome back! Redirecting...", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error(message, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Toast Container for notifications */}
      <ToastContainer />

      {/* LEFT SIDE: IMAGE/BRANDING SECTION */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90"></div>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
          alt="Students learning"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex flex-col items-center justify-center mb-5">
            <span className="text-2xl font-bold italic">
              XUSDIGITAL
              <span className="text-red-500 underline font-extrabold text-2xl">
                DREAMLMS
              </span>
            </span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Master your future <br /> with our expert courses.
          </h1>
          <p className="text-xl text-blue-100 max-w-md">
            Join over 10,000+ students worldwide and start learning the most
            in-demand skills today.
          </p>
        </div>

        {/* Subtle Bottom UI Card Decoration */}
        <div className="absolute bottom-12 left-16 right-12 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hidden xl:block">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-blue-600 bg-gray-300 overflow-hidden"
                >
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-blue-50 text-sm font-medium">
              Currently online: 1,240 students learning right now.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 lg:bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo Only (shown below 'lg' breakpoint) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-200">
              <span className="text-white text-xl font-bold italic">LMS</span>
            </div>
          </div>

          <div className="mb-10 text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Login
            </h2>
            <p className="text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  size="sm"
                  className="text-sm text-blue-600 font-semibold hover:text-blue-700"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember for 30 days
              </label>
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xl shadow-blue-200 transition-all duration-200 flex items-center justify-center transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/" className="text-blue-600 font-bold hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;






// import { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../context/AuthContext";
// import { FaEnvelope, FaLock, FaArrowRight, FaGraduationCap, FaUsers, FaChartLine, FaAward } from "react-icons/fa";

// const Login = () => {
//   const { setAuth } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         "/api/v1/auth/login",
//         {
//           email,
//           password,
//         },
//         { withCredentials: true }
//       );

//       setAuth({
//         accessToken: response.data.accessToken,
//         role: response.data.user.role,
//       });

//       setTimeout(() => {
//         if (response.data.user.role === "admin") {
//           navigate("/admin");
//         } else {
//           navigate("/userdashboard");
//         }
//       }, 2000);

//       toast.success("Welcome back! Redirecting...", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } catch (err) {
//       const message =
//         err.response?.data?.message || "Invalid email or password";
//       toast.error(message, {
//         position: "top-right",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-white">
//       {/* Toast Container for notifications */}
//       <ToastContainer />

//       {/* LEFT SIDE: IMAGE/BRANDING SECTION */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
//         {/* Clear smiling student image */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <img
//             src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
//             alt="Happy student learning and smiling"
//             className="w-full h-full object-cover object-center"
//           />
//           {/* Gradient overlay to enhance text visibility */}
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-transparent"></div>
//         </div>

//         {/* Content overlay */}
//         <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
//           {/* Logo and Brand */}
//           <div>
//             <div className="flex items-center space-x-3 mb-8">
//               <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
//                 <FaGraduationCap className="text-white text-2xl" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold">
//                   <span className="text-white">Dream</span>
//                   <span className="text-cyan-300">LMS</span>
//                 </h1>
//                 <p className="text-blue-100 text-sm">Learning Made Enjoyable</p>
//               </div>
//             </div>

//             <h1 className="text-5xl font-bold leading-tight mb-6 max-w-2xl">
//               Learn with a <span className="text-cyan-300">Smile</span>,
//               <br />
//               Succeed with <span className="text-cyan-300">Confidence</span>
//             </h1>
            
//             <p className="text-xl text-blue-100 max-w-xl mb-10">
//               Join thousands of happy students who are transforming their careers 
//               through engaging, interactive learning experiences designed for real-world success.
//             </p>
//           </div>

//           {/* Stats and Features */}
//           <div className="space-y-6">
//             {/* Featured Quote */}
//             <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//               <div className="flex items-start space-x-4">
//                 <div className="flex-shrink-0">
//                   <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white">
//                     <img 
//                       src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
//                       alt="Student testimonial"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <p className="italic text-lg mb-2">
//                     "The courses here made learning fun and engaging. I landed my dream job in 3 months!"
//                   </p>
//                   <p className="font-semibold text-cyan-200">— Sarah Johnson, Web Developer</p>
//                 </div>
//               </div>
//             </div>

//             {/* Features Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
//                 <div className="p-2 bg-cyan-500/20 rounded-lg">
//                   <FaUsers className="text-cyan-300 text-xl" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-lg">10,000+</p>
//                   <p className="text-sm text-blue-100">Active Students</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
//                 <div className="p-2 bg-green-500/20 rounded-lg">
//                   <FaChartLine className="text-green-300 text-xl" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-lg">94%</p>
//                   <p className="text-sm text-blue-100">Success Rate</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
//                 <div className="p-2 bg-purple-500/20 rounded-lg">
//                   <FaAward className="text-purple-300 text-xl" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-lg">500+</p>
//                   <p className="text-sm text-blue-100">Courses Available</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
//                 <div className="p-2 bg-orange-500/20 rounded-lg">
//                   <FaGraduationCap className="text-orange-300 text-xl" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-lg">24/7</p>
//                   <p className="text-sm text-blue-100">Expert Support</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE: LOGIN FORM */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 lg:bg-white">
//         <div className="w-full max-w-md">
//           {/* Mobile Logo */}
//           <div className="lg:hidden text-center mb-8">
//             <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl mb-4 shadow-lg">
//               <FaGraduationCap className="text-white text-2xl" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Dream<span className="text-blue-600">LMS</span>
//             </h1>
//             <p className="text-gray-600 mt-2">Sign in to continue learning</p>
//           </div>

//           <div className="mb-10">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">
//               Welcome Back
//             </h2>
//             <p className="text-gray-500">
//               Sign in to access your personalized learning dashboard
//             </p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-6">
//             {/* Email Field */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
//                 <FaEnvelope className="mr-2 text-blue-500" />
//                 Email Address
//               </label>
//               <div className="relative">
//                 <input
//                   type="email"
//                   required
//                   className="w-full px-4 pl-12 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 bg-white"
//                   placeholder="you@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//                   <FaEnvelope />
//                 </div>
//               </div>
//             </div>

//             {/* Password Field */}
//             <div>
//               <div className="flex justify-between mb-2">
//                 <label className="block text-sm font-semibold text-gray-700 flex items-center">
//                   <FaLock className="mr-2 text-blue-500" />
//                   Password
//                 </label>
//                 <Link
//                   to="/forgot-password"
//                   className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>
//               <div className="relative">
//                 <input
//                   type="password"
//                   required
//                   className="w-full px-4 pl-12 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 bg-white"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//                   <FaLock />
//                 </div>
//               </div>
//             </div>

//             {/* Remember Me */}
//             <div className="flex items-center">
//               <input
//                 id="remember"
//                 type="checkbox"
//                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
//                 Remember me for 30 days
//               </label>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
//             >
//               {loading ? (
//                 <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
//               ) : (
//                 <>
//                   Sign In
//                   <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </button>

//             {/* Divider */}
//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white text-gray-500">
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             {/* Social Login */}
//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 type="button"
//                 className="py-3 px-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300 flex items-center justify-center"
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 Google
//               </button>
//               <button
//                 type="button"
//                 className="py-3 px-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300 flex items-center justify-center"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="#000000" viewBox="0 0 24 24">
//                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//                 </svg>
//                 GitHub
//               </button>
//             </div>
//           </form>

//           {/* Sign Up Link */}
//           <div className="mt-10 text-center">
//             <p className="text-gray-600">
//               Don't have an account?{" "}
//               <Link to="/" className="text-blue-600 font-bold hover:text-blue-700 hover:underline">
//                 Sign up for free
//               </Link>
//             </p>
//             <p className="mt-4 text-sm text-gray-500">
//               By signing in, you agree to our{" "}
//               <a href="#" className="text-blue-600 hover:underline">Terms</a>{" "}
//               and{" "}
//               <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;