import "./App.css";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyPage from "./pages/verifyPage";
import UserDashboard from "./pages/UserDashboard";
import PrivateRoute from "./component/PrivateRoute";
import { PublicRoute } from "./component/PublicRoute";
import Navbar from "./component/Navbar";
import NotFoundPage from "./component/NotFoundPage"

function App() {
  return (
    <div>
      <ToastContainer />
      {/* <Navbar /> */}
      <Routes>
        {/* Redirect root path based on auth status - handled by PublicRoute */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyPage />
            </PublicRoute>
          }
        />

        {/* Private routes */}
        <Route element={<PrivateRoute allowedRoles={["student"]} />}>
          <Route path="/userdashboard" element={<UserDashboard />} />
        
          {/* <Route path="/courses" element={<CoursesPage />} />
          <Route path="/profile" element={<ProfilePage />} /> */}
        </Route>

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
         
          {/* <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} /> */}
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
