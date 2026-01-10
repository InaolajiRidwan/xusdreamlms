// pages/NotFound.jsx
import { Link } from "react-router-dom";
import { 
  FaBook, 
  FaSearch, 
  FaHome, 
  FaGraduationCap, 
  FaExclamationTriangle,
  FaArrowLeft,
  FaCompass
} from "react-icons/fa";

const NotFound = () => {
  const popularLinks = [
    { name: "Dashboard", path: "/userdashboard", icon: <FaHome /> },
    { name: "Courses", path: "/courses", icon: <FaBook /> },
    { name: "Learning Path", path: "/learning-path", icon: <FaGraduationCap /> },
    { name: "Resources", path: "/resources", icon: <FaCompass /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Error Code Display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-2xl mb-6">
            <FaExclamationTriangle className="text-white text-5xl" />
          </div>
          <h1 className="text-9xl font-bold text-gray-800 leading-none">
            4<span className="text-blue-600">0</span>4
          </h1>
          <div className="mt-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full text-lg">
              Page Not Found
            </span>
          </div>
        </div>

        {/* Main Message */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Oops! This Page Got Lost in Learning
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              It seems the page you're looking for has been moved, deleted, or never existed. 
              Don't worry, great learning opportunities are just a click away!
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search courses, resources, or topics..."
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                Search
              </button>
            </div>
          </div>

          {/* Popular Links */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
              <FaCompass className="text-blue-600" />
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:from-blue-200 group-hover:to-indigo-200">
                    <span className="text-blue-600 text-xl">{link.icon}</span>
                  </div>
                  <span className="font-medium text-gray-800">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/userdashboard"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaHome />
              Go to Dashboard
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaArrowLeft />
              Go Back
            </button>
          </div>
        </div>

        {/* Fun Learning Facts */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Did You Know?</h3>
              <p className="opacity-90">
                The average person learns something new every 3.6 days. Keep exploring!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <span className="text-3xl font-bold">404</span>
                <p className="text-sm opacity-80">Error Code</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <span className="text-3xl font-bold">∞</span>
                <p className="text-sm opacity-80">Learning Possibilities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <FaGraduationCap className="text-blue-600" />
            <span className="font-semibold text-gray-800">DreamLMS</span> - 
            <span className="ml-2">Every wrong turn is a new learning opportunity</span>
          </p>
          <p className="mt-2 text-sm">
            Need help? Contact support@dreamlms.edu or call (123) 456-7890
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;