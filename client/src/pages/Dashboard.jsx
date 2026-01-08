import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 1. Map state directly to your data keys: fullName and role
  const [user, setUser] = useState({ 
    fullName: localStorage.getItem("fullName") || "User", 
    role: localStorage.getItem("role") || "student" 
  });

  const baseURL = "http://localhost:8080/api/v1";

  const authenticatedRequest = async (url) => {
    let token = localStorage.getItem("accessToken");
    try {
      return await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
    } catch (err) {
      if (err.response?.status === 401) {
        const refreshRes = await axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true });
        const newToken = refreshRes.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        return await axios.get(url, {
          headers: { Authorization: `Bearer ${newToken}` },
          withCredentials: true
        });
      }
      throw err;
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await authenticatedRequest(`${baseURL}/courses/get-all-course`);
      
      // Update courses from your 'allProductduct' key
      setCourses(response.data.allProductduct || []);

      // 2. Critical: Sync the role and fullName from the login/session response
      if (response.data.user) {
        const { fullName, role } = response.data.user;
        setUser({ fullName, role });
        localStorage.setItem("role", role);
        localStorage.setItem("fullName", fullName);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 3. Helper variable for cleaner conditional rendering
  const isAdmin = user.role === 'admin';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <ToastContainer />
      
      {/* SIDEBAR: Changes color based on role */}
      <aside className={`w-72 text-white flex flex-col transition-colors duration-500 ${isAdmin ? 'bg-rose-950' : 'bg-indigo-950'}`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${isAdmin ? 'bg-rose-500' : 'bg-indigo-500'}`}>
              {isAdmin ? 'A' : 'S'}
            </div>
            <span className="text-xl font-bold tracking-tight">{isAdmin ? 'Admin Portal' : 'Student Hub'}</span>
          </div>
          
          <nav className="space-y-2">
            <NavItem label="Dashboard" icon="📊" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            {isAdmin ? (
               <>
                 <NavItem label="Product Management" icon="📦" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                 <NavItem label="User Control" icon="🛡️" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
               </>
            ) : (
               <>
                 <NavItem label="My Learning" icon="📖" active={activeTab === 'learning'} onClick={() => setActiveTab('learning')} />
                 <NavItem label="Explore Store" icon="🛍️" active={activeTab === 'store'} onClick={() => setActiveTab('store')} />
               </>
            )}
          </nav>
        </div>
        <button onClick={handleLogout} className="mt-auto p-8 text-left text-slate-400 hover:text-white transition-colors border-t border-white/10">
          Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome, {user.fullName}</h1>
            <p className="text-sm text-slate-500">Accessing as <span className="font-bold underline">{user.role}</span></p>
          </div>
          
          {/* Dynamic Profile Section */}
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${isAdmin ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {user.role} Mode
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold shadow-md ${isAdmin ? 'bg-rose-500' : 'bg-indigo-500'}`}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-10 max-w-6xl mx-auto">
          {/* STATS: Different stats for Admin vs Student */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {isAdmin ? (
               <>
                 <StatBox label="Total Stock" value={courses.length} color="text-rose-600" />
                 <StatBox label="System Revenue" value="$8.4k" color="text-slate-800" />
                 <StatBox label="Total Signups" value="241" color="text-slate-800" />
               </>
            ) : (
               <>
                 <StatBox label="Courses Owned" value={courses.length} color="text-indigo-600" />
                 <StatBox label="Study Streak" value="5 Days" color="text-slate-800" />
                 <StatBox label="Rewards" value="12" color="text-slate-800" />
               </>
            )}
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">{isAdmin ? "Manage All Products" : "Your Library"}</h2>
            <button onClick={fetchDashboardData} className="text-indigo-600 font-bold text-sm">Refresh</button>
          </div>

          {loading ? (
             <div className="h-64 flex items-center justify-center">
               <div className={`w-10 h-10 border-4 border-slate-200 rounded-full animate-spin ${isAdmin ? 'border-t-rose-500' : 'border-t-indigo-500'}`}></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {courses.length > 0 ? (
                 courses.map(course => (
                   <div key={course._id} className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                      <div className="h-40 bg-slate-100 rounded-2xl mb-4 overflow-hidden">
                        <img src={course.image} className="w-full h-full object-cover" alt="product" />
                      </div>
                      <h3 className="font-bold text-slate-800 px-2">{course.title || course.name}</h3>
                      <p className="text-xs text-slate-400 px-2 mb-4">{course.category || "General"}</p>
                      
                      {/* CONDITIONAL ACTION BUTTONS */}
                      <div className="px-2 pb-2">
                        {isAdmin ? (
                           <div className="flex gap-2">
                             <button className="flex-1 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">Edit</button>
                             <button className="flex-1 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold">Delete</button>
                           </div>
                        ) : (
                           <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">
                             Start Learning
                           </button>
                        )}
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="col-span-full py-20 bg-slate-100 rounded-3xl text-center text-slate-400 border-2 border-dashed">
                   No items found in allProductduct
                 </div>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// UI HELPERS
const NavItem = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-semibold ${active ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
    <span>{icon}</span> {label}
  </button>
);

const StatBox = ({ label, value, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{label}</span>
    <span className={`text-3xl font-black ${color}`}>{value}</span>
  </div>
);

export default Dashboard;