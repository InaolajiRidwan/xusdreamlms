import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { auth , handleLogout} = useAuth();


  return (
    <nav className="flex h-20 items-center justify-between p-4 bg-green-400 text-white ">
      <div className="font-bold text-xl">XUSDREAMLMS</div>
      <div>
        {/* FIX: Added the '?' after auth */}
        {auth?.accessToken ? (
          <div className="flex gap-4">
             <span>Welcome, {auth.role}</span>
             <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="border border-white px-4 py-2 rounded">Login</Link>
            <Link to="/signup"  className="bg-white text-green-400 px-4 py-2 rounded">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;