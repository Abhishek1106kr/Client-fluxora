import React, { useState, useEffect, useContext, Component } from "react";
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
  Trash2,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import developerHeroImg from "../assets/dashboard_eng.jpg.png";
import FileUpload from "../components/fileUpload";

// ─────────────────────────────────────────────
// Error Boundary (wraps unstable sub-trees)
// ─────────────────────────────────────────────
class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("[DashboardErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          data-testid="error-boundary-fallback"
          role="alert"
          className="flex flex-col items-center justify-center py-16 text-center gap-4"
        >
          <XCircle className="text-red-500" size={40} />
          <h3 className="text-lg font-bold text-red-500">Something went wrong</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            {this.state.error?.message || "An unexpected error occurred in this section."}
          </p>
          <button
            data-testid="error-boundary-retry"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────
// Skeleton Components
// ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      data-testid="loading-state"
      className="p-6 rounded-2xl border border-slate-200 bg-white animate-pulse min-h-[160px] flex flex-col gap-3"
      aria-busy="true"
      aria-label="Loading metric card"
    >
      <div className="h-3 w-24 bg-slate-200 rounded" />
      <div className="h-7 w-32 bg-slate-200 rounded" />
      <div className="h-8 w-full bg-slate-100 rounded mt-auto" />
    </div>
  );
}

function SkeletonProfile() {
  return (
    <div
      data-testid="loading-state"
      className="p-6 rounded-2xl border border-slate-200 bg-white animate-pulse flex flex-col gap-4"
      aria-busy="true"
      aria-label="Loading profile"
    >
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="h-2.5 w-20 bg-slate-200 rounded" />
          <div className="h-9 w-full bg-slate-100 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const SKILL_OPTIONS = [
  "React", "Node.js", "MongoDB", "Express", "Python",
  "Java", "C++", "UI/UX", "Figma", "Machine Learning", "SQL",
];

const ANALYTICS_DATA = [
  { id: "revenue", name: "Revenue", value: "$45,231.89", change: "+20.1% from last month", trend: "up", color: "#2563EB", points: [30, 45, 35, 50, 40, 60, 55, 70] },
  { id: "active-projects", name: "Active Projects", value: "12", change: "+2 new this week", trend: "up", color: "#7C3AED", points: [10, 8, 12, 11, 13, 12, 14, 12] },
  { id: "deployments", name: "Deployments", value: "249", change: "99.8% success rate", trend: "up", color: "#22C55E", points: [120, 140, 110, 160, 180, 210, 230, 249] },
  { id: "contributors", name: "Contributors", value: "8", change: "+1 joined recently", trend: "up", color: "#3B82F6", points: [4, 5, 5, 6, 6, 7, 7, 8] },
  { id: "storage", name: "Storage Used", value: "4.2 GB / 10 GB", change: "42.0% capacity", trend: "neutral", color: "#F59E0B", points: [2.1, 2.5, 2.9, 3.2, 3.6, 3.8, 4.0, 4.2] },
];

const NAV_TABS = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "analytics", label: "Analytics Space", icon: Activity },
  { id: "credentials", label: "Qualifications", icon: Award },
  { id: "profile", label: "Profile Settings", icon: User },
];

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { userData, isLoggedIn, setIsLoggedIn, setUserData, theme, toggleTheme } = useContext(AppContext);

  // ── Loading / save state ──
  const [pageLoading, setPageLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | loading | success | error
  const [logoutLoading, setLogoutLoading] = useState(false);
  const isDarkMode = theme === "dark";

  // ── Profile state ──
  const [profile, setProfile] = useState({
    name: userData?.name || "Developer",
    email: userData?.email || "developer@fluxora.io",
    bio: userData?.bio || "Full Stack Engineer passionate about constructing high-performance modern web applications.",
    location: userData?.location || "NA",
    github: userData?.github || "NA",
    linkedin: "linkedin.com/in/developer",
    avatar: "",
    motivation: "I love building scalable web apps and premium UI layouts that wow users.",
    skills: ["React", "Node.js", "MongoDB", "UI/UX"],
    careerGoals: "In 2 years, I want to lead frontend teams and architect enterprise cloud systems.",
    dreamCompany: "Vercel / Stripe",
    favoriteProject: "Fluxora Dashboard Canvas",
    certificates: [
      { name: "AWS Developer Associate", url: "https://credly.com/aws-assoc" },
      { name: "React Advanced Core", url: "https://scrimba.com/react-adv" },
    ],
    resume: "https://drive.google.com/resume",
  });

  // ── UI state ──
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState({ ...profile });
  const [formErrors, setFormErrors] = useState({});
  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({ name: "", url: "" });
  const [certErrors, setCertErrors] = useState({});
  const [showResumeUpload, setShowResumeUpload] = useState(false);

  // ── Sync with AppContext ──
  useEffect(() => {
    if (userData) {
      setProfile((prev) => ({ ...prev, name: userData.name, email: userData.email }));
      setForm((prev) => ({ ...prev, name: userData.name, email: userData.email }));
    }
  }, [userData]);

  // ── Load from localStorage ──
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
    // Simulate brief loading for skeleton display
    const t = setTimeout(() => setPageLoading(false), 600);
    return () => clearTimeout(t);
  }, [userData]);

  // ─────────────────────────────────
  // Helpers
  // ─────────────────────────────────
  const saveProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem("dev_profile", JSON.stringify(newProfile));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateProfileForm = () => {
    const errors = {};
    if (!form.name?.trim()) errors.name = "Full name is required.";
    if (!form.email?.trim()) errors.email = "Email address is required.";
    return errors;
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    const errors = validateProfileForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSaveStatus("loading");
    try {
      // Simulate async persist (replace with real API call)
      await new Promise((res) => setTimeout(res, 500));
      saveProfile(form);
      setEditMode(false);
      setSaveStatus("success");
      toast.success("Profile updated successfully!");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const handleSkillToggle = (skill) => {
    const updatedSkills = profile.skills.includes(skill)
      ? profile.skills.filter((s) => s !== skill)
      : [...profile.skills, skill];
    const updated = { ...profile, skills: updatedSkills };
    saveProfile(updated);
    setForm(updated);
  };

  const validateCertForm = () => {
    const errors = {};
    if (!certForm.name.trim()) errors.name = "Certificate title is required.";
    if (!certForm.url.trim()) errors.url = "Verification URL is required.";
    return errors;
  };

  const handleAddCert = () => {
    const errors = validateCertForm();
    if (Object.keys(errors).length > 0) {
      setCertErrors(errors);
      return;
    }
    setCertErrors({});
    const updatedCertificates = [
      ...(profile.certificates || []),
      { name: certForm.name.trim(), url: certForm.url.trim() },
    ];
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
    setLogoutLoading(true);
    try {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserData(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Portfolio link copied to clipboard!");
  };

  // ─────────────────────────────────
  // Render
  // ─────────────────────────────────
  return (
    <DashboardErrorBoundary>
      <div
        data-testid="dashboard-root"
        className={`min-h-screen font-inter antialiased transition-colors duration-300 ${
          isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-slate-900"
        }`}
      >
        {/* Background blurred glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-[400px] left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

        {/* Main Grid Wrapper */}
        <div className="flex relative z-10 max-w-[1440px] mx-auto min-h-screen">

          {/* ── SIDEBAR ── */}
          <aside
            data-testid="dashboard-sidebar"
            role="navigation"
            aria-label="Dashboard navigation"
            className={`w-[280px] shrink-0 border-r flex flex-col justify-between p-6 transition-colors duration-300 hidden lg:flex ${
              isDarkMode ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-8">
              {/* Logo */}
              <div className="flex items-center gap-2" data-testid="sidebar-logo">
                <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/10">
                  <Rocket size={20} aria-hidden="true" />
                </div>
                <span className="font-extrabold text-lg tracking-tight font-outfit">Fluxora</span>
              </div>

              {/* Nav Tabs */}
              <nav className="flex flex-col gap-1.5" aria-label="Dashboard sections">
                {NAV_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    data-testid={`nav-tab-${tab.id}`}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                        : isDarkMode
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <tab.icon size={18} aria-hidden="true" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="flex flex-col gap-3" data-testid="sidebar-footer">
              <div
                data-testid="subscription-card"
                className={`p-4 rounded-xl border ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Subscription</span>
                  <span
                    data-testid="subscription-tier"
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-green-500/10 text-green-500 border border-green-500/20"
                  >
                    Pro Tier
                  </span>
                </div>
                <p className="text-xs font-semibold">Enterprise Sandbox</p>
              </div>

              <button
                data-testid="logout-button"
                aria-label="Logout from dashboard"
                onClick={handleLogout}
                disabled={logoutLoading}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? "border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900"
                    : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <LogOut size={16} aria-hidden="true" />
                {logoutLoading ? "Logging out…" : "Logout Session"}
              </button>
            </div>
          </aside>

          {/* ── MAIN CONTAINER ── */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* TOP NAVBAR */}
            <header
              data-testid="dashboard-header"
              className={`h-[72px] border-b flex items-center justify-between px-6 md:px-8 transition-colors duration-300 ${
                theme === "dark" ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white/80"
              } backdrop-blur-md sticky top-0 z-30`}
            >
              {/* Search Input */}
              <div className="relative max-w-md w-full hidden md:block" role="search">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
                <input
                  data-testid="search-input"
                  id="dashboard-search"
                  type="search"
                  placeholder="Search projects, deployments, resources..."
                  aria-label="Search dashboard"
                  className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all ${
                    theme === "dark"
                      ? "bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600"
                  }`}
                />
              </div>

              {/* Action Group */}
              <div className="flex items-center gap-3 ml-auto md:ml-0">
                {/* Dark Mode Toggle */}
                <button
                  data-testid="dark-mode-toggle"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  aria-pressed={isDarkMode}
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isDarkMode ? "bg-slate-900 border-slate-800 text-yellow-400" : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  {isDarkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                </button>

                {/* Notification Badge */}
                <button
                  data-testid="notification-button"
                  aria-label="View notifications"
                  className={`p-2.5 rounded-xl border transition-colors relative ${
                    isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <Bell size={18} aria-hidden="true" />
                  <span
                    data-testid="notification-badge"
                    aria-label="New notifications"
                    className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"
                  />
                </button>

                {/* User Tag */}
                <div
                  data-testid="user-tag"
                  className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800"
                >
                  <div
                    data-testid="user-avatar"
                    aria-label={`User avatar for ${profile.name}`}
                    className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 font-bold text-sm"
                  >
                    {profile.name?.charAt(0) ?? "U"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p data-testid="user-name" className="text-xs font-bold leading-tight">{profile.name}</p>
                    <p data-testid="user-email" className="text-[10px] text-slate-500 leading-none">{profile.email}</p>
                  </div>
                </div>
              </div>
            </header>

            {/* ── MAIN CONTENT ── */}
            <main data-testid="dashboard-main" className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">

              {/* HERO BANNER */}
              <section
                data-testid="hero-section"
                aria-label="Hero banner"
                className={`relative rounded-3xl border overflow-hidden transition-all duration-300 p-8 md:p-10 flex flex-col justify-between min-h-[380px] ${
                  isDarkMode
                    ? "bg-slate-900/60 border-slate-800 shadow-2xl"
                    : "bg-white border-slate-200 shadow-xl shadow-slate-100/50"
                }`}
              >
                <div className="absolute top-0 right-0 w-[400px] h-[100%] bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none z-0" />
                <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-[80%] md:h-[95%] pointer-events-none z-10 hidden md:block overflow-hidden">
                  <div className="w-full h-full relative">
                    <img
                      src={developerHeroImg}
                      alt="Workspace Developers Layout Reference"
                      className="w-full h-full object-contain object-bottom select-none drop-shadow-[0_8px_24px_rgba(37,99,235,0.15)]"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDarkMode ? "from-slate-900" : "from-white"}`} />
                    <div className={`absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r ${isDarkMode ? "from-slate-900" : "from-white"}`} />
                  </div>
                </div>

                <div className="relative z-20 max-w-xl flex flex-col justify-between h-full gap-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-blue-600/10 text-blue-600 border border-blue-600/20">
                      <Sparkles size={12} aria-hidden="true" />
                      <span>Workspace Dashboard Canvas</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight font-outfit mb-4">
                      Architecting the{" "}
                      <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Future
                      </span>{" "}
                      of Code
                    </h1>
                    <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      Manage, compile, and deploy enterprise applications instantly. Attach your developer resume details or connect strategies for direct visual feedback.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      data-testid="hero-configure-profile-btn"
                      aria-label="Go to profile settings"
                      onClick={() => setActiveTab("profile")}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                    >
                      Configure Profile
                    </button>
                    <button
                      data-testid="hero-share-btn"
                      aria-label="Share your workspace portfolio link"
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

              {/* ══ TAB: OVERVIEW ══ */}
              {activeTab === "overview" && (
                <>
                  {/* Analytics Metric Cards */}
                  <section
                    data-testid="analytics-cards-section"
                    aria-label="Analytics metric cards"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {pageLoading
                      ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                      : ANALYTICS_DATA.map((item) => (
                          <div
                            key={item.id}
                            data-testid={`metric-card-${item.id}`}
                            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[160px] ${
                              isDarkMode
                                ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                                : "bg-white border-slate-200/80 hover:border-blue-200 shadow-sm shadow-slate-100"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                  {item.name}
                                </span>
                                <span
                                  data-testid={`metric-trend-${item.id}`}
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                    item.trend === "up"
                                      ? "bg-green-500/10 text-green-500"
                                      : item.trend === "warning"
                                      ? "bg-red-500/10 text-red-500"
                                      : "bg-amber-500/10 text-amber-500"
                                  }`}
                                >
                                  {item.change}
                                </span>
                              </div>
                              <h3
                                data-testid={`metric-value-${item.id}`}
                                className="text-2xl font-bold font-outfit"
                              >
                                {item.value}
                              </h3>
                            </div>
                            {/* Sparkline */}
                            <div className="w-full h-10 mt-3 overflow-hidden" aria-hidden="true">
                              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path
                                  d={`M 0 ${30 - item.points[0]} L 14 ${30 - item.points[1]} L 28 ${30 - item.points[2]} L 42 ${30 - item.points[3]} L 56 ${30 - item.points[4]} L 70 ${30 - item.points[5]} L 84 ${30 - item.points[6]} L 100 ${30 - item.points[7]}`}
                                  fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                />
                                <path
                                  d={`M 0 30 L 0 ${30 - item.points[0]} L 14 ${30 - item.points[1]} L 28 ${30 - item.points[2]} L 42 ${30 - item.points[3]} L 56 ${30 - item.points[4]} L 70 ${30 - item.points[5]} L 84 ${30 - item.points[6]} L 100 ${30 - item.points[7]} L 100 30 Z`}
                                  fill={`url(#grad-${item.id})`}
                                />
                                <defs>
                                  <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={item.color} stopOpacity="0.2" />
                                    <stop offset="100%" stopColor={item.color} stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                          </div>
                        ))}
                  </section>

                  {/* Charts Area */}
                  <section
                    data-testid="charts-section"
                    aria-label="Performance charts"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Deployment Metrics */}
                    <div
                      data-testid="deployment-chart"
                      className={`p-6 rounded-2xl border lg:col-span-2 flex flex-col justify-between ${
                        isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-base font-bold font-outfit">Deployment Metrics Analytics</h4>
                          <p className="text-xs text-slate-500">Average response times &amp; success distributions</p>
                        </div>
                        <div className="flex gap-2" aria-label="Chart legend">
                          <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />Average</span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />Peak load</span>
                        </div>
                      </div>
                      <div className="w-full h-48 flex items-end" aria-hidden="true">
                        <svg className="w-full h-full" viewBox="0 0 500 150">
                          <line x1="0" y1="30" x2="500" y2="30" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3" />
                          <line x1="0" y1="75" x2="500" y2="75" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3" />
                          <line x1="0" y1="120" x2="500" y2="120" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3" />
                          <path d="M0,150 L0,120 L71,110 L142,80 L213,95 L284,50 L355,70 L426,45 L500,30 L500,150 Z" fill="url(#blue-area)" opacity="0.15" />
                          <path d="M0,120 L71,110 L142,80 L213,95 L284,50 L355,70 L426,45 L500,30" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
                          <path d="M0,140 L71,130 L142,110 L213,85 L284,70 L355,55 L426,30 L500,15" fill="none" stroke="#7C3AED" strokeWidth="2" strokeDasharray="4" strokeLinecap="round" />
                          <defs>
                            <linearGradient id="blue-area" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
                              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="flex items-center justify-between border-t dark:border-slate-800 pt-4 mt-4 text-[10px] text-slate-500 font-semibold">
                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                          <span key={d}>{d}</span>
                        ))}
                      </div>
                    </div>

                    {/* Donut Chart */}
                    <div
                      data-testid="resource-donut-chart"
                      className={`p-6 rounded-2xl border flex flex-col justify-between ${
                        isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <div>
                        <h4 className="text-base font-bold font-outfit">Resource Partition</h4>
                        <p className="text-xs text-slate-500">Resource capacity load metrics</p>
                      </div>
                      <div className="flex items-center justify-center py-4 relative" aria-hidden="true">
                        <svg width="120" height="120" viewBox="0 0 36 36" className="rotate-[-90deg]">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="45 55" strokeDashoffset="100" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7C3AED" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="55" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22C55E" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="25" />
                        </svg>
                        <div className="absolute text-center">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Allocated</p>
                          <p className="text-xl font-bold font-outfit">84.2%</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-500">
                        {[
                          { label: "Compute Instance", pct: "45%", color: "bg-blue-600" },
                          { label: "Static Storage", pct: "30%", color: "bg-purple-600" },
                          { label: "Database Cache", pct: "25%", color: "bg-green-500" },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${row.color} inline-block`} />
                              {row.label}
                            </span>
                            <span className="font-bold text-slate-700">{row.pct}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Projects Table + Activity */}
                  <section
                    data-testid="projects-activity-section"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Projects Table */}
                    <div
                      data-testid="recent-projects-table"
                      className={`p-6 rounded-2xl border lg:col-span-2 overflow-x-auto ${
                        isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-base font-bold font-outfit">Recent Active Projects</h4>
                          <p className="text-xs text-slate-500">Staged repositories and deployment statuses</p>
                        </div>
                        <button
                          data-testid="projects-more-options"
                          aria-label="More project options"
                          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                        >
                          <MoreHorizontal size={18} aria-hidden="true" />
                        </button>
                      </div>

                      <table className="w-full text-left text-xs border-collapse" aria-label="Recent projects">
                        <thead>
                          <tr className="border-b dark:border-slate-800 text-slate-400 font-semibold">
                            <th scope="col" className="pb-3 pr-4">Project Name</th>
                            <th scope="col" className="pb-3 pr-4">Framework</th>
                            <th scope="col" className="pb-3 pr-4">Status</th>
                            <th scope="col" className="pb-3 text-right">Commit Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-800/60">
                          {[
                            { id: "fluxora-canvas", name: "Fluxora Dashboard Canvas", framework: "Next.js + Tailwind", status: "Success", time: "2 mins ago" },
                            { id: "job-scraper", name: "Job Scraper Microservice", framework: "Node.js + Puppeteer", status: "Running", time: "1 hr ago" },
                            { id: "ai-resume", name: "AI Resume Analyzer", framework: "Python + Gemini", status: "Failed", time: "Yesterday" },
                          ].map((row) => (
                            <tr
                              key={row.id}
                              data-testid={`project-row-${row.id}`}
                              className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors"
                            >
                              <td className="py-3.5 pr-4 font-bold text-slate-800 dark:text-slate-200">{row.name}</td>
                              <td className="py-3.5 pr-4 text-slate-500">{row.framework}</td>
                              <td className="py-3.5 pr-4">
                                <span
                                  data-testid={`project-status-${row.id}`}
                                  role="status"
                                  aria-label={`Status: ${row.status}`}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                    row.status === "Success"
                                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                      : row.status === "Failed"
                                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                      : "bg-blue-500/10 text-blue-600 border border-blue-600/20"
                                  }`}
                                >
                                  {row.status === "Success" && <CheckCircle2 size={10} aria-hidden="true" />}
                                  {row.status === "Failed" && <XCircle size={10} aria-hidden="true" />}
                                  {row.status === "Running" && <Activity size={10} className="animate-pulse" aria-hidden="true" />}
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-3.5 text-right text-slate-500 font-mono">{row.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Activity Timeline + Core Team */}
                    <div
                      data-testid="activity-panel"
                      className={`p-6 rounded-2xl border flex flex-col gap-6 ${
                        isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <div data-testid="core-team-section">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Core Team</h4>
                        <div className="space-y-3">
                          {[
                            { id: "abhishek", name: "Abhishek Chauhan", role: "Principal Engineer", online: true },
                            { id: "clara", name: "Clara Smith", role: "AI Researcher", online: true },
                            { id: "marcus", name: "Marcus Doe", role: "Product Designer", online: false },
                          ].map((member) => (
                            <div
                              key={member.id}
                              data-testid={`team-member-${member.id}`}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center font-bold text-xs text-blue-600">
                                  {member.name.charAt(0)}
                                  {member.online && (
                                    <span
                                      aria-label="Online"
                                      className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"
                                    />
                                  )}
                                </div>
                                <div className="text-left">
                                  <p className="text-xs font-bold leading-tight">{member.name}</p>
                                  <p className="text-[10px] text-slate-500 leading-none">{member.role}</p>
                                </div>
                              </div>
                              <span
                                data-testid={`member-status-${member.id}`}
                                className="text-[10px] text-slate-500 font-semibold"
                              >
                                {member.online ? "Online" : "Away"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div data-testid="recent-events-section" className="border-t dark:border-slate-800 pt-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Recent Events</h4>
                        <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200 dark:before:bg-slate-800 pl-6">
                          {[
                            { id: "deploy-success", title: "Deployed to production", desc: "Production pipeline completed successfully", time: "10m ago", icon: CheckCircle2, color: "text-green-500" },
                            { id: "api-quota", title: "API quota threshold", desc: "API usage reached 98.4%", time: "1h ago", icon: AlertTriangle, color: "text-red-500" },
                          ].map((evt) => (
                            <div
                              key={evt.id}
                              data-testid={`event-item-${evt.id}`}
                              className="relative text-left"
                            >
                              <div className="absolute -left-[29px] top-0.5 p-0.5 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                <evt.icon size={11} className={evt.color} aria-hidden="true" />
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

              {/* ══ TAB: ANALYTICS ══ */}
              {activeTab === "analytics" && (
                <DashboardErrorBoundary>
                  <section
                    data-testid="analytics-tab-section"
                    className={`p-6 rounded-2xl border ${
                      isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                    }`}
                  >
                    <h2 className="text-lg font-bold font-outfit mb-4 text-blue-600">
                      Enterprise Metrics &amp; Integration Tools
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                      Verify system configurations, manage tokens, and view interactive load curves.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Quick Actions */}
                      <div
                        data-testid="quick-actions-card"
                        className={`p-5 rounded-xl border ${
                          isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                          Quick Actions Gateway
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            data-testid="action-deploy-branch"
                            aria-label="Deploy branch"
                            className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-[0.98]"
                          >
                            <Zap size={14} aria-hidden="true" /> Deploy Branch
                          </button>
                          <button
                            data-testid="action-add-project"
                            aria-label="Add new project"
                            className="flex items-center justify-center gap-2 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-[0.98]"
                          >
                            <Plus size={14} aria-hidden="true" /> Add Project
                          </button>
                          <button
                            data-testid="action-invite-member"
                            className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-xs font-semibold transition ${
                              isDarkMode ? "border-slate-800 hover:bg-slate-900" : "border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            Invite Member
                          </button>
                          <button
                            data-testid="action-api-manager"
                            className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-xs font-semibold transition ${
                              isDarkMode ? "border-slate-800 hover:bg-slate-900" : "border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            API Manager
                          </button>
                        </div>
                      </div>

                      {/* System Status */}
                      <div
                        data-testid="system-status-card"
                        className={`p-5 rounded-xl border ${
                          isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="space-y-3 text-xs">
                          {[
                            { id: "db", label: "Database Server", status: "Connected", statusClass: "text-green-500" },
                            { id: "smtp", label: "SMTP Service", status: "Operational", statusClass: "text-green-500" },
                            { id: "storage", label: "Storage Bucket", status: "84.2% Capacity", statusClass: "text-amber-500" },
                            { id: "oauth", label: "Google OAuth Endpoint", status: "Configured", statusClass: "text-green-500" },
                          ].map((svc) => (
                            <div key={svc.id} className="flex items-center justify-between">
                              <span>{svc.label}</span>
                              <span
                                data-testid={`service-status-${svc.id}`}
                                className={`font-bold ${svc.statusClass}`}
                              >
                                {svc.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                </DashboardErrorBoundary>
              )}

              {/* ══ TAB: CREDENTIALS ══ */}
              {activeTab === "credentials" && (
                <DashboardErrorBoundary>
                  <section
                    data-testid="credentials-tab-section"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Resume Column */}
                    <div
                      data-testid="resume-section"
                      className={`p-6 rounded-2xl border lg:col-span-2 flex flex-col gap-5 ${
                        isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <div>
                        <h4 className="text-base font-bold font-outfit">Resume Document Portfolio</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Stage and upload your resume for ATS-optimization and profile sync
                        </p>
                      </div>

                      <div
                        data-testid="resume-current"
                        className="flex items-center justify-between p-4 rounded-xl border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-600">
                            <FileText size={18} aria-hidden="true" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold leading-tight">Current Portfolio Resume</p>
                            <p
                              data-testid="resume-url-display"
                              className="text-[10px] text-slate-500 leading-none mt-1 truncate max-w-[280px]"
                            >
                              {profile.resume ? profile.resume : "No document linked yet."}
                            </p>
                          </div>
                        </div>
                        {profile.resume && (
                          <a
                            data-testid="resume-view-link"
                            href={profile.resume}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="View current resume"
                            className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1"
                          >
                            View <ExternalLink size={12} aria-hidden="true" />
                          </a>
                        )}
                      </div>

                      <button
                        data-testid="resume-toggle-upload-btn"
                        aria-expanded={showResumeUpload}
                        onClick={() => setShowResumeUpload(!showResumeUpload)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
                      >
                        {showResumeUpload ? "Cancel Upload" : "Link Staged Resume File"}
                      </button>

                      {showResumeUpload && (
                        <div
                          data-testid="resume-upload-panel"
                          className="p-4 rounded-xl border border-dashed dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 animate-in fade-in duration-200"
                        >
                          <FileUpload
                            onUploadSuccess={(url) => {
                              const updated = { ...profile, resume: url };
                              saveProfile(updated);
                              setForm(updated);
                              setShowResumeUpload(false);
                              toast.success("Resume linked to user profile successfully!");
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Certificates Column */}
                    <div
                      data-testid="certificates-section"
                      className={`p-6 rounded-2xl border flex flex-col gap-4 ${
                        isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Qualifications</h4>
                        <p className="text-xs text-slate-500 mt-1">Manage &amp; verify credentials</p>
                      </div>

                      {/* Certificate List */}
                      <div
                        data-testid="certificates-list"
                        className="space-y-3"
                        role="list"
                        aria-label="Certificates list"
                      >
                        {(profile.certificates || []).length === 0 && (
                          <p
                            data-testid="certificates-empty-state"
                            className="text-xs text-slate-400 text-center py-4"
                          >
                            No certificates added yet.
                          </p>
                        )}
                        {(profile.certificates || []).map((cert, index) => (
                          <div
                            key={`${cert.url}-${index}`}
                            data-testid={`certificate-item-${index}`}
                            role="listitem"
                            className="p-3.5 rounded-xl border dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-950/20"
                          >
                            <div>
                              <p className="font-bold">{cert.name}</p>
                              <a
                                href={cert.url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Verify certificate: ${cert.name}`}
                                className="text-blue-600 text-[10px] hover:underline mt-1 inline-block"
                              >
                                Verify Link
                              </a>
                            </div>
                            <button
                              data-testid={`remove-cert-${index}`}
                              aria-label={`Remove certificate: ${cert.name}`}
                              onClick={() => handleRemoveCert(cert.url)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={14} aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Cert Form */}
                      {showCertForm ? (
                        <div
                          data-testid="cert-form"
                          role="form"
                          aria-label="Add new certificate"
                          className="p-4 rounded-xl border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col gap-2.5"
                        >
                          <div className="flex flex-col gap-1">
                            <label htmlFor="cert-name-input" className="sr-only">Certificate Title</label>
                            <input
                              id="cert-name-input"
                              data-testid="cert-name-input"
                              placeholder="Certificate Title"
                              value={certForm.name}
                              onChange={(e) => {
                                setCertForm({ ...certForm, name: e.target.value });
                                if (certErrors.name) setCertErrors((p) => ({ ...p, name: "" }));
                              }}
                              aria-invalid={!!certErrors.name}
                              aria-describedby={certErrors.name ? "cert-name-error" : undefined}
                              className={`p-2.5 text-xs rounded-lg border ${
                                certErrors.name ? "border-red-500" : isDarkMode ? "border-slate-800" : "border-slate-200"
                              } ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
                            />
                            {certErrors.name && (
                              <p
                                id="cert-name-error"
                                data-testid="input-error-cert-name"
                                role="alert"
                                className="text-[10px] text-red-500"
                              >
                                {certErrors.name}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col gap-1">
                            <label htmlFor="cert-url-input" className="sr-only">Credential URL</label>
                            <input
                              id="cert-url-input"
                              data-testid="cert-url-input"
                              placeholder="Credential URL"
                              value={certForm.url}
                              onChange={(e) => {
                                setCertForm({ ...certForm, url: e.target.value });
                                if (certErrors.url) setCertErrors((p) => ({ ...p, url: "" }));
                              }}
                              aria-invalid={!!certErrors.url}
                              aria-describedby={certErrors.url ? "cert-url-error" : undefined}
                              className={`p-2.5 text-xs rounded-lg border ${
                                certErrors.url ? "border-red-500" : isDarkMode ? "border-slate-800" : "border-slate-200"
                              } ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
                            />
                            {certErrors.url && (
                              <p
                                id="cert-url-error"
                                data-testid="input-error-cert-url"
                                role="alert"
                                className="text-[10px] text-red-500"
                              >
                                {certErrors.url}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              data-testid="cert-save-btn"
                              onClick={handleAddCert}
                              className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                            >
                              Save
                            </button>
                            <button
                              data-testid="cert-cancel-btn"
                              onClick={() => { setShowCertForm(false); setCertErrors({}); }}
                              className={`px-3.5 py-1.5 border rounded-lg text-xs font-semibold ${
                                isDarkMode ? "border-slate-700" : "border-slate-200"
                              }`}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          data-testid="show-cert-form-btn"
                          aria-label="Open form to add a new certificate"
                          onClick={() => setShowCertForm(true)}
                          className="w-full py-2.5 border rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                        >
                          + Add Certificate
                        </button>
                      )}
                    </div>
                  </section>
                </DashboardErrorBoundary>
              )}

              {/* ══ TAB: PROFILE SETTINGS ══ */}
              {activeTab === "profile" && (
                <DashboardErrorBoundary>
                  <section
                    data-testid="profile-tab-section"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Edit Form */}
                    <div
                      data-testid="profile-edit-card"
                      className={`p-6 rounded-2xl border lg:col-span-2 ${
                        isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <h4 className="text-base font-bold font-outfit mb-4">Edit Profile Metadata</h4>

                      {/* Save status banner */}
                      {saveStatus === "success" && (
                        <div
                          data-testid="save-status-success"
                          role="status"
                          aria-live="polite"
                          className="flex items-center gap-2 mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-600 font-semibold"
                        >
                          <CheckCircle2 size={14} aria-hidden="true" /> Profile saved successfully!
                        </div>
                      )}
                      {saveStatus === "error" && (
                        <div
                          data-testid="save-status-error"
                          role="alert"
                          aria-live="assertive"
                          className="flex items-center gap-2 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-semibold"
                        >
                          <XCircle size={14} aria-hidden="true" /> Failed to save. Please try again.
                        </div>
                      )}

                      <form
                        data-testid="profile-edit-form"
                        onSubmit={handleSaveGeneral}
                        noValidate
                        className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs"
                      >
                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="profile-name" className="font-bold text-slate-500 uppercase">
                            Username / Full Name
                          </label>
                          <input
                            id="profile-name"
                            data-testid="input-profile-name"
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            aria-required="true"
                            aria-invalid={!!formErrors.name}
                            aria-describedby={formErrors.name ? "error-name" : undefined}
                            className={`p-2.5 rounded-lg border ${
                              formErrors.name ? "border-red-500 bg-red-50" : isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                            }`}
                          />
                          {formErrors.name && (
                            <p id="error-name" data-testid="input-error-name" role="alert" className="text-red-500 text-[10px]">
                              {formErrors.name}
                            </p>
                          )}
                        </div>

                        {/* Location */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="profile-location" className="font-bold text-slate-500 uppercase">Location</label>
                          <input
                            id="profile-location"
                            data-testid="input-profile-location"
                            name="location"
                            value={form.location}
                            onChange={handleInputChange}
                            className={`p-2.5 rounded-lg border ${
                              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                            }`}
                          />
                        </div>

                        {/* GitHub */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="profile-github" className="font-bold text-slate-500 uppercase">GitHub Profile URL</label>
                          <input
                            id="profile-github"
                            data-testid="input-profile-github"
                            name="github"
                            value={form.github}
                            onChange={handleInputChange}
                            className={`p-2.5 rounded-lg border ${
                              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                            }`}
                          />
                        </div>

                        {/* LinkedIn */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="profile-linkedin" className="font-bold text-slate-500 uppercase">LinkedIn Profile URL</label>
                          <input
                            id="profile-linkedin"
                            data-testid="input-profile-linkedin"
                            name="linkedin"
                            value={form.linkedin}
                            onChange={handleInputChange}
                            className={`p-2.5 rounded-lg border ${
                              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                            }`}
                          />
                        </div>

                        {/* Bio */}
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label htmlFor="profile-bio" className="font-bold text-slate-500 uppercase">Biography</label>
                          <textarea
                            id="profile-bio"
                            data-testid="input-profile-bio"
                            name="bio"
                            value={form.bio}
                            onChange={handleInputChange}
                            rows={3}
                            className={`p-2.5 rounded-lg border w-full resize-none ${
                              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                            }`}
                          />
                        </div>

                        {/* Motivation */}
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label htmlFor="profile-motivation" className="font-bold text-slate-500 uppercase">Motivation</label>
                          <textarea
                            id="profile-motivation"
                            data-testid="input-profile-motivation"
                            name="motivation"
                            value={form.motivation}
                            onChange={handleInputChange}
                            rows={2}
                            className={`p-2.5 rounded-lg border w-full resize-none ${
                              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                            }`}
                          />
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2 flex gap-2 justify-end mt-2">
                          <button
                            type="submit"
                            data-testid="profile-save-btn"
                            aria-label="Save profile settings"
                            disabled={saveStatus === "loading"}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition"
                          >
                            {saveStatus === "loading" ? "Saving…" : "Save Settings"}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Skills Panel */}
                    <div
                      data-testid="skills-panel"
                      className={`p-6 rounded-2xl border flex flex-col gap-4 ${
                        isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Interests &amp; Skills</h4>
                        <p className="text-xs text-slate-500 mt-1">Select topics to spotlight on your profile</p>
                      </div>

                      <div className="flex flex-wrap gap-2" role="group" aria-label="Skill selection">
                        {SKILL_OPTIONS.map((skill) => {
                          const isActive = profile.skills.includes(skill);
                          return (
                            <button
                              key={skill}
                              data-testid={`skill-btn-${skill.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                              aria-pressed={isActive}
                              aria-label={`${isActive ? "Remove" : "Add"} skill: ${skill}`}
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
                </DashboardErrorBoundary>
              )}

            </main>
          </div>
        </div>
      </div>
    </DashboardErrorBoundary>
  );
}