import React, { useState, useEffect, useContext } from "react";
import { 
  User, 
  Rocket, 
  LogOut, 
  Settings, 
  Award, 
  FileText, 
  Plus, 
  Check, 
  Edit2, 
  Share2, 
  Briefcase,
  Activity,
  Heart,
  Brain,
  Sun,
  Moon,
  Search,
  Bell,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  Calendar,
  Zap,
  TrendingUp,
  Users,
  Database,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Trash2
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import developerHeroImg from "../assets/dashboard_eng.jpg.png";
import FileUpload from "../components/fileUpload";

const SKILL_OPTIONS = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "Python",
  "Java",
  "C++",
  "UI/UX",
  "Figma",
  "Machine Learning",
  "SQL",
];

const ANALYTICS_DATA = [
  { name: "Revenue", value: "$45,231.89", change: "+20.1% from last month", trend: "up", color: "#2563EB", points: [30, 45, 35, 50, 40, 60, 55, 70] },
  { name: "Active Projects", value: "12", change: "+2 new this week", trend: "up", color: "#7C3AED", points: [10, 8, 12, 11, 13, 12, 14, 12] },
  { name: "Deployments", value: "249", change: "99.8% success rate", trend: "up", color: "#22C55E", points: [120, 140, 110, 160, 180, 210, 230, 249] },
  { name: "Contributors", value: "8", change: "+1 joined recently", trend: "up", color: "#3B82F6", points: [4, 5, 5, 6, 6, 7, 7, 8] },
  { name: "Storage Used", value: "4.2 GB / 10 GB", change: "42.0% capacity", trend: "neutral", color: "#F59E0B", points: [2.1, 2.5, 2.9, 3.2, 3.6, 3.8, 4.0, 4.2] },
 
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData, isLoggedIn, setIsLoggedIn, setUserData } = useContext(AppContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Profile state with default fallbacks
  const [profile, setProfile] = useState({
    name: userData?.name || "Developer",
    email: userData?.email || "developer@fluxora.io",
    bio:userData?.bio || "Full Stack Engineer passionate about constructing high-performance modern web applications.",
    location:userData?.location||  "NA",
    github: userData?.github||"NA",
    linkedin: "linkedin.com/in/developer",
    avatar: "",
    motivation: "I love building scalable web apps and premium UI layouts that wow users.",
    skills: ["React", "Node.js", "MongoDB", "UI/UX"],
    careerGoals: "In 2 years, I want to lead frontend teams and architect enterprise cloud systems.",
    dreamCompany: "Vercel / Stripe",
    favoriteProject: "Fluxora Dashboard Canvas",
    certificates: [
      { name: "AWS Developer Associate", url: "https://credly.com/aws-assoc" },
      { name: "React Advanced Core", url: "https://scrimba.com/react-adv" }
    ],
    resume: "https://drive.google.com/resume"
  });

  // UI state
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState({ ...profile });
  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({ name: "", url: "" });
  const [showResumeUpload, setShowResumeUpload] = useState(false);

  // Sync profile details with AppContext when userData loads
  useEffect(() => {
    if (userData) {
      setProfile(prev => ({
        ...prev,
        name: userData.name,
        email: userData.email
      }));
      setForm(prev => ({
        ...prev,
        name: userData.name,
        email: userData.email
      }));
    }
  }, [userData]);

  // Load from localStorage on mount for persistence
  useEffect(() => {
    const saved = localStorage.getItem("dev_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (userData) {
          parsed.name = userData.name;
          parsed.email = userData.email;
        }
        setProfile(parsed);
        setForm(parsed);
      } catch (e) {
        console.error("Failed to parse saved profile:", e);
      }
    }
  }, [userData]);

  const saveProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem("dev_profile", JSON.stringify(newProfile));
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    saveProfile(form);
    setEditMode(false);
    toast.success("Profile updated successfully!");
  };

  const handleSkillToggle = (skill) => {
    const updatedSkills = profile.skills.includes(skill)
      ? profile.skills.filter((s) => s !== skill)
      : [...profile.skills, skill];
    
    const updated = { ...profile, skills: updatedSkills };
    saveProfile(updated);
    setForm(updated);
  };

  const handleAddCert = () => {
    if (!certForm.name.trim() || !certForm.url.trim()) {
      toast.error("Please enter both certificate title and verification URL");
      return;
    }
    const updatedCertificates = [...(profile.certificates || []), { name: certForm.name.trim(), url: certForm.url.trim() }];
    const updated = { ...profile, certificates: updatedCertificates };
    saveProfile(updated);
    setForm(updated);
    setCertForm({ name: "", url: "" });
    setShowCertForm(false);
    toast.success("Certificate added successfully!");
  };

  const handleRemoveCert = (url) => {
    const updatedCertificates = (profile.certificates || []).filter((c) => c.url !== url);
    const updated = { ...profile, certificates: updatedCertificates };
    saveProfile(updated);
    setForm(updated);
    toast.info("Certificate removed");
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserData(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Portfolio link copied to clipboard!");
  };

  return (
    <div className={`min-h-screen font-inter antialiased transition-colors duration-300 ${
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-slate-900"
    }`}>
      
      {/* Background blurred glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[400px] left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Main Grid Wrapper */}
      <div className="flex relative z-10 max-w-[1440px] mx-auto min-h-screen">
        
        {/* SIDEBAR (280px Width) */}
        <aside className={`w-[280px] shrink-0 border-r flex flex-col justify-between p-6 transition-colors duration-300 hidden lg:flex ${
          isDarkMode ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-white"
        }`}>
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/10">
                <Rocket size={20} />
              </div>
              <span className="font-extrabold text-lg tracking-tight font-outfit">
                Fluxora
              </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1.5">
              {[
                { id: "overview", label: "Overview", icon: Layers },
                { id: "analytics", label: "Analytics Space", icon: Activity },
                { id: "credentials", label: "Qualifications", icon: Award },
                { id: "profile", label: "Profile Settings", icon: User }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                      : isDarkMode
                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="flex flex-col gap-3">
            {/* App State Card */}
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Subscription</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-green-500/10 text-green-500 border border-green-500/20">Pro Tier</span>
              </div>
              <p className="text-xs font-semibold">Enterprise Sandbox</p>
            </div>

            <button 
              onClick={handleLogout}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                isDarkMode 
                  ? "border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900"
                  : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LogOut size={16} />
              Logout Session
            </button>
          </div>
        </aside>

        {/* MAIN CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* TOP NAVBAR (72px Height) */}
          <header className={`h-[72px] border-b flex items-center justify-between px-6 md:px-8 transition-colors duration-300 ${
            isDarkMode ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white/80"
          } backdrop-blur-md sticky top-0 z-30`}>
            
            {/* Search Input */}
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search projects, deployments, resources..."
                className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all ${
                  isDarkMode 
                    ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600"
                }`}
              />
            </div>
            
            {/* Action Group */}
            <div className="flex items-center gap-3 ml-auto md:ml-0">
              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-yellow-400" : "bg-white border-slate-200 text-slate-600"
                }`}
                title="Toggle Mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notification Badge */}
              <button 
                className={`p-2.5 rounded-xl border transition-colors relative ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
              </button>

              {/* Mini User Tag */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {profile.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-tight">{profile.name}</p>
                  <p className="text-[10px] text-slate-500 leading-none">{profile.email}</p>
                </div>
              </div>
            </div>
          </header>

          {/* MAIN CONTENT SPACE (Responsive 12-Column Grid) */}
          <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
            
            {/* HERO BANNER SECTION (Premium Developer Backdrop) */}
            <section className={`relative rounded-3xl border overflow-hidden transition-all duration-300 p-8 md:p-10 flex flex-col justify-between min-h-[380px] ${
              isDarkMode 
                ? "bg-slate-900/60 border-slate-800 shadow-2xl" 
                : "bg-white border-slate-200 shadow-xl shadow-slate-100/50"
            }`}>
              
              {/* Blur gradient glow specifically on the hero */}
              <div className="absolute top-0 right-0 w-[400px] h-[100%] bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none z-0" />
              
              {/* Developer Cutout Image Overlay (Right Aligned, Masked Blend) */}
              <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-[80%] md:h-[95%] pointer-events-none z-10 hidden md:block overflow-hidden">
                <div className="w-full h-full relative">
                  <img 
                    src={developerHeroImg} 
                    alt="Workspace Developers Layout Reference" 
                    className="w-full h-full object-contain object-bottom select-none drop-shadow-[0_8px_24px_rgba(37,99,235,0.15)]"
                  />
                  {/* Radial Fade Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${
                    isDarkMode ? "from-slate-900" : "from-white"
                  }`} />
                  <div className={`absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r ${
                    isDarkMode ? "from-slate-900" : "from-white"
                  }`} />
                </div>
              </div>

              {/* Hero Context Area */}
              <div className="relative z-20 max-w-xl flex flex-col justify-between h-full gap-8">
                <div>
                  {/* Status Pills */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-blue-600/10 text-blue-600 border border-blue-600/20">
                    <Sparkles size={12} />
                    <span>Workspace Dashboard Canvas</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight font-outfit mb-4">
                    Architecting the <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Future</span> of Code
                  </h2>

                  <p className={`text-sm md:text-base leading-relaxed ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}>
                    Manage, compile, and deploy enterprise applications instantly. Attach your developer resume details or connect strategies for direct visual feedback.
                  </p>
                </div>

                {/* Hero CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                  >
                    Configure Profile
                  </button>
                  <button 
                    onClick={handleShare}
                    className={`px-5 py-3 border font-semibold text-sm rounded-xl transition-colors active:scale-[0.98] ${
                      isDarkMode 
                        ? "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900" 
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Share Workspace
                  </button>
                </div>
              </div>
            </section>

            {/* CONDITIONAL RENDER BY ACTIVE TABS */}
            
            {activeTab === "overview" && (
              <>
                {/* 1. ANALYTICS SPACE (6 Metric Cards Grid) */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ANALYTICS_DATA.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[160px] ${
                        isDarkMode 
                          ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700" 
                          : "bg-white border-slate-200/80 hover:border-blue-200 shadow-sm shadow-slate-100"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                            isDarkMode ? "text-slate-500" : "text-slate-400"
                          }`}>{item.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            item.trend === "up" 
                              ? "bg-green-500/10 text-green-500" 
                              : item.trend === "warning" 
                              ? "bg-red-500/10 text-red-500" 
                              : "bg-amber-500/10 text-amber-500"
                          }`}>{item.change}</span>
                        </div>
                        <h3 className="text-2xl font-bold font-outfit">{item.value}</h3>
                      </div>

                      {/* Sparkline Canvas (SVG Path representation) */}
                      <div className="w-full h-10 mt-3 overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <path
                            d={`M 0 ${30 - item.points[0]} L 14 ${30 - item.points[1]} L 28 ${30 - item.points[2]} L 42 ${30 - item.points[3]} L 56 ${30 - item.points[4]} L 70 ${30 - item.points[5]} L 84 ${30 - item.points[6]} L 100 ${30 - item.points[7]}`}
                            fill="none"
                            stroke={item.color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d={`M 0 30 L 0 ${30 - item.points[0]} L 14 ${30 - item.points[1]} L 28 ${30 - item.points[2]} L 42 ${30 - item.points[3]} L 56 ${30 - item.points[4]} L 70 ${30 - item.points[5]} L 84 ${30 - item.points[6]} L 100 ${30 - item.points[7]} L 100 30 Z`}
                            fill={`url(#gradient-${idx})`}
                          />
                          <defs>
                            <linearGradient id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={item.color} stopOpacity="0.2"/>
                              <stop offset="100%" stopColor={item.color} stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  ))}
                </section>

                {/* 2. CHARTS AREA (Performance & Analytics Split Columns) */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Performance Chart (Left Col - Spans 2) */}
                  <div className={`p-6 rounded-2xl border lg:col-span-2 flex flex-col justify-between ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-base font-bold font-outfit">Deployment Metrics Analytics</h4>
                        <p className="text-xs text-slate-500">Average response times & success distributions</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"/>Average</span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"/>Peak load</span>
                      </div>
                    </div>

                    {/* SVG Analytics Chart Representation */}
                    <div className="w-full h-48 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 500 150">
                        {/* Grids */}
                        <line x1="0" y1="30" x2="500" y2="30" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3"/>
                        <line x1="0" y1="75" x2="500" y2="75" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3"/>
                        <line x1="0" y1="120" x2="500" y2="120" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3"/>
                        
                        {/* Area Gradient Blue */}
                        <path d="M0,150 L0,120 L71,110 L142,80 L213,95 L284,50 L355,70 L426,45 L500,30 L500,150 Z" fill="url(#blue-area)" opacity="0.15"/>
                        {/* Line Blue */}
                        <path d="M0,120 L71,110 L142,80 L213,95 L284,50 L355,70 L426,45 L500,30" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"/>
                        
                        {/* Line Purple */}
                        <path d="M0,140 L71,130 L142,110 L213,85 L284,70 L355,55 L426,30 L500,15" fill="none" stroke="#7C3AED" strokeWidth="2" strokeDasharray="4" strokeLinecap="round"/>
                        
                        <defs>
                          <linearGradient id="blue-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="1"/>
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    <div className="flex items-center justify-between border-t dark:border-slate-800 pt-4 mt-4 text-[10px] text-slate-500 font-semibold">
                      <span>MON</span>
                      <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                      <span>SAT</span>
                      <span>SUN</span>
                    </div>
                  </div>

                  {/* API Donut Chart (Right Col - Spans 1) */}
                  <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div>
                      <h4 className="text-base font-bold font-outfit">Resource Partition</h4>
                      <p className="text-xs text-slate-500">Resource capacity load metrics</p>
                    </div>

                    {/* Donut Chart representation */}
                    <div className="flex items-center justify-center py-4 relative">
                      <svg width="120" height="120" viewBox="0 0 36 36" className="rotate-[-90deg]">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="3"/>
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="45 55" strokeDashoffset="100"/>
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7C3AED" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="55"/>
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22C55E" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="25"/>
                      </svg>
                      <div className="absolute text-center">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Allocated</p>
                        <p className="text-xl font-bold font-outfit">84.2%</p>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"/>Compute Instance</span>
                        <span className="font-bold text-slate-700 dark:text-slate-350">45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"/>Static Storage</span>
                        <span className="font-bold text-slate-700 dark:text-slate-350">30%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"/>Database Cache</span>
                        <span className="font-bold text-slate-700 dark:text-slate-350">25%</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. RECENT PROJECTS & ACTIVITY SPLIT */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Recent Projects Table (Left Col - Spans 2) */}
                  <div className={`p-6 rounded-2xl border lg:col-span-2 overflow-x-auto ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-base font-bold font-outfit">Recent Active Projects</h4>
                        <p className="text-xs text-slate-500">Staged repositories and deployment statuses</p>
                      </div>
                      <button className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400`}>
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b dark:border-slate-800 text-slate-400 font-semibold">
                          <th className="pb-3 pr-4">Project Name</th>
                          <th className="pb-3 pr-4">Framework</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3 text-right">Commit Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-slate-800/60">
                        {[
                          { name: "Fluxora Dashboard Canvas", framework: "Next.js + Tailwind", status: "Success", time: "2 mins ago" },
                          { name: "Job Scraper Microservice", framework: "Node.js + Puppeteer", status: "Running", time: "1 hr ago" },
                          { name: "AI Resume Analyzer", framework: "Python + Gemini", status: "Failed", time: "Yesterday" }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                            <td className="py-3.5 pr-4 font-bold text-slate-800 dark:text-slate-200">{row.name}</td>
                            <td className="py-3.5 pr-4 text-slate-500">{row.framework}</td>
                            <td className="py-3.5 pr-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                row.status === "Success" 
                                  ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                                  : row.status === "Failed" 
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                                  : "bg-blue-500/10 text-blue-600 border border-blue-600/20"
                              }`}>
                                {row.status === "Success" && <CheckCircle2 size={10} />}
                                {row.status === "Failed" && <XCircle size={10} />}
                                {row.status === "Running" && <Activity size={10} className="animate-pulse" />}
                                {row.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right text-slate-500 font-mono">{row.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Activity Timeline & Team (Right Col - Spans 1) */}
                  <div className={`p-6 rounded-2xl border flex flex-col gap-6 ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    
                    {/* Team Members */}
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Core Team</h4>
                      {/*we have to make this As per the Assigned Projects*/ }
                      <div className="space-y-3">
                        {[
                          { name: "Abhishek Chauhan", role: "Principal Engineer", online: true },
                          { name: "Clara Smith", role: "AI Researcher", online: true },
                          { name: "Marcus Doe", role: "Product Designer", online: false }
                        ].map((member, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative w-8 h-8 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center font-bold text-xs text-blue-600">
                                {member.name.charAt(0)}
                                {member.online && (
                                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                )}
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold leading-tight">{member.name}</p>
                                <p className="text-[10px] text-slate-500 leading-none">{member.role}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-semibold">{member.online ? "Online" : "Away"}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="border-t dark:border-slate-800 pt-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Recent Events</h4>
                      <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200 dark:before:bg-slate-800 pl-6">
                        {[
                          { title: "Deployed to production", desc: "Production pipeline completed successfully", time: "10m ago", icon: CheckCircle2, color: "text-green-500" },
                          { title: "API quota threshold", desc: "API usage reached 98.4%", time: "1h ago", icon: AlertTriangle, color: "text-red-500" }
                        ].map((evt, i) => (
                          <div key={i} className="relative text-left">
                            <div className="absolute -left-[29px] top-0.5 p-0.5 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                              <evt.icon size={11} className={evt.color} />
                            </div>
                            <p className="text-xs font-bold leading-tight">{evt.title}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{evt.desc}</p>
                            <span className="text-[9px] font-mono text-slate-500 block mt-1">{evt.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </section>
              </>
            )}

            {/* TAB: ANALYTICS SPACE (Details / Dynamic Interactive Charts) */}
            {activeTab === "analytics" && (
              <section className={`p-6 rounded-2xl border ${
                isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <h3 className="text-lg font-bold font-outfit mb-4 text-blue-600">Enterprise Metrics & Integration Tools</h3>
                <p className="text-sm text-slate-500 mb-6">Verify system configurations, manage tokens, and view interactive load curves.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Controls Card */}
                  <div className={`p-5 rounded-xl border ${
                    isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Actions Gateway</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-[0.98]">
                        <Zap size={14} /> Deploy Branch
                      </button>
                      <button className="flex items-center justify-center gap-2 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-[0.98]">
                        <Plus size={14} /> Add Project
                      </button>
                      <button className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-xs font-semibold transition ${
                        isDarkMode ? "border-slate-800 hover:bg-slate-900" : "border-slate-200 hover:bg-slate-100"
                      }`}>
                        Invite Member
                      </button>
                      <button className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-xs font-semibold transition ${
                        isDarkMode ? "border-slate-800 hover:bg-slate-900" : "border-slate-200 hover:bg-slate-100"
                      }`}>
                        API Manager
                      </button>
                    </div>
                  </div>

                  {/* Right Status Card */}
                  <div className={`p-5 rounded-xl border ${
                    isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                   
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Database Server</span>
                        <span className="font-bold text-green-500">Connected</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SMTP Service</span>
                        <span className="font-bold text-green-500">Operational</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Storage Bucket</span>
                        <span className="font-bold text-amber-500">84.2% Capacity</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Google OAuth Endpoint</span>
                        <span className="font-bold text-green-500">Configured</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* TAB: QUALIFICATIONS (Certificates & Resume) */}
            {activeTab === "credentials" && (
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Resume Upload Column */}
                <div className={`p-6 rounded-2xl border lg:col-span-2 flex flex-col gap-5 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div>
                    <h4 className="text-base font-bold font-outfit">Resume Document Portfolio</h4>
                    <p className="text-xs text-slate-500 mt-1">Stage and upload your resume for ATS-optimization and profile sync</p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-600">
                        <FileText size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold leading-tight">Current Portfolio Resume</p>
                        <p className="text-[10px] text-slate-500 leading-none mt-1 truncate max-w-[280px]">
                          {profile.resume ? profile.resume : "No document linked yet."}
                        </p>
                      </div>
                    </div>
                    {profile.resume && (
                      <a href={profile.resume} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                        View <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  <button 
                    onClick={() => setShowResumeUpload(!showResumeUpload)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
                  >
                    {showResumeUpload ? "Cancel Upload" : "Link Staged Resume File"}
                  </button>

                  {showResumeUpload && (
                    <div className="p-4 rounded-xl border border-dashed dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 animate-in fade-in duration-200">
                      <FileUpload onUploadSuccess={(url) => {
                        const updated = { ...profile, resume: url };
                        saveProfile(updated);
                        setForm(updated);
                        setShowResumeUpload(false);
                        toast.success("Resume linked to user profile successfully!");
                      }} />
                    </div>
                  )}
                </div>

                {/* Certificates Column */}
                <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Qualifications</h4>
                    <p className="text-xs text-slate-500 mt-1">Manage verify credentials</p>
                  </div>

                  {/* Certifications Map */}
                  <div className="space-y-3">
                    {(profile.certificates || []).map((cert, index) => (
                      <div key={index} className="p-3.5 rounded-xl border dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-950/20">
                        <div>
                          <p className="font-bold">{cert.name}</p>
                          <a href={cert.url} target="_blank" rel="noreferrer" className="text-blue-600 text-[10px] hover:underline mt-1 inline-block">Verify Link</a>
                        </div>
                        <button onClick={() => handleRemoveCert(cert.url)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Cert Form inline */}
                  {showCertForm ? (
                    <div className="p-4 rounded-xl border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col gap-2.5">
                      <input 
                        placeholder="Certificate Title" 
                        value={certForm.name}
                        onChange={e => setCertForm({ ...certForm, name: e.target.value })}
                        className={`p-2.5 text-xs rounded-lg border ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`}
                      />
                      <input 
                        placeholder="Credential URL" 
                        value={certForm.url}
                        onChange={e => setCertForm({ ...certForm, url: e.target.value })}
                        className={`p-2.5 text-xs rounded-lg border ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`}
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={handleAddCert} className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold">Save</button>
                        <button onClick={() => setShowCertForm(false)} className="px-3.5 py-1.5 border rounded-lg text-xs font-semibold">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowCertForm(true)} 
                      className="w-full py-2.5 border rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                    >
                      + Add Certificate
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* TAB: PROFILE & SETTINGS */}
            {activeTab === "profile" && (
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Edit General Info (Left Col - Spans 2) */}
                <div className={`p-6 rounded-2xl border lg:col-span-2 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <h4 className="text-base font-bold font-outfit mb-4">Edit Profile Metadata</h4>
                  
                  <form onSubmit={handleSaveGeneral} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Username / Full Name</label>
                      <input 
                        name="name" 
                        value={form.name} 
                        onChange={handleInputChange} 
                        className={`p-2.5 rounded-lg border ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`} 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Location</label>
                      <input 
                        name="location" 
                        value={form.location} 
                        onChange={handleInputChange} 
                        className={`p-2.5 rounded-lg border ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`} 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">GitHub Profile URL</label>
                      <input 
                        name="github" 
                        value={form.github} 
                        onChange={handleInputChange} 
                        className={`p-2.5 rounded-lg border ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`} 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">LinkedIn Profile URL</label>
                      <input 
                        name="linkedin" 
                        value={form.linkedin} 
                        onChange={handleInputChange} 
                        className={`p-2.5 rounded-lg border ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`} 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="font-bold text-slate-500 uppercase">Biography</label>
                      <textarea 
                        name="bio" 
                        value={form.bio} 
                        onChange={handleInputChange} 
                        rows="3"
                        className={`p-2.5 rounded-lg border w-full resize-none ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`} 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="font-bold text-slate-500 uppercase">Motivation</label>
                      <textarea 
                        name="motivation" 
                        value={form.motivation} 
                        onChange={handleInputChange} 
                        rows="2"
                        className={`p-2.5 rounded-lg border w-full resize-none ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`} 
                      />
                    </div>

                    <div className="md:col-span-2 flex gap-2 justify-end mt-2">
                      <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">Save Settings</button>
                    </div>
                  </form>
                </div>

                {/* Skills configuration (Right Col - Spans 1) */}
                <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Interests & Skills</h4>
                    <p className="text-xs text-slate-500 mt-1">Select topics to spotlight on your profile</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map((skill) => {
                      const isActive = profile.skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          onClick={() => handleSkillToggle(skill)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                            isActive 
                              ? "bg-blue-600 text-white border-blue-600 shadow" 
                              : isDarkMode 
                              ? "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700" 
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}