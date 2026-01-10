import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const UserDashboard = () => {
  const { auth, handleLogout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth?.accessToken) return;
      try {
        const res = await axios.get("/api/v1/users/me", {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
          withCredentials: true,
        });

        setProfile(res.data.userDetails);
      } catch (error) {
        console.log("failed to fetch profile", error);
        setError("Failed to fetch profile");
      }
    };
    fetchUser();
  }, [auth]);
  return (
    <div className="container mx-auto mt-10 p-6 ">
      <h2 className="text-2xl font-bold mb-4">USER DASHBOARD</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {profile && (
        <div>
          <h3 className="text-xl font-semibold underline">
            Profile Information
          </h3>
          <p>
            <strong>username: </strong>
            {profile.fullName}
          </p>
          <p>
            <strong>email: </strong>
            {profile.email}
          </p>
          <strong>role: </strong>
          {profile.role}
          <p></p>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="bg-red-800 text-white p-4 rounded-md mt-10"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
