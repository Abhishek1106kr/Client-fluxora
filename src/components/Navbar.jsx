import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Rocket, LogOut, LayoutDashboard, Zap, ShieldCheck } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify"; 
import DropDown from "./DropDown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, userData, setIsLoggedIn, setUserData, backendUrl } = useContext(AppContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    localStorage.removeItem("role");
    setShowDropdown(false);
    navigate("/login");
  };

  const handleSendVerifyOtp = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
      if (res.data.success) {
        toast.success("OTP sent to your email!");
        navigate("/emailVerification");
      } else {
        toast.error(res.data.message || "Failed to send verification OTP.");
      }
    } catch (err) {
      console.error("Verification OTP error:", err);
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    }
    setShowDropdown(false);
  };

  // const viewOptions=[
  //   {label:"Overview Panel",value:"overview",targetPath:"/dashboard"},
  //   {label:"All Courses",value:"allCourses",targetPath:"/courses"},
  //   {label:"Learning Path",value:"learningPath",targetPath:"/learning-path"},
  //   {label:"Mock Interview",value:"mockInterview",targetPath:"/mock-interview"}
  // ]
  const navLinks = [
    { label: "Home", path: "/mainpage" },
    // { label: "DevLaunch", path: "/devlaunch" },
    { label: "Jobs", path: "/job" },
    {label:"Projects",path:"/projects"},
    { label: "Startups", path: "/startups" },
    { label: "Interview Prep", path: "/interviewPreparation" },
    { label: "Resume Prep", path: "/resumePreparation" },
  ];

  const isActive = (path) => {
    if (path === "/mainpage" && location.pathname === "/") return true;
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/mainpage" className="flex items-center gap-2 group transition">
            <div className="flex items-center justify-center p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all">
              <Rocket size={18} className="text-emerald-500 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-outfit font-bold text-lg tracking-tight text-zinc-50">
              Flux<span className="text-emerald-500">ora</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.dropDown ? (
                <DropDown 
                  key={link.path}
                  options={link.dropDownOptions}
                  placeholder={link.label}
                />
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "text-emerald-400 bg-emerald-500/5 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* User Profile / Auth Area */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && userData ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-600/10 border-2 border-emerald-500/30 hover:border-emerald-500/80 text-emerald-400 font-bold flex items-center justify-center text-sm transition-all duration-200 shadow-sm">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 z-50 transform scale-100 origin-top-right transition-all">
                    <div className="flex items-center gap-2.5 p-2.5 border-b border-zinc-800/60 mb-1">
                      <div className="w-9 h-9 rounded-full bg-zinc-850 text-emerald-400 font-bold flex items-center justify-center border border-zinc-800 shrink-0">
                        {userData.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-zinc-200 truncate">{userData.name}</div>
                        <div className="text-xs text-zinc-500 truncate">{userData.email}</div>
                      </div>
                    </div>

                    {!userData.isAccountVerified && (
                      <button
                        onClick={handleSendVerifyOtp}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition-colors text-left"
                      >
                        <ShieldCheck size={16} />
                        Verify Account
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/dashboard");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <LayoutDashboard size={16} />
                      Go to Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        const role = localStorage.getItem("role");
                        navigate(role === "startup" ? "/devlaunch/startup" : "/devlaunch/dev-dashboard");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <Zap size={16} />
                      DevLaunch Hub
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>

                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm shadow-emerald-950/10 active:scale-[0.98]"
                >
                  Sign Up
                </Link>
               
                <Link to="/startupLogin" className=' px-3.5 py-1.5 text-base font-mediium opacity-80 text-zinc-400 hover:opacity-100 transition-colors hover:text-blue-200'>
                 {"|      " }Startups
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isLoggedIn && userData && (
              <button
                onClick={() => navigate("/dashboard")}
                className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-400 font-bold flex items-center justify-center border border-zinc-800"
              >
                {userData.name.charAt(0).toUpperCase()}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-900 bg-zinc-950 px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            link.dropDown ? (
              <div key={link.path} className="px-3 py-1">
                <DropDown 
                  options={link.dropDownOptions}
                  placeholder={link.label}
                />
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-emerald-400 bg-emerald-500/5 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            )
          ))}
          {!isLoggedIn && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-zinc-900">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-3 py-2 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
              <Link to="/startupLogin" onClick={()=>{setIsOpen(false)}}
              className="flex items-center justify-center px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
              Startups
              </Link>
            </div>
            
            
          )}
          {isLoggedIn && userData && (
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-zinc-900">
              {!userData.isAccountVerified && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSendVerifyOtp();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-amber-900/40 bg-amber-950/10 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-500/10 transition-colors"
                >
                  <ShieldCheck size={16} />
                  Verify Account
                </button>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-zinc-900/60 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
