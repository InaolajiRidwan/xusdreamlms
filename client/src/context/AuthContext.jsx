import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // AuthContext.jsx - FIX THIS
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/v1/auth/refresh-token", {
          withCredentials: true,
        });
        console.log(res.data)

        setAuth({
          accessToken: res.data.accessToken,
          role: res.data.user.role,
          fullName: res.data.user.fullName
        });
      } catch (error) {
        // console.error(
        //   "Auth error:",
        //   error.response?.status,
        //   error.response?.data || error.message
        // );
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/auth/logout", {}, { withCredentials: true });

      setAuth(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
