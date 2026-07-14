import React, { useState, useEffect, useContext } from "react";
import { 
  User, 
  Rocket, 
  LogOut, 
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
import ActiveWorkSpace from "../components/ActiveWorkSpace";
import StartupDashboard from "./StartupDashboard";
import Chatbot from "../components/Chatbot";

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
const AVAILABLE_ROLES = [
  // Core Development & Full Stack
  "Full-Stack Developer",
  "Backend Developer (Node.js)",
  "Backend Developer (Python)",
  "Backend Developer (Go / Java)",
  "Frontend Engineer (React / Next.js)",
  "Frontend Engineer (Vue / Angular)",
  
  // Mobile Development
  "Mobile App Developer (React Native)",
  "Mobile App Developer (Flutter)",
  "iOS Engineer (Swift)",
  "Android Engineer (Kotlin)",

  // DevOps, Infrastructure, & Systems
  "DevOps Engineer",
  "Site Reliability Engineer (SRE)",
  "Cloud Infrastructure Architect (AWS/GCP)",
  "Systems Engineer",
  "Database Administrator (DBA)",

  // AI, Machine Learning, & Advanced Tech
  "Machine Learning Engineer",
  "Data Scientist",
  "AI Prompt Engineer & Agent Architect",
  "NLP Engineer",
  "Computer Vision Engineer",
  "Quantum Computing Developer",
  "Data Engineer",

  // Cybersecurity & Networks
  "Cybersecurity Analyst",
  "Penetration Tester / Ethical Hacker",
  "Security Engineer (DevSecOps)",

  // Web3 & Blockchain
  "Blockchain Developer (Solidity)",
  "Smart Contract Auditor",

  // Design, Product, & Quality Assurance
  "UI/UX Designer",
  "Product Designer",
  "Product Manager",
  "QA Automation Engineer",
  "Manual Test Engineer",
  "Technical Writer"
];
export default function Dashboard() {
  const navigate = useNavigate();
  const { backendUrl, userData, isLoggedIn, setIsLoggedIn, setUserData, theme, toggleTheme } = useContext(AppContext);
  const isDarkMode = theme === "dark";
  const base = backendUrl || "http://localhost:5002";
  const token = localStorage.getItem("token");

  // Profile state with default fallbacks
  const [profile, setProfile] = useState({
    name: userData?.name || "Developer",
    email: userData?.email || "developer@fluxora.io",
    bio: userData?.bio || "Full Stack Engineer passionate about constructing high-performance modern web applications.",
    location: userData?.location || "NA",
    github: userData?.github || "NA",
    linkedin: userData?.linkedin || "linkedin.com/in/developer",
    avatar: userData?.avatar || "",
    motivation: userData?.motivation || "I love building scalable web apps and premium UI layouts that wow users.",
    skills: userData?.skills || ["React", "Node.js", "MongoDB", "UI/UX"],
    careerGoals: "In 2 years, I want to lead frontend teams and architect enterprise cloud systems.",
    dreamCompany: "Vercel / Stripe",
    favoriteProject: "Fluxora Dashboard Canvas",
   
    resume: userData?.resume || "",
    aspiration: userData?.aspiration || ""
  });

  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState({ ...profile });
  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({ name: "", url: "" });
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const [activeWorkspaces, setActiveWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [selectedRoles, setSelectedRoles]=useState([]);

  const fetchWorkspaces = async () => {
    setLoadingWorkspaces(true);
    try {
      const res = await fetch(`${base}/api/projectcard/student/workspaces`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const d = await res.json();
      if (res.ok && d.success) {
        if (!d.data || d.data.length === 0) {
          setActiveWorkspaces([
            {
              _id: "demo-workspace-123",
              title: "AI-Powered Technical Resume Reviewer",
              description: "Implement an interactive, AI-driven platform that automatically parses developer resumes, scores them against target jobs, and offers tailored suggestions using the Gemini API.",
              stipend: "$2000 / Month",
              duration: "10 Weeks",
              repositoryUrl: "https://github.com/fluxora/ai-resume-optimizer",
              state: {
                id: "demo-state-123",
                milestones: [
                  {
                    id: "m1",
                    title: "Backend API Setup",
                    description: "Initialize Express, connect mongoose database models, and write mock endpoints.",
                    status: "MERGED",
                    prNumber: 1
                  },
                  {
                    id: "m2",
                    title: "Gemini Integration",
                    description: "Integrate Google Gen AI SDK and construct evaluation system prompts.",
                    status: "UNDER_REVIEW",
                    prNumber: 2
                  },
                  {
                    id: "m3",
                    title: "Resume File Parser",
                    description: "Write resume text extraction service from pdf and docx files.",
                    status: "PENDING",
                    prNumber: null
                  }
                ]
              },
              startupId: {
                companyName: "Acme Startup Labs",
                avatar: "https://randomuser.me/api/portraits/lego/2.jpg"
              }
            }
          ]);
        } else {
          setActiveWorkspaces(d.data);
        }
      }
    } catch (err) {
      console.error("Error loading student workspaces:", err);
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  useEffect(() => {
    if (activeTab === "workspaces" && userData) {
      fetchWorkspaces();
    }
  }, [activeTab, userData]);

  // Redirect if not logged in
  useEffect(() => {
    if (!token && !isLoggedIn) {
      navigate("/login");
    }
  }, [token, isLoggedIn, navigate]);

  // Sync profile details with AppContext when userData loads
  useEffect(() => {
    if (userData) {
      const synced = {
        name: userData.name || "Developer",
        email: userData.email || "",
        bio: userData.bio || "Full Stack Engineer passionate about constructing high-performance modern web applications.",
        location: userData.location || "NA",
        github: userData.github || "NA",
        linkedin: userData.linkedin || "linkedin.com/in/developer",
        avatar: userData.avatar || "",
        motivation: userData.motivation || "I love building scalable web apps and premium UI layouts that wow users.",
        skills: userData.skills || ["React", "Node.js", "MongoDB", "UI/UX"],
        careerGoals: "In 2 years, I want to lead frontend teams and architect enterprise cloud systems.",
        dreamCompany: "Vercel / Stripe",
        favoriteProject: "Fluxora Dashboard Canvas",
      
        resume: userData.resume || "",
        aspiration: userData.aspiration || ""
      };
      setProfile(synced);
      setForm(synced);
    }
  }, [userData]);

  const saveProfile = async (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem("dev_profile", JSON.stringify(newProfile));

    try {
      const res = await fetch(`${base}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: newProfile.name,
          bio: newProfile.bio,
          location: newProfile.location,
          github: newProfile.github,
          linkedin: newProfile.linkedin,
          skills: newProfile.skills,
          motivation: newProfile.motivation,
          avatar: newProfile.avatar,
          resume: newProfile.resume,
          aspiration: newProfile.aspiration
        })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setUserData(d.user);
      }
    } catch (err) {
      console.error("Backend profile sync failed:", err);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    saveProfile(form);
    toast.success("Profile details saved successfully!");
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

  // Render check for startup role
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (userData.role === "startup") {
    return <StartupDashboard />;
  }

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
                { id: "overview", label: "Profile Card", icon: User },
                { id: "edit", label: "Edit Profile", icon: Edit2 },
                { id: "resume", label: "Resume & Credentials", icon: FileText },
                { id: "aspirations", label: "Career Aspirations", icon: Sparkles },
                { id: "workspaces", label: "My Collaborations", icon: Cpu }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedWorkspaceId(null);
                  }}
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
             
              <p className="text-xs font-semibold">Workspace Portfolio</p>
            </div>

            <button 
              onClick={handleLogout}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                isDarkMode 
                  ? "border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900"
                  : "border-slate-200 bg-white text-slate-650 hover:text-slate-900 hover:bg-slate-50"
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
            
            {/* Title display */}
            <div>
              <h1 className="text-lg font-bold font-outfit text-slate-800 dark:text-zinc-50 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Student Profile Space
              </h1>
              <p className="text-[10px] text-slate-505">Manage your skills, certifications, resume and aspirations</p>
            </div>
            
            {/* Action Group */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-yellow-400" : "bg-white border-slate-200 text-slate-650"
                }`}
                title="Toggle Mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notification Badge */}
              <button 
                className={`p-2.5 rounded-xl border transition-colors relative ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-slate-350" : "bg-white border-slate-200 text-slate-650"
                }`}
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
              </button>

              {/* Mini User Tag */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-blue-605/20" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-650/10 border border-blue-600/20 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
               
              </div>
            </div>
          </header>

          {/* MAIN CONTENT SPACE */}
          <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
            
            {/* CONDITIONAL RENDER BY ACTIVE TABS */}

            {/* TAB 1: PROFILE OVERVIEW (Portfolio Card) */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Hero Banner Grid Card */}
                <div className={`p-8 rounded-3xl border overflow-hidden relative ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-l from-blue-600/5 to-transparent pointer-events-none z-0" />
                  
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                    
                    {/* Avatar Container */}
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[3px] shadow-xl">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Profile Avatar" className="w-full h-full object-cover rounded-full bg-slate-900" />
                        ) : (
                          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-slate-200 font-extrabold text-4xl">
                            {profile.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => setActiveTab("edit")} 
                        className="absolute bottom-1 right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                        title="Upload Avatar"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>

                    {/* Basic Info Area */}
                    <div className="flex-1 text-center md:text-left space-y-3">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <h2 className="text-3xl font-extrabold font-outfit text-slate-900 dark:text-white leading-tight">
                          {profile.name}
                        </h2>
                        {profile.aspiration && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/10 text-blue-500 border border-blue-600/20 animate-pulse">
                            {profile.aspiration}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
                        {profile.bio}
                      </p>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold pt-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          {profile.email}
                        </span>
                        {profile.location && profile.location !== "NA" && (
                          <span>📍 {profile.location}</span>
                        )}
                      </div>

                      {/* Social/Career Button Row */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                        {profile.github && profile.github !== "NA" && (
                          <a 
                            href={profile.github.startsWith("http") ? profile.github : `https://${profile.github}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`px-4 py-2 border rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                              isDarkMode ? "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            GitHub
                          </a>
                        )}
                        {profile.linkedin && profile.linkedin !== "NA" && (
                          <a 
                            href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`px-4 py-2 border rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                              isDarkMode ? "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900" : "border-slate-200 bg-white text-slate-650 hover:bg-slate-50"
                            }`}
                          >
                            LinkedIn
                          </a>
                        )}

                        {profile.resume ? (
                          <a 
                            href={profile.resume} 
                            target="_blank" 
                            rel="noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition"
                          >
                            <FileText size={14} /> View Resume
                          </a>
                        ) : (
                          <button 
                            onClick={() => setActiveTab("resume")}
                            className="px-4 py-2 border border-dashed border-blue-500/40 text-blue-500 hover:bg-blue-600/5 rounded-xl text-xs font-bold transition"
                          >
                            + Upload Resume
                          </button>
                        )}
                        <button 
                          onClick={handleShare}
                          className={`p-2.5 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-405 transition`}
                        >
                          <Share2 size={14} />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Info Split Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Aspiration Summary */}
                  <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-blue-600" size={18} />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Professional Aspiration</h3>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Target Role</p>
                        <p className="text-sm font-bold mt-1">{profile.aspiration || "Not Specified"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-450">Motivation</p>
                        <p className="text-xs mt-1 leading-relaxed text-slate-500">{profile.motivation || "Not Specified"}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setActiveTab("aspirations")}
                      className="mt-6 w-full py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 font-semibold rounded-xl text-xs transition"
                    >
                      Update Aspirations
                    </button>
                  </div>

                  {/* Middle Skills Box */}
                  <div className={`p-6 rounded-2xl border ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="text-blue-600" size={18} />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Skills & Expertise</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                          <span 
                            key={skill}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                              isDarkMode ? "border-slate-800 bg-slate-950 text-slate-400" : "border-slate-200 bg-slate-100 text-slate-650"
                            }`}
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-slate-505">No skills selected. Customize in settings.</p>
                      )}
                    </div>
                  </div>

                  {/* Right Qualifications Box */}
                  <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="text-blue-600" size={18} />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Verified Qualifications</h3>
                      </div>
                      <div className="space-y-3">
                        {(profile.certificates || []).slice(0, 3).map((cert, index) => (
                          <div key={index} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-100/50 dark:bg-slate-950/20 border dark:border-slate-800">
                            <span className="font-bold text-slate-850 dark:text-zinc-200">{cert.name}</span>
                            <a href={cert.url} target="_blank" rel="noreferrer" className="text-blue-600 text-[10px] hover:underline flex items-center gap-0.5">
                              Verify <ExternalLink size={10} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab("resume")}
                      className="mt-6 w-full py-2.5 border dark:border-slate-800 text-slate-600 hover:bg-slate-55 dark:hover:bg-slate-900 dark:text-slate-400 font-semibold rounded-xl text-xs transition"
                    >
                      Manage Qualifications
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: EDIT PROFILE */}
            {activeTab === "edit" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                
                {/* General Info edit form */}
                <div className={`p-6 rounded-2xl border lg:col-span-2 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <h3 className="text-base font-bold font-outfit mb-4">Edit Profile details</h3>
                  
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
                        required
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

                    <div className="md:col-span-2 flex gap-2 justify-end mt-2">
                      <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/10">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* Profile Picture Uploader & Skill tags */}
                <div className="flex flex-col gap-6">
                  
                  {/* Photo Edit */}
                  <div className={`p-6 rounded-2xl border ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Profile Photo</h4>
                    
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-800 border-2 border-blue-600">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-350">
                            {profile.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                        className="px-3.5 py-1.5 border border-dashed text-xs rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 text-blue-500"
                      >
                        {showAvatarUpload ? "Cancel Upload" : "Upload New Photo"}
                      </button>

                      {showAvatarUpload && (
                        <div className="w-full animate-in fade-in duration-200">
                          <FileUpload 
                            accept=".png,.jpg,.jpeg,.webp"
                            label="Click to upload profile photo"
                            allowedTypesText="Supports PNG, JPG, or WEBP up to 2MB"
                            onUploadSuccess={(url) => {
                              const updated = { ...profile, avatar: url };
                              saveProfile(updated);
                              setForm(updated);
                              setShowAvatarUpload(false);
                              toast.success("Profile photo updated successfully!");
                            }} 
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skills selectors */}
                  <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Skills & Tech Stack</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Select your skills to update your profile</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {SKILL_OPTIONS.map((skill) => {
                        const isActive = profile.skills.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => handleSkillToggle(skill)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition ${
                              isActive 
                                ? "bg-blue-600 text-white border-blue-600 shadow" 
                                : isDarkMode 
                                ? "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700" 
                                : "border-slate-200 bg-white text-slate-650 hover:border-slate-300"
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: RESUME & QUALIFICATIONS */}
            {activeTab === "resume" && (
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                
                {/* Resume Upload Panel */}
                <div className={`p-6 rounded-2xl border lg:col-span-2 flex flex-col gap-5 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div>
                    <h4 className="text-base font-bold font-outfit">Student Resume Upload</h4>
                    <p className="text-xs text-slate-500 mt-1">Stage and link your PDF/DOCX resume to apply for projects and opportunities</p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border dark:border-slate-800 bg-slate-55/50 dark:bg-slate-950/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-600">
                        <FileText size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold leading-tight">Link File Resume</p>
                        <p className="text-[10px] text-slate-505 leading-none mt-1 truncate max-w-[280px]">
                          {profile.resume ? profile.resume : "No document linked yet."}
                        </p>
                      </div>
                    </div>
                    {profile.resume && (
                      <a href={profile.resume} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                        View File <ExternalLink size={12} />
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
                    <div className="p-4 rounded-xl border border-dashed dark:border-slate-800 bg-slate-55/50 dark:bg-slate-955/20 animate-in fade-in duration-200">
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

                {/* Certificates Builder */}
                <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Credentials & Awards</h4>
                    <p className="text-xs text-slate-500 mt-1">Manage verified certificates</p>
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

            {/* TAB 4: CAREER ASPIRATIONS */}
            {activeTab === "aspirations" && (
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                
                {/* Aspirations configuration form */}
                <div className={`p-6 rounded-2xl border lg:col-span-2 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <h3 className="text-base font-bold font-outfit mb-4">Professional Aspirations</h3>
                  
                  <form onSubmit={handleSaveGeneral} className="space-y-5 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Field of Aspiration / Target Role</label>
                      <input 
                        name="aspiration" 
                        value={form.aspiration} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Full Stack Developer, AI Researcher, UI/UX Architect"
                        className={`p-2.5 rounded-lg border ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`} 
                        required
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Dream Companies to Work For</label>
                      <input 
                        name="dreamCompany" 
                        value={form.dreamCompany} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Vercel, Stripe, Google, OpenAI"
                        className={`p-2.5 rounded-lg border ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`} 
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Career Goals (2-Year Horizon)</label>
                      <textarea 
                        name="careerGoals" 
                        value={form.careerGoals} 
                        onChange={handleInputChange} 
                        rows="3"
                        placeholder="Where do you see yourself in 2 years..."
                        className={`p-2.5 rounded-lg border w-full resize-none ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`} 
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Career Motivation Statement</label>
                      <textarea 
                        name="motivation" 
                        value={form.motivation} 
                        onChange={handleInputChange} 
                        rows="3"
                        placeholder="Describe what drives your passion for technology and code..."
                        className={`p-2.5 rounded-lg border w-full resize-none ${
                          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                        }`} 
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/10">
                        Save Aspirations
                      </button>
                    </div>
                  </form>
                </div>

                {/* Visual Aspiration summary block */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Live Profile Sync</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Aspirations and target roles help us match you with startups looking for projects matching your skill profiles and career direction.
                    </p>
                    
                    <div className="border-t dark:border-slate-800 pt-4 space-y-3 text-xs">
                      <div>
                        <span className="text-slate-500">Aspiration Status:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          profile.aspiration ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {profile.aspiration ? "Active & Indexed" : "Pending Detail Setup"}
                        </span>
                      </div>
                      
                      {profile.dreamCompany && (
                        <div>
                          <span className="text-slate-505">Dream Target:</span>
                          <span className="ml-2 font-bold">{profile.dreamCompany}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </section>
            )}

            {/* TAB 5: MY COLLABORATIONS */}
            {activeTab === "workspaces" && (
              <section className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-zinc-50">Active Project Workspaces</h3>
                  
                    <p className="text-xs text-slate-500 mt-1">Review active collaborations and live milestone status.</p>
                  </div>
                  
                  {selectedWorkspaceId && (
                    <button
                      onClick={() => setSelectedWorkspaceId(null)}
                      className={`px-4 py-2 border rounded-xl text-xs font-semibold transition ${
                        isDarkMode ? "border-slate-800 bg-slate-900 text-slate-350" : "border-slate-200 bg-white text-slate-650"
                      }`}
                    >
                     {} Back to list
                    </button>
                  )}
                </div>

                {loadingWorkspaces ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : activeWorkspaces.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 border border-dashed dark:border-slate-800 rounded-2xl bg-slate-900/10">
                    You have no active project collaborations yet. Browse matching projects on the platform!
                  </div>
                ) : selectedWorkspaceId ? (
                  (() => {
                    const ws = activeWorkspaces.find(w => w._id === selectedWorkspaceId);
                    return ws ? (
                      <ActiveWorkSpace
                        project={ws}
                        token={token}
                        backendUrl={base}
                      />
                    ) : null;
                  })()
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeWorkspaces.map(ws => (
                      <div
                        key={ws._id}
                        onClick={() => setSelectedWorkspaceId(ws._id)}
                        className={`p-6 border rounded-2xl cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between min-h-[200px] ${
                          isDarkMode 
                            ? "bg-slate-900/40 border-slate-800 hover:border-blue-500/60" 
                            : "bg-white border-slate-200 hover:border-blue-500"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-extrabold font-outfit text-base text-slate-800 dark:text-zinc-150">{ws.title}</h4>
                              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                                <span className="font-semibold text-slate-350">{ws.stipend}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                <span>{ws.duration}</span>
                              </p>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/10 text-blue-500 border border-blue-600/20">
                              ACTIVE WORK
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{ws.description}</p>
                        </div>

                        <div className="border-t dark:border-slate-800/60 pt-4 mt-4 flex items-center gap-2">
                          <img
                            src={ws.startupId?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                            className="w-7 h-7 rounded-full border border-slate-800"
                            alt=""
                          />
                          <div className="text-left">
                            <p className="text-[10px] font-bold text-slate-350 leading-none">{ws.startupId?.companyName || ws.startupId?.name}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5 leading-none">Startup Partner</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

          </main>
        </div>

      </div>
      <Chatbot />
    </div>
  );
}