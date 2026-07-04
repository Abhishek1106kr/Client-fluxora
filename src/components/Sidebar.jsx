import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, User, Key, Heart } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { isLoggedIn, userData, setIsLoggedIn, setUserData, backendUrl } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/logout`);
      if (res.data.success) {
        toast.success(res.data.message || "Logged out successfully!");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsLoggedIn(false);
    setUserData(null);
    toggleSidebar();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="profile-placeholder flex items-center justify-center bg-emerald-600/10 text-emerald-400 font-extrabold text-xl rounded-full w-16 h-16 border-2 border-emerald-500/30">
          {userData ? userData.name.charAt(0).toUpperCase() : <User size={32} className="profile-icon" />}
        </div>
        <h3>{userData ? userData.name : "Guest"}</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/profile" className="nav-link" onClick={toggleSidebar}>
              <User size={20} />
              <span>Profile Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/settings/password" className="nav-link" onClick={toggleSidebar}>
              <Key size={20} />
              <span>Change Password</span>
            </Link>
          </li>
          <li>
            <Link to="/settings/preferences" className="nav-link" onClick={toggleSidebar}>
              <Settings size={20} />
              <span>Preferences</span>
            </Link>
          </li>
          <li>
            <Link to="/settings/support" className="nav-link" onClick={toggleSidebar}>
              <Heart size={20} />
              <span>Support</span>
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <button onClick={handleLogout} className="logout-button">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 